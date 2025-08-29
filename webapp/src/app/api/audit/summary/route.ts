import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const summary = await db.getAuditSummary()

    return NextResponse.json(summary)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching audit summary:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to fetch audit summary',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
