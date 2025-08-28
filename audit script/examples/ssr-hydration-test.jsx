// Test file for SSR hydration sanity rule
// This file demonstrates both good and bad practices for SSR

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'

export default function SSRHydrationTest() {
  const [clientTime, setClientTime] = useState(null)
  const [clientRandom, setClientRandom] = useState(null)

  // ❌ BAD: Non-deterministic values in component body - will trigger errors
  const serverTime = new Date() // This causes hydration mismatch
  const serverRandom = Math.random() // This causes hydration mismatch
  const serverUUID = crypto.randomUUID() // This causes hydration mismatch
  const serverTimestamp = Date.now() // This causes hydration mismatch

  // ✅ GOOD: Move non-deterministic logic to useEffect (client-side only)
  useEffect(() => {
    setClientTime(new Date())
    setClientRandom(Math.random())
  }, [])

  // ✅ GOOD: Stable values for SSR
  const stableId = 'user-123' // Stable ID
  const stableTimestamp = 1640995200000 // Stable timestamp (Jan 1, 2022)
  const stableSeed = 42 // Stable seed for random-like behavior

  // ✅ GOOD: Conditional rendering for client-specific features
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Box>
      {/* ❌ BAD: Using server-generated non-deterministic values */}
      <Typography variant='h6'>Server Time: {serverTime.toLocaleString()}</Typography>
      <Typography>Server Random: {serverRandom}</Typography>
      <Typography>Server UUID: {serverUUID}</Typography>
      <Typography>Server Timestamp: {serverTimestamp}</Typography>

      {/* ✅ GOOD: Using client-side generated values */}
      {clientTime && (
        <Typography variant='h6'>Client Time: {clientTime.toLocaleString()}</Typography>
      )}
      {clientRandom && <Typography>Client Random: {clientRandom}</Typography>}

      {/* ✅ GOOD: Using stable values */}
      <Typography>Stable ID: {stableId}</Typography>
      <Typography>Stable Timestamp: {new Date(stableTimestamp).toLocaleString()}</Typography>
      <Typography>Stable Seed: {stableSeed}</Typography>

      {/* ✅ GOOD: Conditional rendering for client-only features */}
      {isClient && (
        <Box>
          <Typography>This only renders on the client</Typography>
          <Button onClick={() => alert('Client-side only!')}>Client Button</Button>
        </Box>
      )}

      {/* ❌ BAD: More problematic patterns that would trigger errors */}
      {/* 
      const badRandom = Math.floor(Math.random() * 100)
      const badDate = new Date()
      const badNow = Date.now()
      */}
    </Box>
  )
}

// ❌ BAD: Non-deterministic values in component initialization
// These would also trigger errors:
// const globalRandom = Math.random()
// const globalTime = new Date()
// const globalUUID = crypto.randomUUID()

// ✅ GOOD: Stable initialization
const globalStableId = 'app-123'
const globalStableTimestamp = 1640995200000
