'use client'

import React from 'react'
import { Box, Typography, Grid, Container, Tabs, Tab } from '@mui/material'
import { AuditHistory } from '@/components/AuditHistory'
import { DashboardStats } from '@/components/DashboardStats'
import { RepositoryStats } from '@/components/RepositoryStats'
import { AuditAnalytics } from '@/components/AuditAnalytics'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`
  }
}

export default function DashboardPage() {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth='xl'>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h3'
          component='h1'
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 2
          }}
        >
          📊 Audit Dashboard
        </Typography>

        <Typography variant='h6' color='text.secondary' textAlign='center' sx={{ mb: 4 }}>
          Monitor and analyze your repository audit results
        </Typography>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <DashboardStats />
        </Grid>
      </Grid>

      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label='dashboard tabs'>
          <Tab label='Recent Audits' {...a11yProps(0)} />
          <Tab label='Repository Stats' {...a11yProps(1)} />
          <Tab label='Analytics' {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AuditHistory />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepositoryStats />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AuditAnalytics />
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  )
}
