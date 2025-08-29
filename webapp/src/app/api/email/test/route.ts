import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { withErrorHandler, logger } from '@/lib/error-handling';
import { sanitizeEmail } from '@/lib/validation';

// Force Node.js runtime for this API route
export const runtime = 'nodejs';

export const POST = withErrorHandler(async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const validatedEmail = sanitizeEmail(email);

    // Check if email service is configured
    if (!emailService) {
      return NextResponse.json({
        success: false,
        error: 'Email service is not configured',
        details: 'Please check your environment configuration for email settings',
        configured: false,
      });
    }

    // Test email service connection
    const connectionTest = await emailService.verifyConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Email service connection failed',
        details: connectionTest.error,
        configured: true,
        connectionWorking: false,
      });
    }

    // Send test email
    const testResult = await emailService.sendAuditCompletionEmail(validatedEmail, {
      id: 'test-audit-' + Date.now(),
      repoUrl: 'https://github.com/example/test-repo',
      branch: 'main',
      status: 'completed',
      score: 95,
      letterGrade: 'A',
      criticalIssues: 0,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });

    if (testResult.success) {
      logger.info('Test email sent successfully', {
        email: validatedEmail,
        messageId: testResult.messageId,
      });

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: testResult.messageId,
        configured: true,
        connectionWorking: true,
      });
    } else {
      logger.error('Failed to send test email', {
        email: validatedEmail,
        error: testResult.error,
      });

      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: testResult.error,
        configured: true,
        connectionWorking: true,
      });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Email test failed', {
      error: errorMessage,
    });

    return NextResponse.json(
      { 
        success: false,
        error: 'Email test failed', 
        details: error instanceof Error ? error.message : String(error),
        configured: !!emailService,
      },
      { status: 500 }
    );
  }
});

export async function GET() {
  try {
    const status = {
      configured: !!emailService,
      connectionWorking: false,
      provider: process.env.EMAIL_PROVIDER || 'not configured',
      fromAddress: process.env.EMAIL_FROM_ADDRESS || 'not configured',
    };

    if (emailService) {
      try {
        const connectionTest = await emailService.verifyConnection();
        status.connectionWorking = connectionTest.success;
      } catch (error) {
        // Connection test failed, but service is configured
        status.connectionWorking = false;
      }
    }

    return NextResponse.json({
      message: 'Email service status',
      status,
      testEndpoint: 'POST to this endpoint with {"email": "test@example.com"} to send a test email',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to check email service status', details: errorMessage },
      { status: 500 }
    );
  }
}