import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'

export async function createAuditDirectory(outputDir) {
  try {
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Only create subdirectories if we're not outputting to root
    if (outputDir !== '.' && outputDir !== './') {
      // Create subdirectories
      const subdirs = ['reports', 'logs', 'templates']
      for (const subdir of subdirs) {
        const fullPath = join(outputDir, subdir)
        if (!existsSync(fullPath)) {
          mkdirSync(fullPath, { recursive: true })
        }
      }
    }

    return true
  } catch (error) {
    throw new Error(`Failed to create audit directory: ${error.message}`)
  }
}

export function ensureDirectoryExists(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

export function writeFile(filePath, content) {
  try {
    ensureDirectoryExists(filePath)
    writeFileSync(filePath, content, 'utf-8')
    return true
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`)
  }
}

export function readFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`)
  }
}

export function getFileExtension(filePath) {
  return filePath.split('.').pop()?.toLowerCase() || ''
}

export function isJavaScriptFile(filePath) {
  const ext = getFileExtension(filePath)
  return ['js', 'jsx', 'ts', 'tsx'].includes(ext)
}

export function isReactFile(filePath) {
  const ext = getFileExtension(filePath)
  return ['jsx', 'tsx'].includes(ext)
}

export function isTypeScriptFile(filePath) {
  const ext = getFileExtension(filePath)
  return ['ts', 'tsx'].includes(ext)
}

export function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}

export function getRelativePath(basePath, fullPath) {
  return fullPath.replace(basePath, '').replace(/^[\\/]/, '')
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  return `${(ms / 60000).toFixed(2)}m`
}

export function sanitizeFileName(fileName) {
  return fileName.replace(/[<>:"/\\|?*]/g, '_')
}

export function createTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

export function validateProjectPath(projectPath) {
  if (!existsSync(projectPath)) {
    throw new Error(`Project path does not exist: ${projectPath}`)
  }

  // Check if it's a Node.js project
  const packageJsonPath = join(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    throw new Error(`Not a Node.js project (no package.json found): ${projectPath}`)
  }

  return true
}

export function getProjectInfo(projectPath) {
  try {
    const packageJsonPath = join(projectPath, 'package.json')
    const packageJson = JSON.parse(readFile(packageJsonPath))

    return {
      name: packageJson.name || 'Unknown',
      version: packageJson.version || 'Unknown',
      description: packageJson.description || 'No description',
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    }
  } catch (error) {
    return {
      name: 'Unknown',
      version: 'Unknown',
      description: 'Error reading package.json',
      dependencies: {},
      devDependencies: {}
    }
  }
}
