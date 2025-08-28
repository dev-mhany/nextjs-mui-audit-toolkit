import { logger } from './logger.js'
import { join, dirname } from 'path'
import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'

export class PluginManager {
  constructor() {
    this.plugins = new Map()
    this.rules = new Map()
    this.processors = new Map()
    this.hooks = new Map()
    this.logger = logger.child({ component: 'plugin-manager' })

    // Initialize built-in hooks
    this.initializeHooks()
  }

  initializeHooks() {
    const hooks = [
      'beforeScan',
      'afterScan',
      'beforeFileProcess',
      'afterFileProcess',
      'beforeGrading',
      'afterGrading',
      'beforeReporting',
      'afterReporting'
    ]

    hooks.forEach(hook => {
      this.hooks.set(hook, [])
    })
  }

  async registerPlugin(pluginName, plugin) {
    try {
      this.logger.debug(`Registering plugin: ${pluginName}`)

      // Validate plugin structure
      if (!this.validatePlugin(plugin)) {
        throw new Error(`Invalid plugin structure for ${pluginName}`)
      }

      // Store plugin
      this.plugins.set(pluginName, plugin)

      // Register rules
      if (plugin.rules) {
        plugin.rules.forEach(rule => {
          this.registerRule(rule, pluginName)
        })
      }

      // Register processors
      if (plugin.processors) {
        Object.entries(plugin.processors).forEach(([ext, processor]) => {
          this.registerProcessor(ext, processor, pluginName)
        })
      }

      // Register hooks
      if (plugin.hooks) {
        Object.entries(plugin.hooks).forEach(([hookName, handler]) => {
          this.registerHook(hookName, handler, pluginName)
        })
      }

      // Run plugin initialization
      if (plugin.initialize) {
        await plugin.initialize()
      }

      this.logger.info(`Plugin registered successfully: ${pluginName}`)
      return true
    } catch (error) {
      this.logger.error(`Failed to register plugin ${pluginName}`, error)
      throw error
    }
  }

  validatePlugin(plugin) {
    // Basic plugin structure validation
    if (!plugin || typeof plugin !== 'object') {
      return false
    }

    // Plugin must have at least one of: rules, processors, or hooks
    if (!plugin.rules && !plugin.processors && !plugin.hooks) {
      return false
    }

    // Validate rules if present
    if (plugin.rules) {
      if (!Array.isArray(plugin.rules)) {
        return false
      }

      for (const rule of plugin.rules) {
        if (!this.validateRule(rule)) {
          return false
        }
      }
    }

    // Validate processors if present
    if (plugin.processors) {
      if (typeof plugin.processors !== 'object') {
        return false
      }

      for (const [ext, processor] of Object.entries(plugin.processors)) {
        if (typeof processor !== 'function') {
          return false
        }
      }
    }

    return true
  }

  validateRule(rule) {
    const requiredFields = ['id', 'category', 'severity', 'message']

    for (const field of requiredFields) {
      if (!rule[field]) {
        return false
      }
    }

    // Rule must have either pattern or checkFunction
    if (!rule.pattern && !rule.checkFunction) {
      return false
    }

    // Validate severity
    if (!['error', 'warning', 'info'].includes(rule.severity)) {
      return false
    }

    return true
  }

  registerRule(rule, pluginName) {
    if (!this.validateRule(rule)) {
      throw new Error(`Invalid rule: ${rule.id}`)
    }

    if (this.rules.has(rule.id)) {
      this.logger.warn(`Rule ${rule.id} already exists, overriding`)
    }

    // Add plugin metadata to rule
    const enhancedRule = {
      ...rule,
      plugin: pluginName,
      registeredAt: new Date().toISOString()
    }

    this.rules.set(rule.id, enhancedRule)
    this.logger.debug(`Rule registered: ${rule.id} from plugin ${pluginName}`)
  }

  registerProcessor(extension, processor, pluginName) {
    if (typeof processor !== 'function') {
      throw new Error(`Processor for ${extension} must be a function`)
    }

    const processorKey = extension.startsWith('.') ? extension : `.${extension}`

    if (this.processors.has(processorKey)) {
      this.logger.warn(`Processor for ${processorKey} already exists, overriding`)
    }

    this.processors.set(processorKey, {
      processor,
      plugin: pluginName,
      registeredAt: new Date().toISOString()
    })

    this.logger.debug(`Processor registered: ${processorKey} from plugin ${pluginName}`)
  }

