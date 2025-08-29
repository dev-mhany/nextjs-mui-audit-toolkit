'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import useSWR from 'swr'
import type { AuditResult, AuditProgress } from '@/types/audit'

interface AuditProgressTrackerProps {
  auditId: string
  onComplete?: (audit: AuditResult) => void
  onError?: (error: string) => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function AuditProgressTracker({
  auditId,
  onComplete,
  onError
}: AuditProgressTrackerProps) {
  const [expanded, setExpanded] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const {
    data: progress,
    error,
    isLoading,
    mutate
  } = useSWR<AuditProgress>(`/api/audit/progress/${auditId}`, fetcher, {
    refreshInterval: data => {
      // Stop polling if audit is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return 0
      }
      return 3000 // Poll every 3 seconds for running audits
    },
    onSuccess: data => {
      setLastUpdate(new Date().toLocaleTimeString())

      // Call completion callback when audit finishes
      if (
        data.audit &&
        (data.audit.status === 'completed' || data.audit.status === 'failed')
      ) {
        if (data.audit.status === 'completed' && onComplete) {
          onComplete(data.audit)
        } else if (data.audit.status === 'failed' && onError) {
          onError(data.audit.error || 'Audit failed')
        }
      }
    },
    onError: err => {
      console.error('Progress tracking error:', err)
      if (onError) {
        onError('Failed to track audit progress')
      }
    }
  })

  const handleRefresh = () => {
    mutate()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color='success' />
      case 'failed':
        return <ErrorIcon color='error' />
      case 'running':
      case 'in_progress':
        return <ScheduleIcon color='primary' />
      default:
        return <ScheduleIcon color='disabled' />
    }
  }

  const getStatusColor = (
    status: string
  ): 'success' | 'error' | 'primary' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      case 'running':
      case 'in_progress':
        return 'primary'
      default:
        return 'default'
    }
  }

  if (error) {
    return (
      <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1 }} />
              <Typography variant='h6'>Failed to track progress</Typography>
            </Box>
            <Button
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              size='small'
              variant='outlined'
              sx={{ color: 'inherit', borderColor: 'currentColor' }}
            >
              Retry
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (isLoading && !progress) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            <Typography variant='h6'>Loading audit progress...</Typography>
          </Box>
          <LinearProgress />
        </CardContent>
      </Card>
    )
  }

  if (!progress) {
    return null
  }

  const { audit, step, percentage, status, logs } = progress

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon(status)}
            <Box sx={{ ml: 1 }}>
              <Typography variant='h6'>Audit Progress</Typography>
              <Typography variant='body2' color='text.secondary'>
                {audit?.repoUrl.split('/').slice(-2).join('/')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={status}
              color={getStatusColor(status)}
              size='small'
              variant={status === 'completed' ? 'filled' : 'outlined'}
            />
            {audit?.workflowRunId && (
              <IconButton
                size='small'
                component='a'
                href={`https://github.com/${audit.repoUrl.split('/').slice(-2).join('/')}/actions/runs/${audit.workflowRunId}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <LaunchIcon fontSize='small' />
              </IconButton>
            )}
            <IconButton size='small' onClick={handleRefresh}>
              <RefreshIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              {step}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {percentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant='determinate'
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Results */}
        {audit?.score !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Score: ${audit.score}/100`}
              color={
                audit.score >= 85 ? 'success' : audit.score >= 70 ? 'warning' : 'error'
              }
              variant='outlined'
            />
            {audit.letterGrade && (
              <Chip
                label={`Grade: ${audit.letterGrade}`}
                color={
                  audit.score >= 85 ? 'success' : audit.score >= 70 ? 'warning' : 'error'
                }
                variant='outlined'
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        )}

        {/* Last Update */}
        {lastUpdate && (
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'block', mb: 1 }}
          >
            Last updated: {lastUpdate}
          </Typography>
        )}

        {/* Logs Section */}
        {logs && logs.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='subtitle2'>Logs ({logs.length})</Typography>
              <IconButton size='small' onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Box
                sx={{
                  mt: 1,
                  maxHeight: 200,
                  overflowY: 'auto',
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'grey.200'
                }}
              >
                <List dense disablePadding>
                  {logs.slice(-10).map((log, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant='caption'
                            component='code'
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {log}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </>
        )}

        {/* Error Message */}
        {audit?.error && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1 }}>
              <Typography variant='subtitle2' color='error' gutterBottom>
                Error Details:
              </Typography>
              <Typography variant='body2' color='error'>
                {audit.error}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
