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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useSearchParams, useRouter } from 'next/navigation'

function AuthSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [installationData, setInstallationData] = useState<any>(null)

  const installationId = searchParams.get('installation_id')
  const account = searchParams.get('account')
  const setupAction = searchParams.get('setup_action')

  useEffect(() => {
    if (installationId && account) {
      setInstallationData({
        installationId,
        account,
        setupAction: setupAction || 'install'
      })
      setLoading(false)
    }
  }, [installationId, account, setupAction])

  const handleContinue = () => {
    router.push('/')
  }

  const handleManageInstallation = () => {
    window.open(`https://github.com/settings/installations/${installationId}`, '_blank')
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
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              🎉 Installation Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The dev-mhany audit toolkit has been successfully installed on your GitHub account.
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>GitHub App Installed</AlertTitle>
            The audit toolkit is now ready to analyze your Next.js + MUI projects.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GitHubIcon />
              Installation Details
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Account"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{installationData?.account}</Typography>
                      <Chip size="small" label="Connected" color="success" variant="outlined" />
                    </Box>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Installation ID"
                  secondary={installationData?.installationId}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <RefreshIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Setup Action"
                  secondary={
                    <Chip 
                      size="small" 
                      label={installationData?.setupAction === 'install' ? 'New Installation' : 'Update'} 
                      color="info" 
                      variant="outlined" 
                    />
                  }
                />
              </ListItem>
            </List>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Security & Privacy</AlertTitle>
            <Typography variant="body2">
              • The app only accesses repositories you explicitly grant access to<br />
              • No long-term tokens are stored on our servers<br />
              • All audit data remains in your repository<br />
              • You can revoke access anytime from GitHub settings
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              startIcon={<LaunchIcon />}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Start Auditing Projects
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleManageInstallation}
              startIcon={<SettingsIcon />}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Manage Installation
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🚀 Next Steps
            </Typography>
            <Typography variant="body2" component="div">
              1. <strong>Return to the main page</strong> to start your first audit<br />
              2. <strong>Enter a repository URL</strong> from your connected GitHub account<br />
              3. <strong>Select audit options</strong> and click "Start Audit"<br />
              4. <strong>Review results</strong> in the automatically created Pull Request
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default function AuthSuccessPage() {
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
      <AuthSuccessContent />
    </Suspense>
  )
}