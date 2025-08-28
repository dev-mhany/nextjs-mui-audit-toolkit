import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { githubService } from '@/lib/github';
import { withErrorHandler, logger, performanceMonitor, gitHubCircuitBreaker } from '@/lib/error-handling';

export const GET = withErrorHandler(async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const endTimer = performanceMonitor.startTimer('audit_status_check');
  
  try {
    const auditId = params.id;
    
    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Get audit record from database
    const audit = await db.getAudit(auditId);
    
    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // If audit is still running and has a workflow run ID, get live status from GitHub
    if (audit.status === 'running' && audit.workflowRunId) {
      try {
        // Try to get live status from GitHub
        const workflowStatus = await gitHubCircuitBreaker.execute(async () => {
          // Extract owner/repo from URL
          const urlParts = audit.repoUrl.split('/');
          const owner = urlParts[urlParts.length - 2];
          const repo = urlParts[urlParts.length - 1];
          
          return await githubService.getWorkflowRunStatus(
            owner,
            repo,
            parseInt(audit.workflowRunId!, 10)
          );
        });

        // Update local status if it has changed
        if (workflowStatus.conclusion && workflowStatus.conclusion !== 'in_progress') {
          const newStatus = mapGitHubStatusToAuditStatus(workflowStatus.conclusion);
          
          if (newStatus !== audit.status) {
            await db.updateAudit(auditId, {
              status: newStatus,
              updatedAt: new Date().toISOString(),
            });
            
            audit.status = newStatus;
            logger.info('Audit status updated via polling', {
              auditId,
              oldStatus: 'running',
              newStatus,
              source: 'github_polling',
            });
          }
        }
        
        // Add GitHub workflow information to response
        audit.githubWorkflow = {
          id: workflowStatus.id,
          status: workflowStatus.status || 'unknown',
          conclusion: workflowStatus.conclusion,
          html_url: workflowStatus.html_url,
          created_at: workflowStatus.created_at,
          updated_at: workflowStatus.updated_at,
        };

      } catch (error: any) {
        // Log error but continue with database status
        logger.warn('Failed to get live workflow status', {
          auditId,
          workflowRunId: audit.workflowRunId,
          error: error.message,
        });
      }
    }

    // Calculate progress percentage
    const progress = calculateProgress(audit);

    // Prepare response
    const response = {
      id: audit.id,
      repoUrl: audit.repoUrl,
      branch: audit.branch,
      status: audit.status,
      progress,
      score: audit.score,
      grade: audit.grade,
      criticalIssues: audit.criticalIssues,
      createdAt: audit.createdAt,
      updatedAt: audit.updatedAt,
      completedAt: audit.completedAt,
      workflowRunId: audit.workflowRunId,
      error: audit.error,
      githubWorkflow: audit.githubWorkflow,
    };

    endTimer();

    return NextResponse.json(response);

  } catch (error: any) {
    endTimer();
    logger.error('Failed to get audit status', {
      auditId: params.id,
      error: error.message,
    });
    
    return NextResponse.json(
      { error: 'Failed to get audit status', details: error.message },
      { status: 500 }
    );
  }
});

function mapGitHubStatusToAuditStatus(conclusion: string): 'pending' | 'running' | 'completed' | 'failed' {
  switch (conclusion) {
    case 'success':
      return 'completed';
    case 'failure':
    case 'cancelled':
    case 'timed_out':
      return 'failed';
    case 'in_progress':
    case 'queued':
    case 'waiting':
      return 'running';
    default:
      return 'failed'; // Changed from 'unknown' to 'failed'
  }
}

function calculateProgress(audit: any): { percentage: number; step: string; estimatedTimeRemaining?: string } {
  const now = new Date();
  const created = new Date(audit.createdAt);
  const elapsed = now.getTime() - created.getTime();
  
  switch (audit.status) {
    case 'pending':
      return {
        percentage: 5,
        step: 'Initializing audit workflow',
        estimatedTimeRemaining: '2-3 minutes',
      };
      
    case 'running':
      // Estimate progress based on elapsed time
      // Typical audit takes 3-5 minutes
      const estimatedDuration = 4 * 60 * 1000; // 4 minutes in ms
      const progressPercentage = Math.min(95, 10 + (elapsed / estimatedDuration) * 85);
      
      let step = 'Setting up environment';
      let estimatedTimeRemaining = '3-4 minutes';
      
      if (elapsed > 60000) { // 1 minute
        step = 'Installing dependencies';
        estimatedTimeRemaining = '2-3 minutes';
      }
      if (elapsed > 120000) { // 2 minutes
        step = 'Running audit analysis';
        estimatedTimeRemaining = '1-2 minutes';
      }
      if (elapsed > 180000) { // 3 minutes
        step = 'Generating reports';
        estimatedTimeRemaining = '< 1 minute';
      }
      if (elapsed > 240000) { // 4 minutes
        step = 'Finalizing results';
        estimatedTimeRemaining = '< 30 seconds';
      }
      
      return {
        percentage: Math.round(progressPercentage),
        step,
        estimatedTimeRemaining,
      };
      
    case 'completed':
      return {
        percentage: 100,
        step: 'Audit completed successfully',
      };
      
    case 'failed':
      return {
        percentage: 0,
        step: 'Audit failed',
      };
      
    default:
      return {
        percentage: 0,
        step: 'Unknown status',
      };
  }
}