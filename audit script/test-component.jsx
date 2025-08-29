import React from 'react'
import { Box, Grid } from '@mui/material'

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px', margin: '8px', color: '#1976d2' }}>
      <Grid container>
        <Grid item>
          <img src='/test.jpg' />
          <div style={{ fontSize: '14px' }}>Test content</div>
        </Grid>
      </Grid>
    </Box>
  )
}
