const { ClaudeProvider } = require('./claude-provider');
const { GeminiProvider } = require('./gemini-provider');

/**
 * Factory class for creating AI provider instances with advanced configuration support
 */
class AIProviderFactory {
  /**
   * Available AI providers
   */
  static PROVIDERS = {
    claude: 'claude',
    gemini: 'gemini'
  };

  /**
   * Default provider (as requested, Gemini is now default)
   */
  static DEFAULT_PROVIDER = 'gemini';

  /**
   * Create an AI provider instance with environment-based configuration
   * @param {string} providerName - Name of the provider ('claude' or 'gemini')
   * @param {Object} config - Configuration object (overrides environment variables)
   * @returns {BaseAIProvider} AI provider instance
   */
  static createProvider(providerName = AIProviderFactory.DEFAULT_PROVIDER, config = {}) {
    const provider = providerName.toLowerCase();
    
    switch (provider) {
      case AIProviderFactory.PROVIDERS.claude:
        return AIProviderFactory.createClaudeProvider(config);
        
      case AIProviderFactory.PROVIDERS.gemini:
        return AIProviderFactory.createGeminiProvider(config);
        
      default:
        throw new Error(`Unsupported AI provider: ${providerName}. Supported providers: ${Object.keys(AIProviderFactory.PROVIDERS).join(', ')}`);
    }
  }