  registerHook(hookName, handler, pluginName) {
    if (typeof handler !== 'function') {
      throw new Error(`Hook handler for ${hookName} must be a function`)
    }

    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }

    this.hooks.get(hookName).push({
      handler,
      plugin: pluginName,
      registeredAt: new Date().toISOString()
    })

    this.logger.debug(`Hook registered: ${hookName} from plugin ${pluginName}`)
  }

  async executeHook(hookName, ...args) {
    const hookHandlers = this.hooks.get(hookName) || []

    if (hookHandlers.length === 0) {
      return args
    }

    this.logger.trace(`Executing hook: ${hookName} with ${hookHandlers.length} handlers`)

    let result = args

    for (const { handler, plugin } of hookHandlers) {
      try {
        const handlerResult = await handler(...result)

        // If handler returns something, use it as new args
        if (handlerResult !== undefined) {
          result = Array.isArray(handlerResult) ? handlerResult : [handlerResult]
        }
      } catch (error) {
        this.logger.error(`Hook ${hookName} failed in plugin ${plugin}`, error)
        // Continue with other handlers
      }
    }

    return result
  }

  async loadPluginsFromDirectory(pluginsDir) {
    if (!existsSync(pluginsDir)) {
      this.logger.debug(`Plugins directory does not exist: ${pluginsDir}`)
      return []
    }

    try {
      const entries = await readdir(pluginsDir)
      const loadedPlugins = []

      for (const entry of entries) {
        const pluginPath = join(pluginsDir, entry)
        const stats = await stat(pluginPath)

        if (stats.isDirectory()) {
          // Look for package.json or index.js in plugin directory
          const packagePath = join(pluginPath, 'package.json')
          const indexPath = join(pluginPath, 'index.js')

          if (existsSync(packagePath)) {
            const plugin = await this.loadPluginFromPackage(pluginPath)
            if (plugin) {
              loadedPlugins.push(plugin)
            }
          } else if (existsSync(indexPath)) {
            const plugin = await this.loadPluginFromFile(indexPath)
            if (plugin) {
              loadedPlugins.push(plugin)
            }
          }
        } else if (entry.endsWith('.js') || entry.endsWith('.mjs')) {
          // Single file plugin
          const plugin = await this.loadPluginFromFile(pluginPath)
          if (plugin) {
            loadedPlugins.push(plugin)
          }
        }
      }

      this.logger.info(`Loaded ${loadedPlugins.length} plugins from ${pluginsDir}`)
      return loadedPlugins
    } catch (error) {
      this.logger.error(`Failed to load plugins from directory: ${pluginsDir}`, error)
      return []
    }
  }

  async loadPluginFromPackage(pluginDir) {
    try {
      const packageJson = JSON.parse(
        await import('fs').then(fs => fs.promises.readFile(join(pluginDir, 'package.json'), 'utf8'))
      )

      const pluginName = packageJson.name
      const mainFile = packageJson.main || 'index.js'

      // Convert to absolute path and proper URL format
      const { resolve } = await import('path')
      const pluginPath = resolve(join(pluginDir, mainFile))
      const fileUrl = `file:///${pluginPath.replace(/\\/g, '/')}`

      const pluginModule = await import(fileUrl)
      const plugin = pluginModule.default || pluginModule

      await this.registerPlugin(pluginName, plugin)
      return { name: pluginName, plugin }
    } catch (error) {
      this.logger.error(`Failed to load plugin from package: ${pluginDir}`, error)
      return null
    }
  }

  async loadPluginFromFile(pluginPath) {
    try {
      // Convert to absolute path and proper URL format
      const { resolve } = await import('path')
      const absolutePath = resolve(pluginPath)
      const fileUrl = `file:///${absolutePath.replace(/\\/g, '/')}` // Convert backslashes to forward slashes

      const pluginModule = await import(fileUrl)
      const plugin = pluginModule.default || pluginModule

      const pluginName = plugin.name || `plugin-${Date.now()}`
      await this.registerPlugin(pluginName, plugin)
      return { name: pluginName, plugin }
    } catch (error) {
      this.logger.error(`Failed to load plugin from file: ${pluginPath}`, error)
      return null
    }
  }

  async loadPluginFromNpm(packageName) {
    try {
      const pluginModule = await import(packageName)
      const plugin = pluginModule.default || pluginModule

      await this.registerPlugin(packageName, plugin)
      return { name: packageName, plugin }
    } catch (error) {
      this.logger.error(`Failed to load npm plugin: ${packageName}`, error)
      return null
    }
  }

  getAllRules() {
    return Array.from(this.rules.values())
  }

  getRule(ruleId) {
    return this.rules.get(ruleId)
  }

  getRulesByCategory(category) {
    return Array.from(this.rules.values()).filter(rule => rule.category === category)
  }

  getRulesByPlugin(pluginName) {
    return Array.from(this.rules.values()).filter(rule => rule.plugin === pluginName)
  }

  getProcessor(extension) {
    const key = extension.startsWith('.') ? extension : `.${extension}`
    return this.processors.get(key)
  }

  getAllProcessors() {
    return Array.from(this.processors.entries())
  }

  getPlugin(pluginName) {
    return this.plugins.get(pluginName)
  }

  getAllPlugins() {
    return Array.from(this.plugins.entries())
  }

  unregisterPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      return false
    }

    // Remove rules from this plugin
    for (const [ruleId, rule] of this.rules.entries()) {
      if (rule.plugin === pluginName) {
        this.rules.delete(ruleId)
      }
    }

    // Remove processors from this plugin
    for (const [ext, processorData] of this.processors.entries()) {
      if (processorData.plugin === pluginName) {
        this.processors.delete(ext)
      }
    }

    // Remove hooks from this plugin
    for (const [hookName, handlers] of this.hooks.entries()) {
      const filteredHandlers = handlers.filter(h => h.plugin !== pluginName)
      this.hooks.set(hookName, filteredHandlers)
    }

    // Remove plugin
    this.plugins.delete(pluginName)

    this.logger.info(`Plugin unregistered: ${pluginName}`)
    return true
  }

  getStats() {
    return {
      plugins: this.plugins.size,
      rules: this.rules.size,
      processors: this.processors.size,
      hooks: Object.fromEntries(
        Array.from(this.hooks.entries()).map(([name, handlers]) => [name, handlers.length])
      )
    }
  }

  getRegisteredPlugins() {
    return Array.from(this.plugins.values())
  }

  enablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      return false
    }

    plugin.enabled = true
    this.logger.info(`Plugin enabled: ${pluginName}`)
    return true
  }

  disablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      return false
    }

    plugin.enabled = false
    this.logger.info(`Plugin disabled: ${pluginName}`)
    return true
  }

  async processFile(filePath, content, extension) {
    const processor = this.getProcessor(extension)

    if (processor) {
      try {
        this.logger.trace(`Processing file with custom processor: ${filePath}`)
        return await processor.processor(content, filePath)
      } catch (error) {
        this.logger.error(`Custom processor failed for ${filePath}`, error)
        throw error
      }
    }

    // Return original content if no processor
    return content
  }

  // Plugin development helpers
  createPluginTemplate(pluginName, options = {}) {
    const template = {
      name: pluginName,
      version: '1.0.0',
      description: `Custom audit plugin: ${pluginName}`,

      rules: [
        {
          id: `${pluginName}/example-rule`,
          category: options.category || 'custom',
          severity: 'warning',
          message: 'Example rule message',
          pattern: /example-pattern/,
          suggestion: 'Example suggestion'
        }
      ],

      processors: {},

      hooks: {
        beforeScan: async scanOptions => {
          // Pre-scan hook logic
          return scanOptions
        }
      },

      initialize: async () => {
        // Plugin initialization logic
      }
    }

    return template
  }
}

// Singleton instance
export const pluginManager = new PluginManager()

// Plugin development utilities
export class PluginBuilder {
  constructor(name) {
    this.plugin = {
      name,
      rules: [],
      processors: {},
      hooks: {}
    }
  }

  addRule(rule) {
    this.plugin.rules.push(rule)
    return this
  }

  addProcessor(extension, processor) {
    this.plugin.processors[extension] = processor
    return this
  }

  addHook(hookName, handler) {
    this.plugin.hooks[hookName] = handler
    return this
  }

  setInitializer(initFn) {
    this.plugin.initialize = initFn
    return this
  }

  build() {
    return this.plugin
  }
}

// Built-in plugin helpers
export const createRule = options => {
  const {
    id,
    category = 'custom',
    severity = 'warning',
    message,
    pattern,
    checkFunction,
    suggestion = '',
    shouldCheck = () => true
  } = options

  if (!id || !message) {
    throw new Error('Rule must have id and message')
  }

  if (!pattern && !checkFunction) {
    throw new Error('Rule must have pattern or checkFunction')
  }

  return {
    id,
    category,
    severity,
    message,
    pattern,
    checkFunction,
    suggestion,
    shouldCheck
  }
}
