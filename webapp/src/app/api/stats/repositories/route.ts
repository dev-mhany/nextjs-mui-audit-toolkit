import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const stats = await db.getRepositoryStats();
    
    return NextResponse.json({
      repositories: stats,
      totalRepositories: stats.length,
      summary: {
        totalAudits: stats.reduce((sum, repo) => sum + repo.totalAudits, 0),
        averageScore: stats.length > 0 
          ? Math.round(stats.reduce((sum, repo) => sum + repo.averageScore, 0) / stats.length)
          : 0,
        topPerformer: stats.length > 0 
          ? stats.reduce((best, current) => current.bestScore > best.bestScore ? current : best)
          : null,
        recentlyAudited: stats.filter(repo => {
          const daysSinceLastAudit = Math.floor(
            (Date.now() - new Date(repo.lastAudit).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAudit <= 7;
        }).length,
      },
    });

  } catch (error: any) {
    console.error('Error fetching repository stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}