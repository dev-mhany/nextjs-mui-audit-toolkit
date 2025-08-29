import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { githubService } from '@/lib/github'
import { withErrorHandler, logger } from '@/lib/error-handling'
import type { AuditResult } from '@/types/audit'

// Force Node.js runtime for this API route
export const runtime = 'nodejs'

export const GET = withErrorHandler(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const installationId = searchParams.get('installation_id')
    const setupAction = searchParams.get('setup_action')

    if (!installationId) {
      return NextResponse.json(
        { error: 'Missing installation_id parameter' },
        { status: 400 }
      )
    }

    // Get installation details from GitHub
    const installation = await githubService.getInstallationById(installationId)

    if (!installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    // Store installation information (no tokens, just metadata)
    const installationRecord = await db.storeInstallation({
      installationId: installation.id,
      accountType: installation.account.type,
      accountLogin: installation.account.login,
      repositorySelection: installation.repository_selection,
      permissions: installation.permissions,
      setupAction: setupAction || undefined,
      createdAt: new Date().toISOString()
    })

    // Create user session linked to installation
    const session = await db.createSession(
      installation.id,
      installation.account.id?.toString(),
      {
        accountLogin: installation.account.login,
        accountType: installation.account.type,
        setupAction
      }
    )

    logger.info('GitHub App installation processed', {
      installationId: installation.id,
      account: installation.account.login,
      setupAction,
      repoCount:
        installation.repository_selection === 'selected'
          ? installation.repositories?.length
          : 'all'
    })

    // Redirect to success page with installation info
    const successUrl = new URL('/auth/success', request.url)
    successUrl.searchParams.set('installation_id', installationId)
    successUrl.searchParams.set('account', installation.account.login)
    successUrl.searchParams.set('setup_action', setupAction || 'install')

    const response = NextResponse.redirect(successUrl)

    // Set session cookie (httpOnly for security)
    response.cookies.set('audit_session', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response
  } catch (error: any) {
    logger.error('GitHub App callback failed', {
      installationId: request.url,
      error: error.message
    })

    // Redirect to error page
    const errorUrl = new URL('/auth/error', request.url)
    errorUrl.searchParams.set('error', 'installation_failed')
    errorUrl.searchParams.set('message', error.message)

    return NextResponse.redirect(errorUrl)
  }
})

