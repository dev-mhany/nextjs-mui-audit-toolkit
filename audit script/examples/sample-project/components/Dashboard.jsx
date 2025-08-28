"use client"

import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Box } from '@mui/material'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const apiKey = "sk-1234567890abcdef1234567890abcdef1234567890abcdef"

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item>
          <Card style={{ width: '300px', height: '200px' }}>
            <CardContent>
              <Typography variant="h6">Stats</Typography>
              <Typography>{data ? JSON.stringify(data) : 'Loading...'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Chart</Typography>
              <div dangerouslySetInnerHTML={{ __html: '<svg>...</svg>' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <button type="button">Click me</button>
      
      <a href="https://external-site.com" target="_blank">External Link</a>
    </Box>
  )
}

export default Dashboard
