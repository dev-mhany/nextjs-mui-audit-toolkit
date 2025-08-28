'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  GitHub as GitHubIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GitHubAuthSuccess() {
  const [loading, setLoading] = useState(true);
  const [installationData, setInstallationData] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const installationId = searchParams.get('installation_id');
  const account = searchParams.get('account');
  const setupAction = searchParams.get('setup_action');

  useEffect(() => {
    if (installationId && account) {
      setInstallationData({
        installationId,
        account,
        setupAction: setupAction || 'install',
      });
    }
    setLoading(false);
  }, [installationId, account, setupAction]);

  const handleContinue = () => {
    const returnUrl = sessionStorage.getItem('audit_return_url') || '/';
    sessionStorage.removeItem('audit_return_url');
    router.push(returnUrl);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!installationData) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Installation Error</AlertTitle>
          Missing installation information. Please try installing the GitHub App again.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/')} sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              🎉 GitHub App Installed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              dev-mhany audit toolkit has been successfully installed
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Installation Complete</AlertTitle>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Account:</strong> {installationData.account}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Installation ID:</strong> {installationData.installationId}
              </Typography>
              <Typography variant="body2">
                <strong>Action:</strong>
                <Chip
                  label={installationData.setupAction}
                  size="small"
                  color={installationData.setupAction === 'install' ? 'success' : 'info'}
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" size="large" onClick={handleContinue} startIcon={<GitHubIcon />}>
              Continue to Audit
            </Button>
            <Button variant="outlined" onClick={() => router.push('/')} startIcon={<ArrowBackIcon />}>
              Return to Home
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            You can manage this installation from your GitHub settings at any time.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}