import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Container 
} from '@mui/material';
import { AuditForm } from '@/components/AuditForm';
import { AuditHistory } from '@/components/AuditHistory';
import { DashboardStats } from '@/components/DashboardStats';

export default function HomePage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 2
          }}
        >
          Next.js + MUI Audit Toolkit
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Automated code quality analysis for Next.js applications using Material-UI
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Dashboard Stats */}
        <Grid item xs={12}>
          <DashboardStats />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: 1, 
              borderColor: 'divider',
              height: 'fit-content'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              🚀 Start New Audit
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter a GitHub repository URL to run a comprehensive audit.
              The results will be automatically pushed to your repository.
            </Typography>
            <AuditForm />
          </Paper>
        </Grid>

        {/* Audit History */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: 1, 
              borderColor: 'divider',
              height: 'fit-content'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              📊 Recent Audits
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View and track your recent audit results and progress.
            </Typography>
            <AuditHistory />
          </Paper>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 600 }}>
          Features
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>🔍 Comprehensive Analysis</Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzes Next.js architecture, MUI usage, accessibility, performance, and security
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>⚡ Automated Fixing</Typography>
              <Typography variant="body2" color="text.secondary">
                Automatically fixes common issues like inline styles and missing alt text
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>📈 Grading System</Typography>
              <Typography variant="body2" color="text.secondary">
                Provides A-F letter grades with detailed scoring breakdown
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}