import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { githubService } from '@/lib/github';
import { withErrorHandler, logger, gitHubCircuitBreaker } from '@/lib/error-handling';

export const GET = withErrorHandler(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId');
    
    if (!runId) {
      return NextResponse.json(
        { error: 'runId parameter is required' },
        { status: 400 }
      );
    }

    // Get audit record from database
    const audit = await db.getAuditByRunId(runId);
    
    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Get live status from GitHub if still running
    let liveStatus = null;
    if (audit.status === 'running' || audit.status === 'queued') {
      try {
        liveStatus = await getLiveAuditStatus(audit);
        
        // Update local status if changed
        if (liveStatus && liveStatus.state !== audit.status) {
          await db.updateAudit(audit.id, {
            status: liveStatus.state as 'pending' | 'running' | 'completed' | 'failed' | 'queued',
            grade: liveStatus.grade,
            prUrl: liveStatus.prUrl,
            artifacts: liveStatus.artifacts,
            updatedAt: new Date().toISOString(),
          });
          
          audit.status = liveStatus.state as 'pending' | 'running' | 'completed' | 'failed' | 'queued';
          audit.grade = liveStatus.grade;
          audit.prUrl = liveStatus.prUrl;
          audit.artifacts = liveStatus.artifacts;
        }
      } catch (error: any) {
        logger.warn('Failed to get live audit status', {
          auditId: audit.id,
          runId,
          error: error.message,
        });
      }
    }

    const response: {
      state: string;
      grade?: string;
      prUrl?: string;
      artifacts: Record<string, any>;
      auditId: string;
      repoUrl: string;
      createdAt: string;
      updatedAt?: string;
      error?: string;
    } = {
      state: mapAuditStatus(audit.status),
      grade: audit.grade,
      prUrl: audit.prUrl,
      artifacts: audit.artifacts || {},
      auditId: audit.id,
      repoUrl: audit.repoUrl,
      createdAt: audit.createdAt,
      updatedAt: audit.updatedAt,
    };

    // Add error details if failed
    if (audit.status === 'failed' && audit.error) {
      response.error = audit.error;
    }

    return NextResponse.json(response);

  } catch (error: any) {
    logger.error('Failed to get audit status', {
      runId: request.url,
      error: error.message,
    });
    
    return NextResponse.json(
      { error: 'Failed to get audit status', details: error.message },
      { status: 500 }
    );
  }
});

async function getLiveAuditStatus(audit: any) {
  try {
    const { owner, repo } = parseRepoUrl(audit.repoUrl);
    
    // Check for recent workflow runs
    const runs = await githubService.getWorkflowRuns(owner, repo, 'run-audit.yml');
    
    // Find the run for this audit
    const auditRun = runs.find((run: any) => 
      run.id.toString() === audit.workflowRunId ||
      run.head_commit?.message?.includes(`audit-${audit.id}`)
    );

    if (!auditRun) {
      return null;
    }

    let state = 'running';
    let grade = null;
    let prUrl = null;
    let artifacts = {};

    // Map GitHub workflow states
    if (auditRun.status === 'completed') {
      if (auditRun.conclusion === 'success') {
        state = 'completed';
        
        // Look for associated PR
        prUrl = await findAuditPR(owner, repo, audit.id);
        
        // Get artifacts if available
        artifacts = await getAuditArtifacts(owner, repo, auditRun.id);
        
        // Extract grade from check runs or PR
        grade = await extractGradeFromRun(owner, repo, auditRun.id);
        
        // If no grade from check runs, try to parse from the audit report
        if (!grade) {
          grade = await extractGradeFromReport(owner, repo, auditRun.id);
        }
        
      } else {
        state = 'failed';
      }
    } else if (auditRun.status === 'in_progress') {
      state = 'running';
    } else if (auditRun.status === 'queued') {
      state = 'queued';
    }

    return {
      state,
      grade,
      prUrl,
      artifacts,
    };

  } catch (error: any) {
    logger.error('Failed to get live audit status', {
      auditId: audit.id,
      error: error.message,
    });
    return null;
  }
}

async function findAuditPR(owner: string, repo: string, auditId: string) {
  try {
    // Look for PRs with audit branch pattern
    const prs = await githubService.getPullRequests(owner, repo, {
      state: 'open',
      head: `${owner}:chore/audit-`,
    });

    // Find PR that matches this audit
    const auditPR = prs.find((pr: any) => 
      pr.head.ref.includes(`audit-`) &&
      (pr.body?.includes(auditId) || pr.title?.includes('audit'))
    );

    return auditPR?.html_url || null;
  } catch (error) {
    return null;
  }
}

async function getAuditArtifacts(owner: string, repo: string, runId: string) {
  try {
    const artifacts = await githubService.getWorkflowArtifacts(owner, repo, runId);
    
    const auditArtifacts: Record<string, any> = {};
    for (const artifact of artifacts) {
      if (artifact.name.includes('audit')) {
        auditArtifacts[artifact.name] = {
          url: artifact.archive_download_url,
          size: artifact.size_in_bytes,
          createdAt: artifact.created_at,
        };
      }
    }
    
    return auditArtifacts;
  } catch (error) {
    return {};
  }
}

async function extractGradeFromRun(owner: string, repo: string, runId: string) {
  try {
    // Check for check runs with grade information
    const checkRuns = await githubService.getCheckRuns(owner, repo, runId);
    
    const auditCheck = checkRuns.find((check: any) => 
      check.name?.includes('dev-mhany audit')
    );

    if (auditCheck?.output?.summary) {
      const gradeMatch = auditCheck.output.summary.match(/Grade:\s*([A-F][+-]?)/i);
      if (gradeMatch) {
        return gradeMatch[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function extractGradeFromReport(owner: string, repo: string, runId: string) {
  try {
    // Try to get the audit report content from the branch
    const reportContent = await githubService.getRepositoryContent(
      owner,
      repo,
      'audit/REPORT.md',
      `chore/audit-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
    );

    if ('content' in reportContent) {
      const content = Buffer.from(reportContent.content, 'base64').toString('utf-8');
      
      // Look for grade patterns in the report
      const gradeMatch = content.match(/(?:Overall Grade|Grade|Score):\s*([A-F][+-]?)/i);
      if (gradeMatch) {
        return gradeMatch[1];
      }
      
      // Look for score patterns
      const scoreMatch = content.match(/(?:Overall Score|Score):\s*(\d+)/i);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function mapAuditStatus(status: string): string {
  switch (status) {
    case 'pending':
    case 'queued':
      return 'queued';
    case 'running':
      return 'running';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'queued';
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