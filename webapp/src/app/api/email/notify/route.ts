import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'
import { withErrorHandler, logger } from '@/lib/error-handling'
import type { AuditResult } from '@/types/audit'

export const POST = withErrorHandler(async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, auditResult, templateType = 'completion' } = body

    if (!to || !auditResult) {
      return NextResponse.json(
        { error: 'Missing required fields: to, auditResult' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!emailService) {
      logger.warn('Email service not configured - skipping notification', {
        recipientEmail: to,
        auditId: auditResult.id
      })

      return NextResponse.json({
        success: false,
        error: 'Email service not configured',
        message: 'Email notifications are currently disabled due to missing configuration'
      })
    }

    let emailResult

    switch (templateType) {
      case 'completion':
        emailResult = await emailService.sendAuditCompletionEmail(to, auditResult)
        break

      case 'failure':
        emailResult = await emailService.sendAuditFailureEmail(to, auditResult)
        break

      default:
        return NextResponse.json(
          { error: `Unknown template type: ${templateType}` },
          { status: 400 }
        )
    }

    if (emailResult.success) {
      logger.info('Email notification sent successfully', {
        recipientEmail: to,
        auditId: auditResult.id,
        templateType,
        messageId: emailResult.messageId
      })

      return NextResponse.json({
        success: true,
        messageId: emailResult.messageId,
        message: 'Email notification sent successfully'
      })
    } else {
      logger.error('Failed to send email notification', {
        recipientEmail: to,
        auditId: auditResult.id,
        templateType,
        error: emailResult.error
      })

      return NextResponse.json(
        {
          success: false,
          error: emailResult.error,
          message: 'Failed to send email notification'
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Email notification API error', {
      error: errorMessage
    })

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
})

// Test endpoint for email service verification
export const GET = withErrorHandler(async function GET(request: NextRequest) {
  if (!emailService) {
    return NextResponse.json({
      configured: false,
      message: 'Email service not configured. Check environment variables.',
      requiredVars: [
        'EMAIL_PROVIDER',
        'EMAIL_HOST (for SMTP)',
        'EMAIL_PORT (for SMTP)',
        'EMAIL_USER (for SMTP)',
        'EMAIL_PASS (for SMTP)',
        'EMAIL_API_KEY (for SendGrid/others)',
        'EMAIL_FROM_ADDRESS',
        'EMAIL_FROM_NAME'
      ]
    })
  }

  try {
    const verification = await emailService.verifyConnection()

    return NextResponse.json({
      configured: true,
      connectionVerified: verification.success,
      error: verification.error,
      message: verification.success
        ? 'Email service is properly configured and connection verified'
        : `Email service configured but connection failed: ${verification.error}`
    })
  } catch (error: any) {
    return NextResponse.json({
      configured: true,
      connectionVerified: false,
      error: error.message,
      message: 'Email service configured but verification failed'
    })
  }
})
