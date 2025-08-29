import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { githubService } from '@/lib/github'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auditId = params.id

    if (!auditId) {
      return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 })
    }

    // Get audit record from database
    const audit = await db.getAudit(auditId)

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // If audit has a workflow run ID, get status from GitHub
    if (audit.workflowRunId && audit.status === 'running') {
      try {
        // Parse repository URL to get owner and repo
        const { owner, repo } = parseRepoUrl(audit.repoUrl)

        const workflowStatus = await githubService.getWorkflowRunStatus(
          owner,
          repo,
          parseInt(audit.workflowRunId, 10)
        )

        // Update audit status based on workflow status
        let newStatus: 'pending' | 'running' | 'completed' | 'failed' | 'queued' =
          audit.status
        let score = audit.score
        let error = audit.error

        if (workflowStatus.status === 'completed') {
          if (workflowStatus.conclusion === 'success') {
            newStatus = 'completed'
            // In a real implementation, you might parse the audit results
            // from the workflow artifacts or commits
            score = 85 // Placeholder
          } else {
            newStatus = 'failed'
            error = `Workflow failed with conclusion: ${workflowStatus.conclusion}`
          }

          // Update the audit record
          await db.updateAudit(auditId, {
            status: newStatus,
            score,
            error,
            completedAt: workflowStatus.updated_at
          })
        }

        // Calculate progress percentage based on workflow status
        let percentage = 0
        let step = 'Initializing'

        switch (workflowStatus.status) {
          case 'queued':
            percentage = 10
            step = 'Queued for execution'
            break
          case 'in_progress':
            percentage = 50
            step = 'Running audit analysis'
            break
          case 'completed':
            percentage = 100
            step =
              workflowStatus.conclusion === 'success' ? 'Audit completed' : 'Audit failed'
            break
          default:
            percentage = 5
            step = 'Starting workflow'
        }

        return NextResponse.json({
          workflowId: audit.workflowRunId,
          step,
          percentage,
          status: workflowStatus.status,
          conclusion: workflowStatus.conclusion,
          logs: [], // In a real implementation, you might fetch logs from GitHub API
          audit: {
            ...audit,
            status: newStatus,
            score,
            error
          }
        })
      } catch (error: any) {
        console.error('Error fetching workflow status:', error)

        // Return cached audit status if GitHub API fails
        return NextResponse.json({
          workflowId: audit.workflowRunId,
          step: 'Unable to fetch live status',
          percentage: 50,
          status: 'unknown',
          logs: [`Error fetching status: ${error.message}`],
          audit
        })
      }
    }

    // Return basic progress for audits without workflow tracking
    let percentage = 0
    let step = 'Unknown'

    switch (audit.status) {
      case 'pending':
        percentage = 5
        step = 'Audit queued'
        break
      case 'running':
        percentage = 50
        step = 'Audit in progress'
        break
      case 'completed':
        percentage = 100
        step = 'Audit completed'
        break
      case 'failed':
        percentage = 100
        step = 'Audit failed'
        break
    }

    return NextResponse.json({
      workflowId: audit.workflowRunId || 'unknown',
      step,
      percentage,
      status: audit.status,
      logs: audit.error ? [audit.error] : [],
      audit
    })
  } catch (error: any) {
    console.error('Error fetching audit progress:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch audit progress',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Helper function to parse GitHub repository URL
function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error('Invalid GitHub repository URL')
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  }
}
