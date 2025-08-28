import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const summary = await db.getAuditSummary();
    
    return NextResponse.json(summary);

  } catch (error: any) {
    console.error('Error fetching audit summary:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch audit summary',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}