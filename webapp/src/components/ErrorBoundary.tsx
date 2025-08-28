'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  BugReport as BugReportIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    resetError: () => void;
    errorId?: string;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to external service (you can add services like Sentry here)
    this.logErrorToService(error, errorInfo);

    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real application, you would send this to an error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
    };

    // Example: Send to your error tracking service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData),
    // }).catch(() => {
    //   // Silently fail error reporting
    // });

    console.error('Error logged:', errorData);
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  private reloadPage = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
            errorId={this.state.errorId}
          />
        );
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          reloadPage={this.reloadPage}
          goHome={this.goHome}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  resetError: () => void;
  reloadPage: () => void;
  goHome: () => void;
  errorId?: string;
}

function DefaultErrorFallback({
  error,
  errorInfo,
  resetError,
  reloadPage,
  goHome,
  errorId,
}: DefaultErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Box
      sx={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorIcon
            sx={{
              fontSize: 64,
              color: 'error.main',
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom color="error">
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an unexpected error while processing your request.
            This has been logged and our team will investigate.
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="subtitle2">Error Details:</Typography>
            <Typography variant="body2" component="code">
              {error?.message || 'Unknown error occurred'}
            </Typography>
            {errorId && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Error ID: {errorId}
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={resetError}
              color="primary"
            >
              Try Again
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={reloadPage}
            >
              Reload Page
            </Button>

            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={goHome}
            >
              Go Home
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {process.env.NODE_ENV === 'development' && (error || errorInfo) && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                onClick={() => setShowDetails(!showDetails)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BugReportIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Developer Details
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ textAlign: 'left' }}>
                  {error && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="error">
                        Error Stack:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto',
                          maxHeight: 200,
                          bgcolor: 'grey.100',
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {error.stack}
                      </Typography>
                    </Box>
                  )}

                  {errorInfo && (
                    <Box>
                      <Typography variant="subtitle2" color="error">
                        Component Stack:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto',
                          maxHeight: 200,
                          bgcolor: 'grey.100',
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {errorInfo.componentStack}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If this problem persists, please{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => {
                window.open('https://github.com/your-repo/issues/new', '_blank');
              }}
            >
              report an issue
            </Button>
            {' '}with the error ID above.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Specialized error boundaries for different sections

export function APIErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError, errorId }) => (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={resetError}>
              Retry
            </Button>
          }
        >
          <Typography variant="subtitle2">API Error</Typography>
          <Typography variant="body2">
            {error?.message || 'Failed to load data. Please try again.'}
          </Typography>
          {errorId && (
            <Typography variant="caption" display="block">
              Error ID: {errorId}
            </Typography>
          )}
        </Alert>
      )}
      onError={(error, errorInfo) => {
        console.error('API Error:', error, errorInfo);
        // Log API errors specifically
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Card sx={{ p: 2, border: 1, borderColor: 'error.main' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Form Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            There was an error with the form. Please refresh and try again.
          </Typography>
          <Button variant="outlined" color="error" onClick={resetError}>
            Reset Form
          </Button>
        </Card>
      )}
      onError={(error, errorInfo) => {
        console.error('Form Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Dashboard Unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Unable to load dashboard data. This might be a temporary issue.
          </Typography>
          <Button variant="contained" onClick={resetError} startIcon={<RefreshIcon />}>
            Reload Dashboard
          </Button>
        </Box>
      )}
      onError={(error, errorInfo) => {
        console.error('Dashboard Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}