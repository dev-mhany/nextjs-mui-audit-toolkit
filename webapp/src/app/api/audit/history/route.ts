import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const repoUrl = searchParams.get('repo')
    const search = searchParams.get('search')

    let audits

    if (search) {
      // Search audits by query
      audits = await db.searchAudits(search, limit)
    } else if (repoUrl) {
      // Get audits for specific repository
      audits = await db.getAuditsByRepo(repoUrl, limit)
    } else {
      // Get all audits
      audits = await db.getAudits(limit)
    }

    return NextResponse.json(audits)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching audit history:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to fetch audit history',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const auditId = searchParams.get('id')

    if (!auditId) {
      return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 })
    }

    const deleted = await db.deleteAudit(auditId)

    if (!deleted) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Audit deleted successfully' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting audit:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to delete audit',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
