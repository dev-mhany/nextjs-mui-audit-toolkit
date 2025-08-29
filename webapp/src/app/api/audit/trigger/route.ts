import { NextRequest, NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import { db } from '@/lib/database';
import { validateAuditRequest } from '@/lib/validation';
import { withErrorHandler, logger, performanceMonitor, gitHubCircuitBreaker } from '@/lib/error-handling';
import type { AuditRequest, GitHubRepository } from '@/types/audit';

// Force Node.js runtime for this API route
export const runtime = 'nodejs';

export const POST = withErrorHandler(async function POST(request: NextRequest) {
  const endTimer = performanceMonitor.startTimer('audit_trigger');
  
  try {
    // Parse and validate request body
    const rawBody = await request.json();
    const body: AuditRequest = validateAuditRequest(rawBody);
    
    // Create GitHub service instance with user token if provided
    const github = new (githubService.constructor as any)(body.githubToken);

    // Validate repository access using circuit breaker
    let repoInfo: GitHubRepository;
    try {
      repoInfo = await gitHubCircuitBreaker.execute(() => 
        github.validateRepository(body.repoUrl, body.githubToken)
      );
    } catch (error: unknown) {
      logger.securityEvent('repository_access_denied', {
        repoUrl: body.repoUrl,
        error: error instanceof Error ? error.message : String(error),
        ip: request.ip,
      });
      throw error;
    }

    // Create audit record in database
    const auditRecord = await db.createAudit({
      repoUrl: body.repoUrl,
      branch: body.branch || repoInfo.defaultBranch,
      status: 'pending',
    });

    // Log audit start
    logger.info('Audit started', {
      auditId: auditRecord.id,
      repoUrl: body.repoUrl,
      userEmail: body.userEmail,
      branch: body.branch,
      hasCustomConfig: !!body.auditConfig,
    });

    // Check project compatibility
    try {
          const compatibility: Record<string, unknown> = await gitHubCircuitBreaker.execute(() =>
      github.checkProjectCompatibility(body.repoUrl, body.githubToken)
    );
      
      if (!compatibility.hasNextjs) {
        logger.warn('Invalid project type', {
          repoUrl: body.repoUrl,
          reason: 'not_nextjs',
        });
        throw new Error('Repository does not appear to be a Next.js project');
      }

      if (!compatibility.hasMui) {
        logger.warn('Invalid project type', {
          repoUrl: body.repoUrl,
          reason: 'no_mui',
        });
        throw new Error('Repository does not appear to use Material-UI');
      }
    } catch (error: any) {
      // Log the error but don't fail the audit - maybe package.json is not in root
      logger.warn('Could not check project compatibility', {
        repoUrl: body.repoUrl,
        error: error.message,
      });
    }

    // Create audit workflow in the repository
    const workflowResult: Record<string, unknown> = await gitHubCircuitBreaker.execute(() =>
      github.createAuditWorkflow(body.repoUrl, body.githubToken)
    );
    
    if (!workflowResult.success) {
      throw new Error(`Failed to create audit workflow: ${workflowResult.error}`);
    }

    // Prepare workflow inputs
    const workflowInputs = {
      audit_config: JSON.stringify(body.auditConfig || {}),
      user_email: body.userEmail || '',
      audit_id: auditRecord.id,
    };

    // Trigger the GitHub Actions workflow
    const triggerResult: Record<string, unknown> = await gitHubCircuitBreaker.execute(() =>
      github.triggerWorkflow(
        body.repoUrl,
        'nextjs-mui-audit.yml',
        workflowInputs,
        body.githubToken
      )
    );

    if (!triggerResult.success) {
      // Update audit record with error
      await db.updateAudit(auditRecord.id, {
        status: 'failed',
        error: triggerResult.error as string,
      });

      logger.error('Audit failed', {
        auditId: auditRecord.id,
        error: (triggerResult.error as string) || 'Unknown error',
      });
      throw new Error(`Failed to trigger audit workflow: ${triggerResult.error as string}`);
    }

    // Update audit record with workflow run ID
    const updatedAudit = await db.updateAudit(auditRecord.id, {
      status: 'running',
      workflowRunId: triggerResult.workflowRunId?.toString(),
    });

    // Log successful completion
    logger.info('Audit completed successfully', {
      auditId: auditRecord.id,
      workflowRunId: triggerResult.workflowRunId,
      repository: repoInfo.fullName,
    });

    endTimer(); // Record performance metric

    return NextResponse.json({
      success: true,
      auditId: auditRecord.id,
      workflowId: triggerResult.workflowRunId,
      repository: {
        name: repoInfo.fullName,
        private: repoInfo.private,
        defaultBranch: repoInfo.defaultBranch,
      },
      message: 'Audit workflow triggered successfully',
    });

  } finally {
    endTimer();
  }
});

export async function GET() {
  return NextResponse.json({
    message: 'Audit trigger endpoint',
    usage: 'POST to this endpoint with audit request data',
    requiredFields: ['repoUrl'],
    optionalFields: ['githubToken', 'branch', 'auditConfig', 'userEmail'],
    rateLimit: '5 requests per minute',
    security: 'Input validation and sanitization applied',
  });
}