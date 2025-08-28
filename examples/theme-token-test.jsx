// Test file for MUI theme-token enforcement rule
// This file demonstrates both good and bad practices

import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function ThemeTokenTest() {
  const theme = useTheme()

  return (
    <Box>
      {/* ❌ BAD: Hardcoded colors and spacing */}
      <Box
        sx={{
          color: '#ff0000', // Should use theme.palette.error.main
          backgroundColor: 'rgb(0, 0, 255)', // Should use theme.palette.primary.main
          margin: '16px', // Should use theme.spacing(2)
          padding: '24px', // Should use theme.spacing(3)
          gap: '8px' // Should use theme.spacing(1)
        }}
      >
        Hardcoded values - will trigger warnings
      </Box>

      {/* ❌ BAD: More hardcoded values */}
      <Button
        sx={{
          color: '#00ff00', // Should use theme.palette.success.main
          border: '2px solid #000000', // Should use theme.palette.common.black
          borderRadius: '4px', // Should use theme.shape.borderRadius
          fontSize: '14px' // Should use theme.typography.body2.fontSize
        }}
      >
        Button with hardcoded styles
      </Button>

      {/* ✅ GOOD: Using theme tokens */}
      <Box
        sx={{
          color: theme.palette.error.main,
          backgroundColor: theme.palette.primary.main,
          margin: theme.spacing(2),
          padding: theme.spacing(3),
          gap: theme.spacing(1)
        }}
      >
        Using theme tokens - no warnings
      </Box>

      {/* ✅ GOOD: Using sx scale (shorthand) */}
      <Typography
        sx={{
          color: 'primary.main', // Theme token shorthand
          backgroundColor: 'background.paper', // Theme token shorthand
          m: 2, // sx scale for margin
          p: 3, // sx scale for padding
          borderRadius: 1 // sx scale for border radius
        }}
      >
        Using sx scale and theme tokens
      </Typography>

      {/* ❌ BAD: Hardcoded values in style prop */}
      <div
        style={{
          color: '#ff6600', // Should use theme tokens
          margin: '20px', // Should use theme spacing
          padding: '12px' // Should use theme spacing
        }}
      >
        Inline styles with hardcoded values
      </div>

      {/* ✅ GOOD: CSS variables (alternative approach) */}
      <Box
        sx={{
          color: 'var(--mui-palette-primary-main)',
          backgroundColor: 'var(--mui-palette-background-default)',
          margin: 'var(--mui-spacing-2)',
          padding: 'var(--mui-spacing-3)'
        }}
      >
        Using CSS variables - also acceptable
      </Box>
    </Box>
  )
}
