#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createCanvas, loadImage } from 'canvas'

export async function validateMaskableIcon(iconPath, minPadding = 20) {
  try {
    if (!existsSync(iconPath)) {
      return {
        valid: false,
        error: 'Icon file not found',
        suggestion: `Ensure the icon exists at: ${iconPath}`
      }
    }

    // Load the image
    const image = await loadImage(iconPath)
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    // Draw image to canvas
    ctx.drawImage(image, 0, 0)

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, image.width, image.height)
    const data = imageData.data

    // Check edges for sufficient padding
    const edgePadding = checkEdgePadding(data, image.width, image.height, minPadding)

    // Check if subject is centered
    const centerAnalysis = checkSubjectCentering(data, image.width, image.height)

    if (!edgePadding.valid) {
      return {
        valid: false,
        error: 'Insufficient edge padding',
        details: edgePadding.details,
        suggestion: `Ensure at least ${minPadding}px of transparent/background padding around all edges of the icon`
      }
    }

    if (!centerAnalysis.valid) {
      return {
        valid: false,
        error: 'Subject not properly centered',
        details: centerAnalysis.details,
        suggestion: 'Center the main subject of the icon within the safe area (avoid edges)'
      }
    }

    return {
      valid: true,
      message: 'Maskable icon validation passed',
      details: {
        edgePadding: edgePadding.details,
        centering: centerAnalysis.details
      }
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to validate icon',
      details: error.message,
      suggestion: 'Check if the icon file is a valid PNG image'
    }
  }
}

function checkEdgePadding(data, width, height, minPadding) {
  const edges = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }

  // Check top edge
  for (let y = 0; y < minPadding; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 10) {
        // Not transparent
        edges.top = Math.max(edges.top, y + 1)
      }
    }
  }

  // Check bottom edge
  for (let y = height - minPadding; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 10) {
        // Not transparent
        edges.bottom = Math.max(edges.bottom, height - y)
      }
    }
  }

  // Check left edge
  for (let x = 0; x < minPadding; x++) {
    for (let y = 0; y < height; y++) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 10) {
        // Not transparent
        edges.left = Math.max(edges.left, x + 1)
      }
    }
  }

  // Check right edge
  for (let x = width - minPadding; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 10) {
        // Not transparent
        edges.right = Math.max(edges.right, width - x)
      }
    }
  }

  const valid =
    edges.top >= minPadding &&
    edges.bottom >= minPadding &&
    edges.left >= minPadding &&
    edges.right >= minPadding

  return {
    valid,
    details: {
      top: edges.top,
      bottom: edges.bottom,
      left: edges.left,
      right: edges.right,
      minRequired: minPadding
    }
  }
}

function checkSubjectCentering(data, width, height) {
  // Find the bounds of the non-transparent content
  let minX = width,
    maxX = 0,
    minY = height,
    maxY = 0
  let hasContent = false

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 10) {
        // Not transparent
        hasContent = true
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }

  if (!hasContent) {
    return {
      valid: false,
      details: 'No visible content found in icon'
    }
  }

  // Calculate content bounds
  const contentWidth = maxX - minX
  const contentHeight = maxY - minY
  const contentCenterX = minX + contentWidth / 2
  const contentCenterY = minY + contentHeight / 2

  // Calculate image center
  const imageCenterX = width / 2
  const imageCenterY = height / 2

  // Check if content is centered (within 10% tolerance)
  const toleranceX = width * 0.1
  const toleranceY = height * 0.1

  const centeredX = Math.abs(contentCenterX - imageCenterX) <= toleranceX
  const centeredY = Math.abs(contentCenterY - imageCenterY) <= toleranceY

  return {
    valid: centeredX && centeredY,
    details: {
      contentBounds: { minX, maxX, minY, maxY },
      contentCenter: { x: contentCenterX, y: contentCenterY },
      imageCenter: { x: imageCenterX, y: imageCenterY },
      tolerance: { x: toleranceX, y: toleranceY },
      centeredX,
      centeredY
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const iconPath = process.argv[2] || 'public/icons/maskable-512.png'

  console.log(`🔍 Validating maskable icon: ${iconPath}`)

  const result = await validateMaskableIcon(iconPath)

  if (result.valid) {
    console.log('✅ Icon validation passed!')
    console.log('📊 Details:', JSON.stringify(result.details, null, 2))
  } else {
    console.log('❌ Icon validation failed!')
    console.log('🚨 Error:', result.error)
    console.log('💡 Suggestion:', result.suggestion)
    if (result.details) {
      console.log('📊 Details:', JSON.stringify(result.details, null, 2))
    }
    process.exit(1)
  }
}

export default validateMaskableIcon
