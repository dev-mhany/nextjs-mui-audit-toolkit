import nodemailer from 'nodemailer'
import type { AuditResult } from '@/types/audit'
import { logger } from '@/lib/error-handling'

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'resend'
  host?: string
  port?: number
  secure?: boolean
  auth?: {
    user: string
    pass: string
  }
  apiKey?: string
  fromEmail: string
  fromName: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
    this.initializeTransporter()
  }

  private initializeTransporter(): void {
    try {
      switch (this.config.provider) {
        case 'smtp':
          this.transporter = nodemailer.createTransport({
            host: this.config.host!,
            port: this.config.port || 587,
            secure: this.config.secure || false,
            auth: this.config.auth
          })
          break

        case 'sendgrid':
          this.transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: 'apikey',
              pass: this.config.apiKey!
            }
          })
          break

        case 'mailgun':
          // Mailgun configuration would go here
          throw new Error('Mailgun provider not implemented yet')

        case 'resend':
          // Resend configuration would go here
          throw new Error('Resend provider not implemented yet')

        default:
          throw new Error(`Unsupported email provider: ${this.config.provider}`)
      }

      logger.info('Email service initialized', {
        provider: this.config.provider,
        host: this.config.host
      })
    } catch (error: unknown) {
      logger.error('Failed to initialize email service', {
        provider: this.config.provider,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Send audit completion email notification
   */
  async sendAuditCompletionEmail(
    recipientEmail: string,
    auditResult: AuditResult
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email service not properly initialized'
      }
    }

    try {
      const template = this.generateAuditCompletionTemplate(auditResult)

      const mailOptions = {
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      }

      const result = await this.transporter.sendMail(mailOptions)

      logger.info('Audit completion email sent', {
        auditId: auditResult.id,
        recipientEmail,
        messageId: result.messageId,
        score: auditResult.score
      })

      return {
        success: true,
        messageId: result.messageId
      }
    } catch (error: any) {
      logger.error('Failed to send audit completion email', {
        auditId: auditResult.id,
        recipientEmail,
        error: error.message
      })

      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send audit failure notification
   */
  async sendAuditFailureEmail(
    recipientEmail: string,
    auditResult: AuditResult
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email service not properly initialized'
      }
    }

    try {
      const template = this.generateAuditFailureTemplate(auditResult)

      const mailOptions = {
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      }

      const result = await this.transporter.sendMail(mailOptions)

      logger.warn('Audit failure email sent', {
        auditId: auditResult.id,
        recipientEmail,
        messageId: result.messageId,
        error: auditResult.error
      })

      return {
        success: true,
        messageId: result.messageId
      }
    } catch (error: any) {
      logger.error('Failed to send audit failure email', {
        auditId: auditResult.id,
        recipientEmail,
        error: error.message
      })

      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate email template for successful audit completion
   */
  private generateAuditCompletionTemplate(auditResult: AuditResult): EmailTemplate {
    const gradeColor = this.getGradeColor(auditResult.letterGrade)
    const scoreColor = this.getScoreColor(auditResult.score)

    const subject = `🔍 Audit Complete: ${auditResult.repoUrl} - Grade ${auditResult.letterGrade || 'N/A'}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Audit Completed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 30px 20px; }
          .score-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; border-left: 4px solid ${scoreColor}; }
          .score { font-size: 48px; font-weight: 700; color: ${scoreColor}; margin: 0; }
          .grade { font-size: 24px; font-weight: 600; color: ${gradeColor}; margin: 5px 0; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .critical-issues { color: #dc3545; font-weight: 600; }
          .actions { margin: 30px 0; text-align: center; }
          .btn { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 5px; }
          .btn:hover { background: #5a67d8; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .logo { color: #667eea; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 Audit Completed</h1>
            <p>Your Next.js + MUI audit has finished successfully</p>
          </div>
          
          <div class="content">
            <div class="score-card">
              <div class="score">${auditResult.score || 0}/100</div>
              <div class="grade">Grade: ${auditResult.letterGrade || 'N/A'}</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Repository:</span>
                <span class="detail-value">${auditResult.repoUrl}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Branch:</span>
                <span class="detail-value">${auditResult.branch}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Critical Issues:</span>
                <span class="detail-value critical-issues">${auditResult.criticalIssues || 0}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Completed:</span>
                <span class="detail-value">${new Date(auditResult.completedAt || '').toLocaleString()}</span>
              </div>
            </div>
            
            <div class="actions">
              ${auditResult.reportUrl ? `<a href="${auditResult.reportUrl}" class="btn">View Detailed Report</a>` : ''}
              ${auditResult.workflowRunId ? `<a href="https://github.com/${this.extractRepoFromUrl(auditResult.repoUrl)}/actions/runs/${auditResult.workflowRunId}" class="btn">View Workflow</a>` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>Automated audit by <span class="logo">dev-mhany</span> using Next.js + MUI Audit Toolkit</p>
            <p>This audit helps ensure your Next.js + Material-UI project follows best practices and performance standards.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
🔍 Audit Completed

Your Next.js + MUI audit has finished successfully!

Score: ${auditResult.score || 0}/100
Grade: ${auditResult.letterGrade || 'N/A'}

Repository: ${auditResult.repoUrl}
Branch: ${auditResult.branch}
Critical Issues: ${auditResult.criticalIssues || 0}
Completed: ${new Date(auditResult.completedAt || '').toLocaleString()}

${auditResult.reportUrl ? `View Report: ${auditResult.reportUrl}` : ''}
${auditResult.workflowRunId ? `View Workflow: https://github.com/${this.extractRepoFromUrl(auditResult.repoUrl)}/actions/runs/${auditResult.workflowRunId}` : ''}

---
Automated audit by dev-mhany using Next.js + MUI Audit Toolkit
    `

    return { subject, html, text }
  }

  /**
   * Generate email template for audit failure
   */
  private generateAuditFailureTemplate(auditResult: AuditResult): EmailTemplate {
    const subject = `❌ Audit Failed: ${auditResult.repoUrl}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Audit Failed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 30px 20px; }
          .error-card { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .error-title { color: #721c24; font-weight: 600; margin-bottom: 10px; }
          .error-message { color: #721c24; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .actions { margin: 30px 0; text-align: center; }
          .btn { display: inline-block; background: #dc3545; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 5px; }
          .btn:hover { background: #c82333; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .logo { color: #667eea; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Audit Failed</h1>
            <p>There was an issue running your Next.js + MUI audit</p>
          </div>
          
          <div class="content">
            <div class="error-card">
              <div class="error-title">Error Details:</div>
              <div class="error-message">${auditResult.error || 'Unknown error occurred during audit execution'}</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Repository:</span>
                <span class="detail-value">${auditResult.repoUrl}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Branch:</span>
                <span class="detail-value">${auditResult.branch}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Failed At:</span>
                <span class="detail-value">${new Date(auditResult.updatedAt || '').toLocaleString()}</span>
              </div>
            </div>
            
            <div class="actions">
              ${auditResult.workflowRunId ? `<a href="https://github.com/${this.extractRepoFromUrl(auditResult.repoUrl)}/actions/runs/${auditResult.workflowRunId}" class="btn">View Workflow Logs</a>` : ''}
            </div>
            
            <p><strong>What to do next:</strong></p>
            <ul>
              <li>Check the workflow logs for detailed error information</li>
              <li>Ensure your repository has the required dependencies (Next.js + MUI)</li>
              <li>Verify that the GitHub Actions workflow has proper permissions</li>
              <li>Try running the audit again after fixing any issues</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Automated audit by <span class="logo">dev-mhany</span> using Next.js + MUI Audit Toolkit</p>
            <p>Need help? Check our documentation or create an issue on GitHub.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
❌ Audit Failed

There was an issue running your Next.js + MUI audit.

Error: ${auditResult.error || 'Unknown error occurred during audit execution'}

Repository: ${auditResult.repoUrl}
Branch: ${auditResult.branch}
Failed At: ${new Date(auditResult.updatedAt || '').toLocaleString()}

${auditResult.workflowRunId ? `View Workflow Logs: https://github.com/${this.extractRepoFromUrl(auditResult.repoUrl)}/actions/runs/${auditResult.workflowRunId}` : ''}

What to do next:
- Check the workflow logs for detailed error information
- Ensure your repository has the required dependencies (Next.js + MUI)
- Verify that the GitHub Actions workflow has proper permissions
- Try running the audit again after fixing any issues

---
Automated audit by dev-mhany using Next.js + MUI Audit Toolkit
    `

    return { subject, html, text }
  }

  private getScoreColor(score?: number): string {
    if (!score) return '#6c757d'
    if (score >= 90) return '#28a745'
    if (score >= 80) return '#20c997'
    if (score >= 70) return '#ffc107'
    if (score >= 60) return '#fd7e14'
    return '#dc3545'
  }

  private getGradeColor(grade?: string): string {
    if (!grade) return '#6c757d'
    if (grade.startsWith('A')) return '#28a745'
    if (grade.startsWith('B')) return '#20c997'
    if (grade.startsWith('C')) return '#ffc107'
    if (grade.startsWith('D')) return '#fd7e14'
    return '#dc3545'
  }

  private extractRepoFromUrl(url: string): string {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/)
    return match ? match[1] : ''
  }

  /**
   * Verify email service configuration and connectivity
   */
  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email service not initialized'
      }
    }

    try {
      await this.transporter.verify()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Factory function to create email service instance
export function createEmailService(): EmailService | null {
  try {
    const config: EmailConfig = {
      provider: (process.env.EMAIL_PROVIDER as any) || 'smtp',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth:
        process.env.EMAIL_USER && process.env.EMAIL_PASS
          ? {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          : undefined,
      apiKey: process.env.EMAIL_API_KEY,
      fromEmail: process.env.EMAIL_FROM_ADDRESS || 'noreply@dev-mhany.com',
      fromName: process.env.EMAIL_FROM_NAME || 'dev-mhany Audit Bot'
    }

    // Only create service if properly configured
    if (!config.host && !config.apiKey) {
      logger.warn('Email service not configured - notifications will be skipped')
      return null
    }

    return new EmailService(config)
  } catch (error: any) {
    logger.error('Failed to create email service', {
      error: error.message
    })
    return null
  }
}

export const emailService = createEmailService()
