import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Alert,
  AlertTitle,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  GitHub as GitHubIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

interface ImprovedAuditFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  installationStatus?: {
    hasApp: boolean;
    installations: any[];
  };
}

interface AuditFormData {
  repoUrl: string;
  mode: 'app' | 'pat';
  pat?: string;
  userEmail?: string;
  options: {
    createPR: boolean;
    staticOnly: boolean;
    autoMerge: boolean;
  };
}

export default function ImprovedAuditForm({ 
  onSubmit, 
  loading = false,
  installationStatus 
}: ImprovedAuditFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('2-3 minutes');
  const [estimatedCost, setEstimatedCost] = useState('Free');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AuditFormData>({
    defaultValues: {
      repoUrl: '',
      mode: 'app',
      pat: '',
      userEmail: '',
      options: {
        createPR: true,
        staticOnly: true,
        autoMerge: false,
      }
    }
  });

  const watchedMode = watch('mode');
  const watchedStaticOnly = watch('options.staticOnly');

  // Update estimates based on options
  React.useEffect(() => {
    if (watchedStaticOnly) {
      setEstimatedTime('2-3 minutes');
      setEstimatedCost('Free');
    } else {
      setEstimatedTime('5-8 minutes');
      setEstimatedCost('~$0.02 (GitHub Actions)');
    }
  }, [watchedStaticOnly]);

  const handleFormSubmit = useCallback(async (data: AuditFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [onSubmit]);

  const handleInstallApp = useCallback(() => {
    // Redirect to GitHub App installation
    const installUrl = `https://github.com/apps/dev-mhany-audit-toolkit/installations/new`;
    window.open(installUrl, '_blank');
  }, []);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box component=\"form\" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant=\"h5\" gutterBottom>
              🔍 Start Repository Audit
            </Typography>
            <Typography variant=\"body2\" color=\"text.secondary\">
              Automated Next.js + Material-UI best practices analysis
            </Typography>
          </Box>

          {/* Repository URL */}
          <Controller
            name=\"repoUrl\"
            control={control}
            rules={{
              required: 'Repository URL is required',
              pattern: {
                value: /^https:\\/\\/github\\.com\\/[\\w\\-\\.]+\\/[\\w\\-\\.]+\\/?$/,
                message: 'Please enter a valid GitHub repository URL'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label=\"GitHub Repository URL\"
                placeholder=\"https://github.com/owner/repository\"
                error={!!errors.repoUrl}
                helperText={errors.repoUrl?.message || 'Enter the GitHub repository you want to audit'}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            )}
          />

          {/* Authentication Mode */}
          <FormControl component=\"fieldset\" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component=\"legend\" sx={{ mb: 1 }}>
              Authentication Method
            </FormLabel>
            <Controller
              name=\"mode\"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value=\"app\"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon color=\"success\" fontSize=\"small\" />
                        <span>GitHub App</span>
                        <Chip label=\"Recommended\" size=\"small\" color=\"success\" variant=\"outlined\" />
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value=\"pat\"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color=\"warning\" fontSize=\"small\" />
                        <span>Personal Token</span>
                        <Chip label=\"Fallback\" size=\"small\" color=\"warning\" variant=\"outlined\" />
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {/* GitHub App Mode */}
          {watchedMode === 'app' && (
            <Alert severity=\"success\" sx={{ mb: 3 }}>
              <AlertTitle>Secure GitHub App Authentication</AlertTitle>
              <Typography variant=\"body2\" sx={{ mb: 1 }}>
                ✅ Fine-grained permissions per repository<br/>
                ✅ Short-lived tokens (no secrets stored)<br/>
                ✅ Works with SSO and branch protection<br/>
                ✅ Revocable by repository owners
              </Typography>
              {!installationStatus?.hasApp && (
                <Button
                  variant=\"outlined\"
                  size=\"small\"
                  onClick={handleInstallApp}
                  sx={{ mt: 1 }}
                >
                  Install GitHub App
                </Button>
              )}
            </Alert>
          )}

          {/* PAT Mode */}
          {watchedMode === 'pat' && (
            <>
              <Alert severity=\"warning\" sx={{ mb: 2 }}>
                <AlertTitle>Personal Access Token (Not Recommended)</AlertTitle>
                <Typography variant=\"body2\">
                  ⚠️ Requires broad repository access<br/>
                  ⚠️ Token stored during audit execution<br/>
                  ⚠️ May not work with SSO restrictions
                </Typography>
              </Alert>
              
              <Controller
                name=\"pat\"
                control={control}
                rules={{
                  required: watchedMode === 'pat' ? 'Personal Access Token is required' : false,
                  pattern: {
                    value: /^ghp_[a-zA-Z0-9]{36}$|^github_pat_[a-zA-Z0-9_]{82}$/,
                    message: 'Please enter a valid GitHub Personal Access Token'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type=\"password\"
                    label=\"GitHub Personal Access Token\"
                    placeholder=\"ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\"
                    error={!!errors.pat}
                    helperText={errors.pat?.message || 'Required scopes: repo, workflow'}
                    sx={{ mb: 3 }}
                  />
                )}
              />
            </>
          )}

          {/* Email Notifications */}
          <Controller
            name=\"userEmail\"
            control={control}
            rules={{
              pattern: {
                value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
                message: 'Please enter a valid email address'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type=\"email\"
                label=\"Email for Notifications (Optional)\"
                placeholder=\"your.email@example.com\"
                error={!!errors.userEmail}
                helperText={errors.userEmail?.message || 'Get notified when the audit completes'}
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Advanced Options */}
          <Accordion expanded={showAdvanced} onChange={(_, expanded) => setShowAdvanced(expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant=\"subtitle1\">Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Create PR Option */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant=\"body2\" fontWeight=\"medium\">
                      Create Pull Request
                    </Typography>
                    <Typography variant=\"caption\" color=\"text.secondary\">
                      Create PR with audit results (recommended)
                    </Typography>
                  </Box>
                  <Controller
                    name=\"options.createPR\"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch checked={value} onChange={onChange} />
                    )}
                  />
                </Box>

                {/* Static Only Option */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant=\"body2\" fontWeight=\"medium\">
                      Static Analysis Only
                    </Typography>
                    <Typography variant=\"caption\" color=\"text.secondary\">
                      Skip runtime tests (faster, safer for untrusted repos)
                    </Typography>
                  </Box>
                  <Controller
                    name=\"options.staticOnly\"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch checked={value} onChange={onChange} />
                    )}
                  />
                </Box>

                {/* Auto Merge Option */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant=\"body2\" fontWeight=\"medium\">
                      Auto-merge on Pass
                    </Typography>
                    <Typography variant=\"caption\" color=\"text.secondary\">
                      Automatically merge PR if audit passes (requires label)
                    </Typography>
                  </Box>
                  <Controller
                    name=\"options.autoMerge\"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch checked={value} onChange={onChange} />
                    )}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Estimates */}
          <Box sx={{ mt: 3, mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant=\"subtitle2\" gutterBottom>
              📊 Estimated Execution
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon fontSize=\"small\" color=\"primary\" />
                <Typography variant=\"body2\">
                  Time: {estimatedTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant=\"body2\">
                  Cost: {estimatedCost}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Submit Button */}
          <Button
            type=\"submit\"
            variant=\"contained\"
            size=\"large\"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>Starting Audit...</span>
              </Box>
            ) : (
              '🚀 Start Audit'
            )}
          </Button>

          {/* Help Text */}
          <Typography variant=\"caption\" color=\"text.secondary\" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
            Audit results will be committed to a branch with \"audited by dev-mhany\" signature.
            <br />
            <Link href=\"#\" color=\"primary\">Learn more about the audit process</Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}", "original_text": "// This is a placeholder file"}]