  /**
   * Create Claude provider instance with environment configuration support
   * @param {Object} config - Configuration object (overrides environment variables)
   * @returns {ClaudeProvider} Claude provider instance
   */
  static createClaudeProvider(config = {}) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required for Claude provider');
    }
    
    // Get configuration from environment variables with fallbacks
    const envConfig = {
      model: process.env.AI_MODEL_CLAUDE || 'claude-sonnet-4-20250514',
      temperature: AIProviderFactory.parseFloat(process.env.AI_TEMPERATURE, 0.3),
      maxTokens: AIProviderFactory.parseInt(process.env.AI_MAX_TOKENS, 2000),
    };
    
    // Merge environment config with passed config (passed config takes precedence)
    const finalConfig = {
      ...envConfig,
      ...config
    };
    
    // Validate configuration
    AIProviderFactory.validateConfig(finalConfig, 'Claude');
    
    console.log(`Claude Configuration: Model=${finalConfig.model}, Temperature=${finalConfig.temperature}, MaxTokens=${finalConfig.maxTokens}`);
    
    return new ClaudeProvider(apiKey, finalConfig);
  }

  /**
   * Create Gemini provider instance with environment configuration support
   * @param {Object} config - Configuration object (overrides environment variables)
   * @returns {GeminiProvider} Gemini provider instance
   */
  static createGeminiProvider(config = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required for Gemini provider');
    }
    
    // Get configuration from environment variables with fallbacks
    const envConfig = {
      model: process.env.AI_MODEL_GEMINI || 'gemini-2.5-pro',
      temperature: AIProviderFactory.parseFloat(process.env.AI_TEMPERATURE, 0.3),
      maxTokens: AIProviderFactory.parseInt(process.env.AI_MAX_TOKENS, 2000),
    };
    
    // Merge environment config with passed config (passed config takes precedence)
    const finalConfig = {
      ...envConfig,
      ...config
    };
    
    // Validate configuration
    AIProviderFactory.validateConfig(finalConfig, 'Gemini');
    
    console.log(`Gemini Configuration: Model=${finalConfig.model}, Temperature=${finalConfig.temperature}, MaxTokens=${finalConfig.maxTokens}`);
    
    return new GeminiProvider(apiKey, finalConfig);
  }

  /**
   * Parse float with fallback
   * @param {string} value - String value to parse
   * @param {number} fallback - Fallback value
   * @returns {number} Parsed float or fallback
   */
  static parseFloat(value, fallback) {
    if (!value) return fallback;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Parse integer with fallback
   * @param {string} value - String value to parse
   * @param {number} fallback - Fallback value
   * @returns {number} Parsed integer or fallback
   */
  static parseInt(value, fallback) {
    if (!value) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Validate provider configuration
   * @param {Object} config - Configuration to validate
   * @param {string} providerName - Provider name for error messages
   */
  static validateConfig(config, providerName) {
    // Validate temperature
    if (config.temperature < 0 || config.temperature > 2) {
      console.warn(`Warning: ${providerName} temperature ${config.temperature} is outside recommended range (0-2). Using anyway.`);
    }
    
    // Validate maxTokens
    if (config.maxTokens < 1 || config.maxTokens > 100000) {
      console.warn(`Warning: ${providerName} maxTokens ${config.maxTokens} is outside recommended range (1-100000). Using anyway.`);
    }
    
    // Validate model names
    if (providerName === 'Claude' && !config.model.includes('claude')) {
      console.warn(`Warning: Model name "${config.model}" doesn't appear to be a Claude model.`);
    }
    
    if (providerName === 'Gemini' && !config.model.includes('gemini')) {
      console.warn(`Warning: Model name "${config.model}" doesn't appear to be a Gemini model.`);
    }
  }

  /**
   * Get list of available providers
   * @returns {Array<string>} Array of provider names
   */
  static getAvailableProviders() {
    return Object.keys(AIProviderFactory.PROVIDERS);
  }

  /**
   * Validate provider name
   * @param {string} providerName - Provider name to validate
   * @returns {boolean} True if provider is supported
   */
  static isValidProvider(providerName) {
    return Object.values(AIProviderFactory.PROVIDERS).includes(providerName.toLowerCase());
  }

  /**
   * Get provider from environment variable or return default
   * @returns {string} Provider name
   */
  static getProviderFromEnv() {
    const envProvider = process.env.AI_PROVIDER;
    
    if (envProvider && AIProviderFactory.isValidProvider(envProvider)) {
      return envProvider.toLowerCase();
    }
    
    return AIProviderFactory.DEFAULT_PROVIDER;
  }

  /**
   * Validate that required API keys are available for the specified provider
   * @param {string} providerName - Provider name
   * @returns {Object} Validation result with success flag and message
   */
  static validateProviderConfig(providerName) {
    const provider = providerName.toLowerCase();
    
    switch (provider) {
      case AIProviderFactory.PROVIDERS.claude:
        if (!process.env.ANTHROPIC_API_KEY) {
          return {
            success: false,
            message: 'ANTHROPIC_API_KEY environment variable is required for Claude provider'
          };
        }
        break;
        
      case AIProviderFactory.PROVIDERS.gemini:
        if (!process.env.GEMINI_API_KEY) {
          return {
            success: false,
            message: 'GEMINI_API_KEY environment variable is required for Gemini provider'
          };
        }
        break;
        
      default:
        return {
          success: false,
          message: `Unsupported provider: ${providerName}`
        };
    }
    
    return {
      success: true,
      message: `${provider} provider configuration is valid`
    };
  }

  /**
   * Get current configuration for debugging
   * @returns {Object} Current configuration from environment variables
   */
  static getEnvironmentConfig() {
    return {
      AI_PROVIDER: process.env.AI_PROVIDER || 'not set',
      AI_MODEL_GEMINI: process.env.AI_MODEL_GEMINI || 'not set (default: gemini-2.5-pro)',
      AI_MODEL_CLAUDE: process.env.AI_MODEL_CLAUDE || 'not set (default: claude-sonnet-4-20250514)',
      AI_TEMPERATURE: process.env.AI_TEMPERATURE || 'not set (default: 0.3)',
      AI_MAX_TOKENS: process.env.AI_MAX_TOKENS || 'not set (default: 2000)',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'set' : 'not set',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'set' : 'not set'
    };
  }

  /**
   * Print current configuration for debugging
   */
  static printEnvironmentConfig() {
    const config = AIProviderFactory.getEnvironmentConfig();
    console.log('\nCurrent Environment Configuration:');
    console.log('==================================');
    Object.entries(config).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('==================================\n');
  }
}

module.exports = {
  AIProviderFactory
};