// Handle webhook events from GitHub App
export const POST = withErrorHandler(async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256')
    const githubEvent = request.headers.get('x-github-event')
    const rawBody = await request.text()

    // Verify webhook signature
    if (!signature || !githubEvent) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 })
    }

    const isValid = await githubService.verifyWebhookSignature(
      rawBody,
      signature,
      process.env.GITHUB_WEBHOOK_SECRET
    )

    if (!isValid) {
      logger.securityEvent('invalid_webhook_signature', {
        event: githubEvent,
        ip: request.ip
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // Handle different webhook events
    switch (githubEvent) {
      case 'installation':
        await handleInstallationEvent(payload)
        break

      case 'installation_repositories':
        await handleInstallationRepositoriesEvent(payload)
        break

      case 'pull_request':
        await handlePullRequestEvent(payload)
        break

      case 'check_run':
        await handleCheckRunEvent(payload)
        break

      default:
        logger.info('Unhandled webhook event', {
          event: githubEvent,
          action: payload.action
        })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error('Webhook processing failed', {
      error: error.message
    })

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
})

async function handleInstallationEvent(payload: Record<string, unknown>) {
  const { action, installation } = payload

  if (action === 'created') {
    await db.storeInstallation({
      installationId: (installation as any).id,
      accountType: (installation as any).account.type,
      accountLogin: (installation as any).account.login,
      repositorySelection: (installation as any).repository_selection,
      permissions: (installation as any).permissions,
      setupAction: 'webhook_install',
      createdAt: new Date().toISOString()
    })

    logger.info('GitHub App installed via webhook', {
      installationId: (installation as any).id,
      account: (installation as any).account.login
    })
  } else if (action === 'deleted') {
    await db.removeInstallation((installation as any).id)

    logger.info('GitHub App uninstalled', {
      installationId: (installation as any).id,
      account: (installation as any).account.login
    })
  }
}

async function handleInstallationRepositoriesEvent(payload: Record<string, unknown>) {
  const { action, installation, repositories_added, repositories_removed } = payload

  logger.info('Installation repositories changed', {
    installationId: (installation as any).id,
    action,
    added: (repositories_added as any[])?.length || 0,
    removed: (repositories_removed as any[])?.length || 0
  })

  // Update installation record with new repository list
  await db.updateInstallationRepositories(
    (installation as any).id,
    repositories_added as any[],
    repositories_removed as any[]
  )
}

async function handlePullRequestEvent(payload: Record<string, unknown>) {
  const { action, pull_request, repository } = payload

  // Check if this is an audit PR
  if (
    (pull_request as any).head.ref?.startsWith('chore/audit-') &&
    (pull_request as any).title?.includes('Audit: Next.js + MUI')
  ) {
    const auditId = extractAuditIdFromPR(pull_request as any)

    if (auditId) {
      await db.updateAudit(auditId, {
        prUrl: (pull_request as any).html_url,
        prNumber: (pull_request as any).number,
        prState: (pull_request as any).state,
        updatedAt: new Date().toISOString()
      })

      logger.info('Audit PR updated', {
        auditId,
        prUrl: (pull_request as any).html_url,
        action,
        state: (pull_request as any).state
      })
    }
  }
}

async function handleCheckRunEvent(payload: Record<string, unknown>) {
  const { action, check_run, repository } = payload

  // Check if this is our audit check run
  if ((check_run as any).name?.includes('dev-mhany audit') && action === 'completed') {
    const auditId = extractAuditIdFromCheckRun(check_run as any)

    if (auditId) {
      const grade = extractGradeFromCheckRun(check_run as any)
      const score = extractScoreFromCheckRun(check_run as any)

      const auditUpdate: Partial<AuditResult> = {
        status: ((check_run as any).conclusion === 'success' ? 'completed' : 'failed') as
          | 'completed'
          | 'failed',
        grade: grade || undefined,
        score: score || undefined,
        checkRunUrl: (check_run as any).html_url,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const updatedAudit = await db.updateAudit(auditId, auditUpdate)

      logger.info('Audit check run completed', {
        auditId,
        conclusion: (check_run as any).conclusion,
        grade,
        score
      })

      // Send email notification if audit record has email
      if (updatedAudit?.userEmail) {
        try {
          const emailResponse = await fetch(
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email/notify`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: updatedAudit.userEmail,
                auditResult: updatedAudit,
                templateType:
                  (check_run as any).conclusion === 'success' ? 'completion' : 'failure'
              })
            }
          )

          if (!emailResponse.ok) {
            logger.warn('Failed to send email notification', {
              auditId,
              email: updatedAudit.userEmail,
              status: emailResponse.status
            })
          }
        } catch (error: any) {
          logger.error('Error sending email notification', {
            auditId,
            email: updatedAudit.userEmail,
            error: error.message
          })
        }
      }
    }
  }
}

function extractAuditIdFromPR(pullRequest: Record<string, unknown>): string | null {
  const bodyMatch = (pullRequest.body as string)?.match(/audit[_-]id:\s*([a-zA-Z0-9-]+)/i)
  if (bodyMatch) return bodyMatch[1]

  const branchMatch = (pullRequest.head as any)?.ref?.match(/audit[_-]([a-zA-Z0-9-]+)/)
  if (branchMatch) return branchMatch[1]

  return null
}

function extractAuditIdFromCheckRun(checkRun: Record<string, unknown>): string | null {
  const summaryMatch = (checkRun.output as any)?.summary?.match(
    /audit[_-]id:\s*([a-zA-Z0-9-]+)/i
  )
  if (summaryMatch) return summaryMatch[1]

  return null
}

function extractGradeFromCheckRun(checkRun: Record<string, unknown>): string | null {
  const summaryMatch = (checkRun.output as any)?.summary?.match(/Grade:\s*([A-F][+-]?)/i)
  if (summaryMatch) return summaryMatch[1]

  return null
}

function extractScoreFromCheckRun(checkRun: Record<string, unknown>): number | null {
  const scoreMatch = (checkRun.output as any)?.summary?.match(/Score:\s*(\d+)/i)
  if (scoreMatch) return parseInt(scoreMatch[1], 10)

  return null
}
