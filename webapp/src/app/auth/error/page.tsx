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
} from '@mui/material';
import {
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GitHubAuthError() {
  const [errorData, setErrorData] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get('error');
  const message = searchParams.get('message');

  useEffect(() => {
    setErrorData({
      error: error || 'unknown_error',
      message: message || 'An unknown error occurred during GitHub App installation.',
    });
  }, [error, message]);

  const handleRetry = () => {
    // Clear any cached data and redirect to home
    sessionStorage.removeItem('audit_return_url');
    router.push('/');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Installation Failed
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There was an issue installing the GitHub App
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error Details</AlertTitle>
            {errorData && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Error Type:</strong> {errorData.error}
                </Typography>
                <Typography variant="body2">
                  <strong>Message:</strong> {errorData.message}
                </Typography>
              </Box>
            )}
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔧 Troubleshooting Steps:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                1. Ensure you have admin access to the repository
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                2. Check if your organization allows third-party apps
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                3. Verify your GitHub account has proper permissions
              </Typography>
              <Typography variant="body2">
                4. Try the installation process again
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')}
              startIcon={<ArrowBackIcon />}
            >
              Return to Home
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            If the problem persists, you can use Personal Access Token mode as a fallback.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}