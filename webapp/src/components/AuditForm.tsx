'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import type { AuditRequest } from '@/types/audit';

interface AuditFormData {
  repoUrl: string;
  githubToken?: string;
  branch?: string;
  strict: boolean;
  minScore: number;
  autoFix: boolean;
  userEmail?: string;
}

export function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AuditFormData>({
    defaultValues: {
      repoUrl: '',
      githubToken: '',
      branch: '',
      strict: false,
      minScore: 85,
      autoFix: false,
      userEmail: '',
    },
  });

  const repoUrl = watch('repoUrl');

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const auditRequest: AuditRequest = {
        repoUrl: data.repoUrl,
        githubToken: data.githubToken || undefined,
        branch: data.branch || undefined,
        userEmail: data.userEmail || undefined,
        auditConfig: {
          strict: data.strict,
          minScore: data.minScore,
          fix: data.autoFix,
        },
      };

      const response = await fetch('/api/audit/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditRequest),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({
          type: 'success',
          message: `Audit initiated successfully! Workflow ID: ${result.workflowId}`,
        });
        reset();
      } else {
        setSubmitResult({
          type: 'error',
          message: result.error || 'Failed to start audit',
        });
      }
    } catch (error) {
      setSubmitResult({
        type: 'error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateGitHubUrl = (url: string) => {
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubUrlPattern.test(url) || 'Please enter a valid GitHub repository URL';
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitResult && (
        <Alert 
          severity={submitResult.type} 
          sx={{ mb: 3 }}
          onClose={() => setSubmitResult(null)}
        >
          {submitResult.message}
        </Alert>
      )}

      {/* Repository URL */}
      <Controller
        name="repoUrl"
        control={control}
        rules={{
          required: 'Repository URL is required',
          validate: validateGitHubUrl,
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="GitHub Repository URL"
            placeholder="https://github.com/username/repository"
            error={!!errors.repoUrl}
            helperText={errors.repoUrl?.message}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <GitHubIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        )}
      />

      {/* GitHub Token */}
      <Controller
        name="githubToken"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="password"
            label="GitHub Token (Optional)"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            helperText={
              <Box component="span">
                Required for private repositories.{' '}
                <Link
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Generate token
                </Link>
              </Box>
            }
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <SecurityIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        )}
      />

      {/* Branch (Optional) */}
      <Controller
        name="branch"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Branch (Optional)"
            placeholder="main"
            helperText="Leave empty to use the default branch"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Email for notifications */}
      <Controller
        name="userEmail"
        control={control}
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="email"
            label="Email (Optional)"
            placeholder="your@email.com"
            error={!!errors.userEmail}
            helperText={errors.userEmail?.message || 'Get notified when audit completes'}
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Advanced Configuration */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            <Typography>Advanced Configuration</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="strict"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={onChange}
                        color="primary"
                      />
                    }
                    label="Strict Mode"
                  />
                )}
              />
              <Typography variant="body2" color="text.secondary">
                Fail on any critical issues
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="autoFix"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={onChange}
                        color="primary"
                      />
                    }
                    label="Auto-fix Issues"
                  />
                )}
              />
              <Typography variant="body2" color="text.secondary">
                Automatically fix common problems
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="minScore"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Minimum Score"
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ width: 150 }}
                  />
                )}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Minimum acceptable score (0-100)
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Repository Info Preview */}
      {repoUrl && validateGitHubUrl(repoUrl) === true && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Repository Preview:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={repoUrl.split('/').slice(-2).join('/')} variant="outlined" />
            <Chip label="Next.js + MUI Audit" color="primary" size="small" />
          </Box>
        </Box>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        sx={{ 
          py: 1.5, 
          fontSize: '1.1rem',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #1976d2)',
          },
        }}
      >
        {isSubmitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Starting Audit...
          </Box>
        ) : (
          '🚀 Start Audit'
        )}
      </Button>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
        The audit will run via GitHub Actions and results will be committed to your repository
        with the message "audited by dev-mhany"
      </Typography>
    </Box>
  );
}