'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Accessibility as AccessibilityIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import useSWR from 'swr';
import type { AuditResult } from '@/types/audit';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnalyticsData {
  scoreDistribution: Array<{ range: string; count: number; percentage: number }>;
  categoryBreakdown: Array<{ category: string; averageScore: number; totalIssues: number }>;
  trends: {
    weeklyScores: Array<{ week: string; averageScore: number; totalAudits: number }>;
    improvement: number;
  };
  topIssues: Array<{ issue: string; count: number; severity: string }>;
  recommendations: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
}

function ScoreDistributionChart({ data }: { data: AnalyticsData['scoreDistribution'] }) {
  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <Box>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{item.range}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.count} ({item.percentage}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(item.count / maxCount) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function CategoryBreakdownCard({ data }: { data: AnalyticsData['categoryBreakdown'] }) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance':
        return <SpeedIcon />;
      case 'security':
        return <SecurityIcon />;
      case 'accessibility':
        return <AccessibilityIcon />;
      case 'code quality':
        return <CodeIcon />;
      default:
        return <BugReportIcon />;
    }
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <List>
      {data.map((item, index) => (
        <ListItem key={index} divider={index < data.length - 1}>
          <ListItemIcon>
            {getCategoryIcon(item.category)}
          </ListItemIcon>
          <ListItemText
            primary={item.category}
            secondary={`${item.totalIssues} issues found`}
          />
          <Chip
            label={`${item.averageScore}/100`}
            color={getScoreColor(item.averageScore)}
            size="small"
            variant="outlined"
          />
        </ListItem>
      ))}
    </List>
  );
}

function TrendCard({ data }: { data: AnalyticsData['trends'] }) {
  const isImproving = data.improvement > 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {isImproving ? (
          <TrendingUpIcon color="success" />
        ) : (
          <TrendingDownIcon color="error" />
        )}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {isImproving ? '+' : ''}{data.improvement.toFixed(1)}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          vs last period
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Recent Weekly Scores:
      </Typography>

      {data.weeklyScores.slice(-4).map((week, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">{week.week}</Typography>
            <Typography variant="caption">
              {week.averageScore}/100 ({week.totalAudits} audits)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={week.averageScore}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'grey.200',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export function AuditAnalytics() {
  const { data: audits, error: auditsError } = useSWR<AuditResult[]>('/api/audit/history?limit=100', fetcher);

  // Generate analytics data from audits
  const analyticsData: AnalyticsData = React.useMemo(() => {
    if (!audits || audits.length === 0) {
      return {
        scoreDistribution: [],
        categoryBreakdown: [],
        trends: { weeklyScores: [], improvement: 0 },
        topIssues: [],
        recommendations: [],
      };
    }

    const completedAudits = audits.filter(audit => audit.status === 'completed' && audit.score !== undefined);

    // Score distribution
    const scoreRanges = [
      { range: '90-100 (A)', min: 90, max: 100 },
      { range: '80-89 (B)', min: 80, max: 89 },
      { range: '70-79 (C)', min: 70, max: 79 },
      { range: '60-69 (D)', min: 60, max: 69 },
      { range: '0-59 (F)', min: 0, max: 59 },
    ];

    const scoreDistribution = scoreRanges.map(range => {
      const count = completedAudits.filter(audit => 
        audit.score! >= range.min && audit.score! <= range.max
      ).length;
      return {
        range: range.range,
        count,
        percentage: completedAudits.length > 0 ? Math.round((count / completedAudits.length) * 100) : 0,
      };
    });

    // Mock category breakdown (in real implementation, this would come from detailed audit data)
    const categoryBreakdown = [
      { category: 'Next.js Architecture', averageScore: 85, totalIssues: 12 },
      { category: 'MUI Usage', averageScore: 78, totalIssues: 18 },
      { category: 'Accessibility', averageScore: 72, totalIssues: 25 },
      { category: 'Performance', averageScore: 81, totalIssues: 15 },
      { category: 'Security', averageScore: 89, totalIssues: 8 },
      { category: 'Code Quality', averageScore: 76, totalIssues: 22 },
    ];

    // Mock trends (in real implementation, this would be calculated from historical data)
    const weeklyScores = [
      { week: '4 weeks ago', averageScore: 73, totalAudits: 5 },
      { week: '3 weeks ago', averageScore: 76, totalAudits: 8 },
      { week: '2 weeks ago', averageScore: 79, totalAudits: 12 },
      { week: 'Last week', averageScore: 82, totalAudits: 15 },
    ];

    const trends = {
      weeklyScores,
      improvement: 12.3, // Mock improvement percentage
    };

    // Mock top issues
    const topIssues = [
      { issue: 'Inline styles instead of sx prop', count: 45, severity: 'warning' },
      { issue: 'Missing alt attributes', count: 32, severity: 'error' },
      { issue: 'Non-responsive breakpoints', count: 28, severity: 'warning' },
      { issue: 'Hardcoded theme values', count: 23, severity: 'warning' },
      { issue: 'Unused imports', count: 18, severity: 'info' },
    ];

    // Generate recommendations based on data
    const recommendations = [
      {
        title: 'Improve Accessibility Compliance',
        description: 'Focus on adding proper alt attributes and ARIA labels to improve accessibility scores.',
        priority: 'high' as const,
      },
      {
        title: 'Adopt sx Prop Consistently',
        description: 'Replace inline styles with MUI\'s sx prop for better theming and maintainability.',
        priority: 'medium' as const,
      },
      {
        title: 'Implement Responsive Design',
        description: 'Use MUI breakpoints more consistently across components.',
        priority: 'medium' as const,
      },
    ];

    return {
      scoreDistribution,
      categoryBreakdown,
      trends,
      topIssues,
      recommendations,
    };
  }, [audits]);

  if (auditsError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Failed to load analytics data
        </Typography>
      </Paper>
    );
  }

  if (!audits) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading analytics...
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  if (audits.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No audit data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Run some audits to see analytics and insights
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Score Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Score Distribution
            </Typography>
            <ScoreDistributionChart data={analyticsData.scoreDistribution} />
          </CardContent>
        </Card>
      </Grid>

      {/* Category Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Category Performance
            </Typography>
            <CategoryBreakdownCard data={analyticsData.categoryBreakdown} />
          </CardContent>
        </Card>
      </Grid>

      {/* Trends */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📈 Improvement Trends
            </Typography>
            <TrendCard data={analyticsData.trends} />
          </CardContent>
        </Card>
      </Grid>

      {/* Top Issues */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔍 Most Common Issues
            </Typography>
            <List>
              {analyticsData.topIssues.slice(0, 5).map((issue, index) => (
                <ListItem key={index} divider={index < 4}>
                  <ListItemIcon>
                    <BugReportIcon color={issue.severity === 'error' ? 'error' : 'warning'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={issue.issue}
                    secondary={`Found ${issue.count} times`}
                  />
                  <Chip
                    label={issue.severity}
                    color={issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info'}
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recommendations */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Recommendations
            </Typography>
            <Grid container spacing={2}>
              {analyticsData.recommendations.map((rec, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: rec.priority === 'high' ? 'error.main' : rec.priority === 'medium' ? 'warning.main' : 'info.main',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon
                        color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="subtitle2">{rec.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {rec.description}
                    </Typography>
                    <Chip
                      label={`${rec.priority} priority`}
                      color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}