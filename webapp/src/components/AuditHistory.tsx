'use client';

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import useSWR from 'swr';
import type { AuditResult } from '@/types/audit';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AuditProgressDialogProps {
  open: boolean;
  onClose: () => void;
  auditId: string;
}

function AuditProgressDialog({ open, onClose, auditId }: AuditProgressDialogProps) {
  const { data: progress, isLoading } = useSWR(
    open ? `/api/audit/progress/${auditId}` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Audit Progress</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ py: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading progress...
            </Typography>
          </Box>
        ) : progress ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Current Step: {progress.step}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress.percentage} 
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              {progress.percentage}% Complete
            </Typography>
            
            {progress.logs && progress.logs.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recent Logs:
                </Typography>
                <Box
                  sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                >
                  {progress.logs.slice(-10).map((log: string, index: number) => (
                    <Typography key={index} variant="body2" component="div">
                      {log}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>No progress data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon color="success" />;
    case 'failed':
      return <ErrorIcon color="error" />;
    case 'running':
      return <PlayArrowIcon color="primary" />;
    default:
      return <ScheduleIcon color="disabled" />;
  }
}

function getStatusColor(status: string): 'success' | 'error' | 'primary' | 'default' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'running':
      return 'primary';
    default:
      return 'default';
  }
}

function getGradeColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
}

export function AuditHistory() {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  const { 
    data: audits, 
    isLoading, 
    error,
    mutate 
  } = useSWR<AuditResult[]>('/api/audit/history', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    fallbackData: [],
  });

  const handleShowProgress = (auditId: string) => {
    setSelectedAuditId(auditId);
    setProgressDialogOpen(true);
  };

  const handleRefresh = () => {
    mutate();
  };

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load audit history
        </Typography>
        <Button onClick={handleRefresh} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading audit history...
        </Typography>
      </Box>
    );
  }

  if (!audits || audits.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No audits yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start your first audit using the form on the left
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {audits.length} audit{audits.length !== 1 ? 's' : ''} found
        </Typography>
        <IconButton onClick={handleRefresh} size="small">
          <RefreshIcon />
        </IconButton>
      </Box>

      <List disablePadding>
        {audits.slice(0, 10).map((audit) => {
          const repoName = audit.repoUrl.split('/').slice(-2).join('/');
          const timeAgo = new Date(audit.createdAt).toLocaleDateString();

          return (
            <ListItem
              key={audit.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                bgcolor: 'background.paper',
              }}
            >
              <ListItemIcon>
                {getStatusIcon(audit.status)}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                      {repoName}
                    </Typography>
                    <Chip
                      label={audit.status}
                      size="small"
                      color={getStatusColor(audit.status)}
                      variant={audit.status === 'completed' ? 'filled' : 'outlined'}
                    />
                    {audit.score !== undefined && (
                      <Chip
                        label={`${audit.score}/100`}
                        size="small"
                        color={getGradeColor(audit.score)}
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo} • Branch: {audit.branch || 'main'}
                    </Typography>
                    
                    {audit.status === 'running' && (
                      <LinearProgress size="small" sx={{ height: 3, borderRadius: 1 }} />
                    )}
                    
                    {audit.error && (
                      <Typography variant="caption" color="error">
                        Error: {audit.error}
                      </Typography>
                    )}
                  </Box>
                }
              />

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {audit.status === 'running' && (
                  <Tooltip title="View Progress">
                    <IconButton
                      size="small"
                      onClick={() => handleShowProgress(audit.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {audit.reportUrl && (
                  <Tooltip title="View Report">
                    <IconButton
                      size="small"
                      component="a"
                      href={audit.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {audit.workflowRunId && (
                  <Tooltip title="View GitHub Action">
                    <IconButton
                      size="small"
                      component="a"
                      href={`https://github.com/${repoName}/actions/runs/${audit.workflowRunId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>

      {audits.length > 10 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" size="small">
            View All Audits
          </Button>
        </Box>
      )}

      {selectedAuditId && (
        <AuditProgressDialog
          open={progressDialogOpen}
          onClose={() => setProgressDialogOpen(false)}
          auditId={selectedAuditId}
        />
      )}
    </Box>
  );
}