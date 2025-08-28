import { createHash } from 'crypto'
import { readFile, writeFile, mkdir, stat, readdir, unlink } from 'fs/promises'
import { join, dirname } from 'path'
import { logger } from './logger.js'

export class CacheManager {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || '.audit-cache'
    this.maxAge = options.maxAge || 24 * 60 * 60 * 1000 // 24 hours in ms
    this.maxSize = options.maxSize || 100 * 1024 * 1024 // 100MB
    this.enabled = options.enabled !== false
    this.compression = options.compression !== false

    this.stats = {
      hits: 0,
      misses: 0,
      writes: 0,
      errors: 0
    }

    this.logger = logger.child({ component: 'cache' })
  }

  async initialize() {
    if (!this.enabled) {
      this.logger.debug('Cache disabled')
      return
    }

    try {
      await mkdir(this.cacheDir, { recursive: true })
      await this.cleanup()
      this.logger.debug('Cache initialized', { cacheDir: this.cacheDir })
    } catch (error) {
      this.logger.warn('Failed to initialize cache', error)
      this.enabled = false
    }
  }

  getCacheKey(filePath, content, configHash = '') {
    const contentHash = this.hashContent(content)
    const pathHash = this.hashContent(filePath)
    return `${pathHash}_${contentHash}_${configHash}`
  }

  getConfigHash(config) {
    if (!config) return ''

    // Create a stable hash of configuration that affects scanning
    const relevantConfig = {
      rules: config.rules || {},
      categories: config.categories || {}
    }

    return this.hashContent(JSON.stringify(relevantConfig, Object.keys(relevantConfig).sort()))
  }

  hashContent(content) {
    return createHash('md5')
      .update(content || '')
      .digest('hex')
  }

  async getCachedResult(key) {
    if (!this.enabled) return null

    try {
      const cacheFilePath = this.getCacheFilePath(key)
      const cacheData = await readFile(cacheFilePath, 'utf8')
      const cached = JSON.parse(cacheData)

      // Check if cache entry is still valid
      if (this.isCacheValid(cached)) {
        this.stats.hits++
        this.logger.trace('Cache hit', { key: key.substring(0, 8) })
        return cached.data
      } else {
        // Cache expired, remove it
        await this.removeCacheEntry(key)
        this.stats.misses++
        this.logger.trace('Cache expired', { key: key.substring(0, 8) })
        return null
      }
    } catch (error) {
      this.stats.misses++
      this.logger.trace('Cache miss', {
        key: key.substring(0, 8),
        reason: error.code || error.message
      })
      return null
    }
  }

  async setCachedResult(key, result, metadata = {}) {
    if (!this.enabled) return

    try {
      const cacheEntry = {
        data: result,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          version: '1.1.0'
        }
      }

      const cacheFilePath = this.getCacheFilePath(key)
      const cacheDir = dirname(cacheFilePath)

      await mkdir(cacheDir, { recursive: true })

      let cacheData = JSON.stringify(cacheEntry)

      // Simple compression if enabled
      if (this.compression && cacheData.length > 1024) {
        // In a real implementation, you might use zlib here
        // For simplicity, we'll just store as-is for now
      }

      await writeFile(cacheFilePath, cacheData)

      this.stats.writes++
      this.logger.trace('Cache written', {
        key: key.substring(0, 8),
        size: cacheData.length
      })

      // Check cache size periodically
      if (this.stats.writes % 50 === 0) {
        await this.checkCacheSize()
      }
    } catch (error) {
      this.stats.errors++
      this.logger.warn('Failed to write cache', error, { key: key.substring(0, 8) })
    }
  }

  getCacheFilePath(key) {
    // Create subdirectories to avoid too many files in one directory
    const subdir = key.substring(0, 2)
    return join(this.cacheDir, subdir, `${key}.json`)
  }

  isCacheValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.timestamp) return false

    const age = Date.now() - cacheEntry.timestamp
    return age < this.maxAge
  }

  async removeCacheEntry(key) {
    try {
      const cacheFilePath = this.getCacheFilePath(key)
      await unlink(cacheFilePath)
    } catch (error) {
      // Ignore errors when removing cache entries
    }
  }

  async cleanup() {
    if (!this.enabled) return

    try {
      const cleanupStart = Date.now()
      let removedCount = 0
      let totalSize = 0

      const subdirs = await readdir(this.cacheDir).catch(() => [])

      for (const subdir of subdirs) {
        const subdirPath = join(this.cacheDir, subdir)

        try {
          const files = await readdir(subdirPath)

          for (const file of files) {
            const filePath = join(subdirPath, file)

            try {
              const stats = await stat(filePath)
              totalSize += stats.size

              // Remove old cache entries
              const age = Date.now() - stats.mtime.getTime()
              if (age > this.maxAge) {
                await unlink(filePath)
                removedCount++
              }
            } catch (error) {
              // File might have been removed already
            }
          }
        } catch (error) {
          // Subdirectory might not exist or be accessible
        }
      }

      const cleanupDuration = Date.now() - cleanupStart

      this.logger.debug('Cache cleanup completed', {
        duration: `${cleanupDuration}ms`,
        removedEntries: removedCount,
        totalSize: `${Math.round(totalSize / 1024)}KB`
      })

      // If cache is still too large, remove oldest entries
      if (totalSize > this.maxSize) {
        await this.evictOldestEntries(totalSize - this.maxSize)
      }
    } catch (error) {
      this.logger.warn('Cache cleanup failed', error)
    }
  }

  async evictOldestEntries(bytesToRemove) {
    try {
      const entries = []
      const subdirs = await readdir(this.cacheDir).catch(() => [])

      for (const subdir of subdirs) {
        const subdirPath = join(this.cacheDir, subdir)

        try {
          const files = await readdir(subdirPath)

          for (const file of files) {
            const filePath = join(subdirPath, file)

            try {
              const stats = await stat(filePath)
              entries.push({
                path: filePath,
                mtime: stats.mtime.getTime(),
                size: stats.size
              })
            } catch (error) {
              // File might have been removed
            }
          }
        } catch (error) {
          // Subdirectory might not exist
        }
      }

      // Sort by modification time (oldest first)
      entries.sort((a, b) => a.mtime - b.mtime)

      let removedBytes = 0
      let removedCount = 0

      for (const entry of entries) {
        if (removedBytes >= bytesToRemove) break

        try {
          await unlink(entry.path)
          removedBytes += entry.size
          removedCount++
        } catch (error) {
          // File might have been removed already
        }
      }

      this.logger.debug('Cache eviction completed', {
        removedEntries: removedCount,
        removedBytes: `${Math.round(removedBytes / 1024)}KB`
      })
    } catch (error) {
      this.logger.warn('Cache eviction failed', error)
    }
  }

  async checkCacheSize() {
    try {
      let totalSize = 0
      const subdirs = await readdir(this.cacheDir).catch(() => [])

      for (const subdir of subdirs) {
        const subdirPath = join(this.cacheDir, subdir)

        try {
          const files = await readdir(subdirPath)

          for (const file of files) {
            const filePath = join(subdirPath, file)

            try {
              const stats = await stat(filePath)
              totalSize += stats.size
            } catch (error) {
              // File might have been removed
            }
          }
        } catch (error) {
          // Subdirectory might not exist
        }
      }

      if (totalSize > this.maxSize) {
        this.logger.debug('Cache size limit exceeded', {
          currentSize: `${Math.round(totalSize / 1024)}KB`,
          maxSize: `${Math.round(this.maxSize / 1024)}KB`
        })

        await this.evictOldestEntries(totalSize - this.maxSize)
      }
    } catch (error) {
      this.logger.warn('Cache size check failed', error)
    }
  }

  async clear() {
    if (!this.enabled) return

    try {
      const subdirs = await readdir(this.cacheDir).catch(() => [])

      for (const subdir of subdirs) {
        const subdirPath = join(this.cacheDir, subdir)

        try {
          const files = await readdir(subdirPath)

          for (const file of files) {
            const filePath = join(subdirPath, file)
            await unlink(filePath).catch(() => {})
          }
        } catch (error) {
          // Subdirectory might not exist
        }
      }

      this.stats = { hits: 0, misses: 0, writes: 0, errors: 0 }
      this.logger.info('Cache cleared')
    } catch (error) {
      this.logger.warn('Failed to clear cache', error)
    }
  }

  getStats() {
    const hitRate =
      this.stats.hits + this.stats.misses > 0
        ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(1)
        : 0

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      enabled: this.enabled
    }
  }

  async getInfo() {
    if (!this.enabled) {
      return { enabled: false }
    }

    try {
      let entryCount = 0
      let totalSize = 0
      const subdirs = await readdir(this.cacheDir).catch(() => [])

      for (const subdir of subdirs) {
        const subdirPath = join(this.cacheDir, subdir)

        try {
          const files = await readdir(subdirPath)
          entryCount += files.length

          for (const file of files) {
            const filePath = join(subdirPath, file)

            try {
              const stats = await stat(filePath)
              totalSize += stats.size
            } catch (error) {
              // File might have been removed
            }
          }
        } catch (error) {
          // Subdirectory might not exist
        }
      }

      return {
        enabled: true,
        cacheDir: this.cacheDir,
        entryCount,
        totalSize: `${Math.round(totalSize / 1024)}KB`,
        maxSize: `${Math.round(this.maxSize / 1024)}KB`,
        maxAge: `${Math.round(this.maxAge / (60 * 60 * 1000))}h`,
        ...this.getStats()
      }
    } catch (error) {
      this.logger.warn('Failed to get cache info', error)
      return { enabled: true, error: error.message }
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager({
  cacheDir: process.env.AUDIT_CACHE_DIR || '.audit-cache',
  maxAge: parseInt(process.env.AUDIT_CACHE_MAX_AGE) || 24 * 60 * 60 * 1000,
  maxSize: parseInt(process.env.AUDIT_CACHE_MAX_SIZE) || 100 * 1024 * 1024,
  enabled: process.env.AUDIT_CACHE_ENABLED !== 'false'
})
