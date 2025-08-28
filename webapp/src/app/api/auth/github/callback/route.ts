import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { githubService } from '@/lib/github';
import { withErrorHandler, logger } from '@/lib/error-handling';

export const GET = withErrorHandler(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get('installation_id');
    const setupAction = searchParams.get('setup_action');
    
    if (!installationId) {
      return NextResponse.json(
        { error: 'Missing installation_id parameter' },
        { status: 400 }
      );
    }

    // Get installation details from GitHub
    const installation = await githubService.getInstallationById(installationId);
    
    if (!installation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    // Store installation information (no tokens, just metadata)
    const installationRecord = await db.storeInstallation({
      installationId: installation.id,
      accountType: installation.account.type,
      accountLogin: installation.account.login,
      repositorySelection: installation.repository_selection,
      permissions: installation.permissions,
      setupAction,
      createdAt: new Date().toISOString(),
    });

    logger.info('GitHub App installation processed', {
      installationId: installation.id,
      account: installation.account.login,
      setupAction,
      repoCount: installation.repository_selection === 'selected' 
        ? installation.repositories?.length 
        : 'all',
    });

    // Redirect to success page with installation info
    const successUrl = new URL('/auth/success', request.url);
    successUrl.searchParams.set('installation_id', installationId);
    successUrl.searchParams.set('account', installation.account.login);
    successUrl.searchParams.set('setup_action', setupAction || 'install');

    return NextResponse.redirect(successUrl);

  } catch (error: any) {
    logger.error('GitHub App callback failed', {
      installationId: request.url,
      error: error.message,
    });
    
    // Redirect to error page
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', 'installation_failed');
    errorUrl.searchParams.set('message', error.message);
    
    return NextResponse.redirect(errorUrl);
  }
});

// Handle webhook events from GitHub App
export const POST = withErrorHandler(async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256');
    const githubEvent = request.headers.get('x-github-event');
    const rawBody = await request.text();
    
    // Verify webhook signature
    if (!signature || !githubEvent) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    const isValid = await githubService.verifyWebhookSignature(
      rawBody,
      signature,
      process.env.GITHUB_WEBHOOK_SECRET
    );
    
    if (!isValid) {
      logger.securityEvent('invalid_webhook_signature', {
        event: githubEvent,
        ip: request.ip,
      });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    // Handle different webhook events
    switch (githubEvent) {
      case 'installation':
        await handleInstallationEvent(payload);
        break;
        
      case 'installation_repositories':
        await handleInstallationRepositoriesEvent(payload);
        break;
        
      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;
        
      case 'check_run':
        await handleCheckRunEvent(payload);
        break;
        
      default:
        logger.info('Unhandled webhook event', {
          event: githubEvent,
          action: payload.action,
        });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    logger.error('Webhook processing failed', {
      error: error.message,
    });
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
});

async function handleInstallationEvent(payload: any) {
  const { action, installation } = payload;
  
  if (action === 'created') {
    await db.storeInstallation({
      installationId: installation.id,
      accountType: installation.account.type,
      accountLogin: installation.account.login,
      repositorySelection: installation.repository_selection,
      permissions: installation.permissions,
      setupAction: 'webhook_install',
      createdAt: new Date().toISOString(),
    });
    
    logger.info('GitHub App installed via webhook', {
      installationId: installation.id,
      account: installation.account.login,
    });
    
  } else if (action === 'deleted') {
    await db.removeInstallation(installation.id);
    
    logger.info('GitHub App uninstalled', {
      installationId: installation.id,
      account: installation.account.login,
    });
  }
}

async function handleInstallationRepositoriesEvent(payload: any) {
  const { action, installation, repositories_added, repositories_removed } = payload;
  
  logger.info('Installation repositories changed', {
    installationId: installation.id,
    action,
    added: repositories_added?.length || 0,
    removed: repositories_removed?.length || 0,
  });
  
  // Update installation record with new repository list
  await db.updateInstallationRepositories(
    installation.id,
    repositories_added,
    repositories_removed
  );
}

async function handlePullRequestEvent(payload: any) {
  const { action, pull_request, repository } = payload;
  
  // Check if this is an audit PR
  if (pull_request.head.ref?.startsWith('chore/audit-') && 
      pull_request.title?.includes('Audit: Next.js + MUI')) {
    
    const auditId = extractAuditIdFromPR(pull_request);
    
    if (auditId) {
      await db.updateAudit(auditId, {
        prUrl: pull_request.html_url,
        prNumber: pull_request.number,
        prState: pull_request.state,
        updatedAt: new Date().toISOString(),
      });
      
      logger.info('Audit PR updated', {
        auditId,
        prUrl: pull_request.html_url,
        action,
        state: pull_request.state,
      });
    }
  }
}

async function handleCheckRunEvent(payload: any) {
  const { action, check_run, repository } = payload;
  
  // Check if this is our audit check run
  if (check_run.name?.includes('dev-mhany audit') && action === 'completed') {
    const auditId = extractAuditIdFromCheckRun(check_run);
    
    if (auditId) {
      const grade = extractGradeFromCheckRun(check_run);
      
      await db.updateAudit(auditId, {
        status: check_run.conclusion === 'success' ? 'completed' : 'failed',
        grade,
        checkRunUrl: check_run.html_url,
        updatedAt: new Date().toISOString(),
      });
      
      logger.info('Audit check run completed', {
        auditId,
        conclusion: check_run.conclusion,
        grade,
      });
    }
  }
}

function extractAuditIdFromPR(pullRequest: any): string | null {
  const bodyMatch = pullRequest.body?.match(/audit[_-]id:\s*([a-zA-Z0-9-]+)/i);
  if (bodyMatch) return bodyMatch[1];
  
  const branchMatch = pullRequest.head.ref?.match(/audit[_-]([a-zA-Z0-9-]+)/);
  if (branchMatch) return branchMatch[1];
  
  return null;
}

function extractAuditIdFromCheckRun(checkRun: any): string | null {
  const summaryMatch = checkRun.output?.summary?.match(/audit[_-]id:\s*([a-zA-Z0-9-]+)/i);
  if (summaryMatch) return summaryMatch[1];
  
  return null;
}

function extractGradeFromCheckRun(checkRun: any): string | null {
  const summaryMatch = checkRun.output?.summary?.match(/Grade:\s*([A-F][+-]?)/i);
  if (summaryMatch) return summaryMatch[1];
  
  return null;
}