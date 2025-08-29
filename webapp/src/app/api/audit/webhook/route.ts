import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { withErrorHandler, logger, performanceMonitor } from '@/lib/error-handling'
import { validateWebhookSignature, validateWebhookPayload } from '@/lib/validation'
import { emailService } from '@/lib/email'
import type { WebhookPayload } from '@/types/audit'

export const POST = withErrorHandler(async function POST(request: NextRequest) {
  const endTimer = performanceMonitor.startTimer('webhook_processing')

  try {
    // Get the raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const githubEvent = request.headers.get('x-github-event')

    // Verify webhook signature for security
    const isValidSignature = await validateWebhookSignature(
      rawBody,
      signature,
      process.env.GITHUB_WEBHOOK_SECRET
    )

    if (!isValidSignature) {
      logger.securityEvent('invalid_webhook_signature', {
        ip: request.ip,
        userAgent: request.headers.get('user-agent'),
        event: githubEvent
      })

      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    // Parse and validate payload
    const payload: WebhookPayload = JSON.parse(rawBody)
    const validatedPayload = validateWebhookPayload(payload)

    // Log webhook received
    logger.info('Webhook received', {
      event: githubEvent,
      auditId: validatedPayload.audit_id,
      status: validatedPayload.status,
      repository: validatedPayload.repository
    })

    // Handle different webhook events
    switch (githubEvent) {
      case 'workflow_run':
        await handleWorkflowRunEvent(validatedPayload)
        break

      case 'audit_completed':
        await handleAuditCompletedEvent(validatedPayload)
        break

      default:
        logger.warn('Unhandled webhook event', {
          event: githubEvent,
          auditId: validatedPayload.audit_id
        })
        break
    }

    endTimer()

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      auditId: validatedPayload.audit_id
    })
  } catch (error: unknown) {
    endTimer()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    logger.error('Webhook processing failed', {
      error: errorMessage,
      stack: errorStack
    })

    return NextResponse.json(
      { error: 'Webhook processing failed', details: errorMessage },
      { status: 500 }
    )
  }
})

async function handleWorkflowRunEvent(payload: WebhookPayload) {
  const { audit_id, status, workflow_run_id } = payload

  try {
    // Update audit record based on workflow status
    const updateData: Record<string, unknown> = {
      status: mapWorkflowStatusToAuditStatus(status),
      workflowRunId: workflow_run_id?.toString(),
      updatedAt: new Date().toISOString()
    }

    // If workflow failed, capture error details
    if (status === 'failure' || status === 'cancelled') {
      updateData.error = payload.error || 'Workflow execution failed'
      updateData.failureReason = payload.failure_reason
    }

    // If workflow completed successfully, process results
    if (status === 'success' || status === 'completed') {
      updateData.status = 'completed'

      // Extract audit results if provided
      if (payload.results) {
        updateData.results = payload.results
        updateData.score = payload.results.score
        updateData.grade = payload.results.grade
        updateData.criticalIssues = payload.results.critical_issues
      }
    }

    await db.updateAudit(audit_id, updateData)

    logger.info('Audit status updated via webhook', {
      auditId: audit_id,
      oldStatus: 'running',
      newStatus: updateData.status,
      workflowRunId: workflow_run_id
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Failed to update audit from webhook', {
      auditId: audit_id,
      error: errorMessage
    })
    throw error
  }
}

async function handleAuditCompletedEvent(payload: WebhookPayload) {
  const { audit_id, results, repository } = payload

  try {
    // Update audit with final results
    const updateData = {
      status: 'completed' as const,
      results: results,
      score: results?.score,
      grade: results?.grade,
      criticalIssues: results?.critical_issues,
      completedAt: new Date().toISOString()
    }

    await db.updateAudit(audit_id, updateData)

    // Log successful completion
    logger.auditCompleted(audit_id, {
      score: results?.score,
      grade: results?.grade,
      repository: repository
    })

    // Trigger any post-completion actions (email notifications, etc.)
    await triggerPostCompletionActions(audit_id, updateData)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Failed to handle audit completion', {
      auditId: audit_id,
      error: errorMessage
    })
    throw error
  }
}

function mapWorkflowStatusToAuditStatus(workflowStatus: string): string {
  switch (workflowStatus) {
    case 'queued':
    case 'in_progress':
    case 'waiting':
      return 'running'

    case 'completed':
    case 'success':
      return 'completed'

    case 'failure':
    case 'cancelled':
    case 'timed_out':
      return 'failed'

    default:
      return 'unknown'
  }
}

async function triggerPostCompletionActions(
  auditId: string,
  auditData: Record<string, unknown>
) {
  try {
    // Get audit record to check for email notifications
    const audit = await db.getAudit(auditId)

    if (audit?.userEmail && emailService) {
      // Send email notification
      logger.info('Sending email notification', {
        auditId,
        email: audit.userEmail,
        score: auditData.score,
        status: auditData.status
      })

      try {
        const emailResult =
          auditData.status === 'completed'
            ? await emailService.sendAuditCompletionEmail(audit.userEmail, {
                ...audit,
                ...auditData
              })
            : await emailService.sendAuditFailureEmail(audit.userEmail, {
                ...audit,
                ...auditData
              })

        if (emailResult.success) {
          logger.info('Email notification sent successfully', {
            auditId,
            email: audit.userEmail,
            messageId: emailResult.messageId
          })
        } else {
          logger.error('Failed to send email notification', {
            auditId,
            email: audit.userEmail,
            error: emailResult.error
          })
        }
      } catch (emailError: unknown) {
        const errorMessage =
          emailError instanceof Error ? emailError.message : 'Unknown error'
        logger.error('Email notification error', {
          auditId,
          email: audit.userEmail,
          error: errorMessage
        })
      }
    } else if (audit?.userEmail && !emailService) {
      logger.warn('Email notification requested but email service not configured', {
        auditId,
        email: audit.userEmail
      })
    }

    // Log analytics event
    logger.info('Audit completed analytics', {
      event: 'audit_completed',
      auditId,
      score: auditData.score,
      grade: auditData.grade,
      criticalIssues: auditData.criticalIssues,
      repository: audit?.repoUrl,
      hasEmail: !!audit?.userEmail,
      emailServiceConfigured: !!emailService
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Post-completion actions failed', {
      auditId,
      error: errorMessage
    })
    // Don't throw - these are non-critical actions
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Audit webhook endpoint',
    usage: 'POST GitHub webhook events to this endpoint',
    supportedEvents: ['workflow_run', 'audit_completed'],
    security: 'Webhook signature validation required',
    headers: {
      'x-hub-signature-256': 'GitHub webhook signature',
      'x-github-event': 'Type of GitHub event'
    }
  })
}
