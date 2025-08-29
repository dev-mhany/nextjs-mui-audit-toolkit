import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import Head from 'next/head'

const Header = () => {
  return (
    <>
      <Head>
        <title>Sample App</title>
      </Head>
      <AppBar position='static' style={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Sample App
          </Typography>
          <Button color='inherit' onClick={() => console.log('Login clicked')}>
            Login
          </Button>
          <img src='/logo.png' alt='' />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
