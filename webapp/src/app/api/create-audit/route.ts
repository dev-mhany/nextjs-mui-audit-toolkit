import { NextRequest, NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import { db } from '@/lib/database';
import { validateCreateAuditRequest } from '@/lib/validation';
import { withErrorHandler, logger, performanceMonitor, gitHubCircuitBreaker } from '@/lib/error-handling';
import type { CreateAuditRequest } from '@/types/audit';

export const POST = withErrorHandler(async function POST(request: NextRequest) {
  const endTimer = performanceMonitor.startTimer('create_audit');
  
  try {
    // Parse and validate request body
    const rawBody = await request.json();
    const body: CreateAuditRequest = validateCreateAuditRequest(rawBody);
    
    // Parse repository URL
    const { owner, repo } = parseRepoUrl(body.repoUrl);
    
    // Create audit record in database
    const auditRecord = await db.createAudit({
      repoUrl: body.repoUrl,
      mode: body.mode,
      status: 'queued',
      userEmail: body.userEmail,
    });

    logger.info('Audit creation started', {
      auditId: auditRecord.id,
      repoUrl: body.repoUrl,
      mode: body.mode,
      owner,
      repo,
    });

    let triggerResult: any;

    if (body.mode === 'app') {
      // Use GitHub App flow (preferred)
      triggerResult = await triggerAuditViaApp(owner, repo, auditRecord.id);
    } else if (body.mode === 'pat' && body.pat) {
      // Use Personal Access Token flow (fallback with warnings)
      logger.warn('Using PAT flow - recommend GitHub App for better security', {
        auditId: auditRecord.id,
        repoUrl: body.repoUrl,
      });
      triggerResult = await triggerAuditViaPAT(owner, repo, body.pat, auditRecord.id);
    } else {
      throw new Error('Invalid authentication mode or missing PAT');
    }

    if (!triggerResult.success) {
      await db.updateAudit(auditRecord.id, {
        status: 'failed',
        error: triggerResult.error,
      });
      throw new Error(`Failed to trigger audit: ${triggerResult.error}`);
    }

    // Update audit record with run details
    await db.updateAudit(auditRecord.id, {
      status: 'running',
      workflowRunId: triggerResult.runId?.toString(),
      prUrl: triggerResult.prUrl,
    });

    endTimer();

    return NextResponse.json({
      success: true,
      runId: triggerResult.runId,
      prUrl: triggerResult.prUrl,
      auditId: auditRecord.id,
      message: 'Audit triggered successfully',
    });

  } catch (error: any) {
    endTimer();
    logger.error('Failed to create audit', {
      error: error.message,
      repoUrl: request.body?.repoUrl,
    });
    
    return NextResponse.json(
      { error: 'Failed to create audit', details: error.message },
      { status: 500 }
    );
  }
});

async function triggerAuditViaApp(owner: string, repo: string, auditId: string) {
  try {
    // Get GitHub App installation for this repository
    const installation = await githubService.getInstallation(owner, repo);
    
    if (!installation) {
      return {
        success: false,
        error: 'GitHub App not installed for this repository. Please install the app first.',
      };
    }

    // Create short-lived token using the installation
    const appToken = await githubService.createInstallationToken(installation.id);
    
    // Trigger reusable workflow via repository dispatch
    const dispatch = await githubService.triggerRepositoryDispatch(
      owner,
      repo,
      'dev-mhany-audit',
      {
        audit_id: auditId,
        ref: 'HEAD',
      },
      appToken
    );

    return {
      success: true,
      runId: dispatch.runId,
      prUrl: null, // Will be available later when PR is created
    };

  } catch (error: any) {
    logger.error('GitHub App audit trigger failed', {
      owner,
      repo,
      auditId,
      error: error.message,
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

async function triggerAuditViaPAT(owner: string, repo: string, pat: string, auditId: string) {
  try {
    // Validate PAT has minimal required scopes
    const github = new (githubService.constructor as any)(pat);
    
    // Check repository access
    await github.validateRepository(`https://github.com/${owner}/${repo}`, pat);
    
    // Trigger repository dispatch with PAT
    const dispatch = await github.triggerRepositoryDispatch(
      owner,
      repo,
      'dev-mhany-audit',
      {
        audit_id: auditId,
        ref: 'HEAD',
      },
      pat
    );

    return {
      success: true,
      runId: dispatch.runId,
      prUrl: null,
    };

  } catch (error: any) {
    logger.error('PAT audit trigger failed', {
      owner,
      repo,
      auditId,
      error: error.message,
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  };
}

export async function GET() {
  return NextResponse.json({
    message: 'Create audit endpoint',
    usage: 'POST to this endpoint with { repoUrl, mode: "app"|"pat", pat?: string }',
    modes: {
      app: 'Preferred: Uses GitHub App with fine-grained permissions',
      pat: 'Fallback: Uses Personal Access Token (warn user about security)',
    },
    returns: '{ runId, prUrl?, auditId }',
    security: 'GitHub App tokens are short-lived and never stored',
  });
}