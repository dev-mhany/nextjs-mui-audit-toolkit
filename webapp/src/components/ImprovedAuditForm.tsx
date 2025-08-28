import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

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

interface ImprovedAuditFormProps {
  onSubmit: (data: AuditFormData) => Promise<void>;
  loading?: boolean;
  installationStatus?: {
    hasApp: boolean;
    installUrl?: string;
  };
}

export default function ImprovedAuditForm({
  onSubmit,
  loading = false,
  installationStatus = { hasApp: false },
}: ImprovedAuditFormProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box>
          <Typography variant="h5" gutterBottom>
            🔍 Start Repository Audit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Automated Next.js + Material-UI best practices analysis
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is a simplified audit form component. The full implementation with form controls, 
            validation, and advanced options will be available in a future update.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}