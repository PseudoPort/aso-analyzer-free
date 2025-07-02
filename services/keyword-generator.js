require('dotenv').config();
const { AIProviderFactory } = require('./ai-providers/ai-provider-factory');

/**
 * Generates relevant search keywords from app store data using configurable AI provider
 * @param {Object} appData - Object containing title, description, and screenshots (image paths)
 * @param {string} providerName - AI provider to use ('claude' or 'gemini')
 * @param {Object} config - Additional configuration for the provider
 * @returns {Promise<Object>} JSON object with structure: { "keywords": [string] }
 */
async function generateKeywords(appData, providerName = null, config = {}) {
  try {
    // Determine which provider to use
    const selectedProvider = providerName || AIProviderFactory.getProviderFromEnv();
    
    // Validate provider configuration
    const validation = AIProviderFactory.validateProviderConfig(selectedProvider);
    if (!validation.success) {
      throw new Error(validation.message);
    }
    
    // Create AI provider instance
    const aiProvider = AIProviderFactory.createProvider(selectedProvider, config);
    
    console.log(`🤖 Using ${aiProvider.getProviderName().toUpperCase()} AI provider for keyword generation`);
    
    // Generate keywords using the selected provider
    const result = await aiProvider.generateKeywords(appData);
    
    return result;

  } catch (error) {
    console.error('Error generating keywords:', error.message);
    throw error;
  }
}

module.exports = {
  generateKeywords
};