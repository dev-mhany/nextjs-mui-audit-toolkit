'use client'

import React, { useEffect, useState, Suspense } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material'
import { useSearchParams, useRouter } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [errorData, setErrorData] = useState<any>(null)

  const error = searchParams.get('error')
  const message = searchParams.get('message')

  useEffect(() => {
    setErrorData({
      error: error || 'unknown_error',
      message: message || 'An unknown error occurred during installation'
    })
    setLoading(false)
  }, [error, message])

  const handleRetry = () => {
    const githubAppUrl = `https://github.com/apps/dev-mhany-audit-toolkit/installations/new`
    window.open(githubAppUrl, '_blank')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const getErrorDetails = (errorType: string) => {
    switch (errorType) {
      case 'installation_failed':
        return {
          title: 'Installation Failed',
          description: 'The GitHub App installation could not be completed.',
          suggestions: [
            'Check that you have admin permissions on the repository/organization',
            'Ensure the repository exists and is accessible',
            'Try installing the app again',
            'Contact support if the issue persists'
          ]
        }
      case 'access_denied':
        return {
          title: 'Access Denied',
          description: 'You denied access to the GitHub App.',
          suggestions: [
            'Grant the necessary permissions to use the audit toolkit',
            'The app only requests minimal permissions needed for auditing',
            'You can always revoke access later from GitHub settings'
          ]
        }
      case 'invalid_installation':
        return {
          title: 'Invalid Installation',
          description: 'The installation ID is invalid or the app is not properly installed.',
          suggestions: [
            'Try installing the GitHub App again',
            'Check that the app is installed on the correct account',
            'Contact support if you continue to see this error'
          ]
        }
      default:
        return {
          title: 'Unknown Error',
          description: 'An unexpected error occurred during the installation process.',
          suggestions: [
            'Try the installation process again',
            'Check your internet connection',
            'Clear your browser cache and cookies',
            'Contact support with the error details below'
          ]
        }
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  const errorDetails = getErrorDetails(errorData?.error)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }} elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Installation Error
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {errorDetails.description}
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>{errorDetails.title}</AlertTitle>
            {errorData?.message}
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpIcon />
              Troubleshooting Steps
            </Typography>
            
            <List dense>
              {errorDetails.suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {index + 1}.
                    </Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Alternative: Use Personal Access Token</AlertTitle>
            <Typography variant="body2">
              If you continue to have issues with the GitHub App installation, 
              you can use a Personal Access Token as a fallback option. 
              This provides similar functionality but requires manual token management.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleRetry}
              startIcon={<GitHubIcon />}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Retry Installation
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoHome}
              startIcon={<HomeIcon />}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Go to Home Page
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🆘 Need Help?
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Error Code:</strong> {errorData?.error}<br />
              <strong>Error Message:</strong> {errorData?.message}<br />
              <strong>Time:</strong> {new Date().toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}