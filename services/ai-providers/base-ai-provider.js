/**
 * Abstract base class for AI providers
 * Defines the common interface that all AI providers must implement
 */
class BaseAIProvider {
  constructor(apiKey, config = {}) {
    if (new.target === BaseAIProvider) {
      throw new Error('BaseAIProvider is abstract and cannot be instantiated directly');
    }
    
    this.apiKey = apiKey;
    this.config = {
      temperature: 0.3,
      maxTokens: 2000,
      ...config
    };
    
    if (!this.apiKey) {
      throw new Error(`API key is required for ${this.constructor.name}`);
    }
  }

  /**
   * Generate keywords from app data and screenshots
   * @param {Object} appData - App data containing title, description, screenshots
   * @returns {Promise<Object>} Object with keywords array
   */
  async generateKeywords(appData) {
    throw new Error('generateKeywords method must be implemented by subclass');
  }

  /**
   * Process images for the specific AI provider format
   * @param {Array<string>} imageUrls - Array of image URLs
   * @returns {Promise<Array>} Processed images in provider-specific format
   */
  async processImages(imageUrls) {
    throw new Error('processImages method must be implemented by subclass');
  }

  /**
   * Format the prompt for the specific AI provider
   * @param {Object} appData - App data
   * @returns {string} Formatted prompt
   */
  formatPrompt(appData) {
    return `Analyze this app store data and generate the most relevant search keywords that users would likely use to find this app:

Title: ${appData.title}

Description: ${appData.description}

I'm also providing screenshots of the app store page. Using the information provided in the screenshots, and the description of the app, provide the most relevant search queries directly related to the app and the information provided in screenshots, title, subtitle and description. ensuring only keywords/search queries that would be exact search phrases derived from title, subtitle, app screenshots, and description. exclude long tail keywords, "* app" search phrases and any search phrases a user wouldn't realistically search for.

Generate 10-15 highly relevant keywords for app store search optimization.`;
  }

  /**
   * Parse response from AI provider into standardized format
   * @param {*} response - Raw response from AI provider
   * @returns {Object} Standardized response with keywords array
   */
  parseResponse(response) {
    throw new Error('parseResponse method must be implemented by subclass');
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    throw new Error('getProviderName method must be implemented by subclass');
  }

  /**
   * Validate configuration for the provider
   * @returns {boolean} True if configuration is valid
   */
  validateConfig() {
    return !!this.apiKey;
  }
}

module.exports = {
  BaseAIProvider
};