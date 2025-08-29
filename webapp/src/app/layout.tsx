import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js + MUI Audit Toolkit',
  description:
    'Web interface for auditing Next.js + MUI projects with automated GitHub integration',
  keywords: ['Next.js', 'MUI', 'audit', 'best practices', 'static analysis']
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider>
          <AppBar position='sticky' elevation={1}>
            <Toolbar>
              <Typography
                variant='h6'
                component={Link}
                href='/'
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 600
                }}
              >
                🔍 Next.js + MUI Audit Toolkit
              </Typography>
              <Typography variant='body2' sx={{ opacity: 0.8 }}>
                by dev-mhany
              </Typography>
            </Toolbar>
          </AppBar>

          <Container maxWidth='lg' sx={{ py: 4 }}>
            <Box component='main'>{children}</Box>
          </Container>

          <Box
            component='footer'
            sx={{
              mt: 'auto',
              py: 3,
              px: 2,
              backgroundColor: 'grey.100',
              textAlign: 'center'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Next.js + MUI Audit Toolkit - Automated Code Quality Analysis
            </Typography>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}
