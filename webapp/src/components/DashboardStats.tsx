'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import useSWR from 'swr';
import type { AuditSummary } from '@/types/audit';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  progress?: number;
}

function StatCard({ title, value, subtitle, icon, color, progress }: StatCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.main`,
            color: 'white',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>
            {value}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      
      {progress !== undefined && (
        <Box sx={{ mt: 'auto' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: `${color}.main`,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress}% completion rate
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export function DashboardStats() {
  const { data: summary, isLoading, error } = useSWR<AuditSummary>(
    '/api/audit/summary',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      fallbackData: {
        totalAudits: 0,
        completedAudits: 0,
        averageScore: 0,
        recentAudits: [],
      },
    }
  );

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Failed to load dashboard statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Paper>
    );
  }

  if (isLoading || !summary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Box sx={{ height: 140, bgcolor: 'grey.100', borderRadius: 1, p: 2 }}>
                <Box sx={{ height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                <Box sx={{ height: 40, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
                <Box sx={{ height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  const completionRate = summary.totalAudits > 0 
    ? Math.round((summary.completedAudits / summary.totalAudits) * 100)
    : 0;

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getGradeFromScore = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Audits"
            value={summary.totalAudits}
            subtitle="Repositories analyzed"
            icon={<AssessmentIcon />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={summary.completedAudits}
            subtitle={`${completionRate}% success rate`}
            icon={<CheckCircleIcon />}
            color="success"
            progress={completionRate}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Average Score"
            value={`${Math.round(summary.averageScore)}/100`}
            subtitle={`Grade ${getGradeFromScore(summary.averageScore)}`}
            icon={<TrendingUpIcon />}
            color={getScoreColor(summary.averageScore)}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Quality Trend"
            value={summary.averageScore >= 85 ? '📈' : summary.averageScore >= 70 ? '📊' : '📉'}
            subtitle={
              summary.averageScore >= 85 
                ? 'Excellent quality'
                : summary.averageScore >= 70 
                ? 'Good quality'
                : 'Needs improvement'
            }
            icon={<WarningIcon />}
            color={getScoreColor(summary.averageScore)}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      {summary.recentAudits.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recent Activity
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {summary.recentAudits.slice(0, 5).map((audit) => (
              <Chip
                key={audit.id}
                label={`${audit.repoUrl.split('/').slice(-2).join('/')} - ${audit.score || 0}/100`}
                color={audit.status === 'completed' ? 'success' : audit.status === 'failed' ? 'error' : 'default'}
                variant={audit.status === 'completed' ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}