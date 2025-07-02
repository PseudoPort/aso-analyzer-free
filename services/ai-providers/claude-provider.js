const Anthropic = require('@anthropic-ai/sdk');
const { BaseAIProvider } = require('./base-ai-provider');
const { KEYWORD_FUNCTION } = require('../../tools/keyword-tool');

/**
 * Claude AI Provider implementation using Anthropic SDK
 */
class ClaudeProvider extends BaseAIProvider {
  constructor(apiKey, config = {}) {
    super(apiKey, config);
    
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
    
    this.model = config.model || 'claude-sonnet-4-20250514';
  }

  /**
   * Generate keywords using Claude Sonnet
   * @param {Object} appData - App data containing title, description, screenshots
   * @returns {Promise<Object>} Object with keywords array
   */
  async generateKeywords(appData) {
    try {
      console.log(`🧠 Using Claude AI (${this.model}) for keyword generation...`);
      
      // Prepare content array with text and images
      const content = [
        {
          type: "text",
          text: this.formatPrompt(appData)
        }
      ];

      // Process and add screenshot images
      const processedImages = await this.processImages(appData.screenshots);
      content.push(...processedImages);

      // Call Claude API with function calling
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        tools: [KEYWORD_FUNCTION],
        tool_choice: { type: "tool", name: "generate_app_keywords" }
      });

      return this.parseResponse(response);

    } catch (error) {
      console.error('Error generating keywords with Claude:', error.message);
      throw new Error(`Claude AI error: ${error.message}`);
    }
  }

  /**
   * Process images for Claude format (base64 with media type)
   * @param {Array<string>} imageUrls - Array of image URLs
   * @returns {Promise<Array>} Processed images in Claude format
   */
  async processImages(imageUrls) {
    const processedImages = [];
    
    for (const imageUrl of imageUrls) {
      try {
        const imageData = await this.fetchImageAsBase64(imageUrl);
        
        processedImages.push({
          type: "image",
          source: {
            type: "base64",
            media_type: imageData.mediaType,
            data: imageData.base64
          }
        });
      } catch (error) {
        console.warn(`⚠️ Failed to process screenshot for Claude: ${error.message}`);
      }
    }
    
    return processedImages;
  }

  /**
   * Downloads image from URL and converts to base64 with media type detection
   * @param {string} imageUrl - URL of the image
   * @returns {Promise<Object>} Object with base64 string and mediaType
   */
  async fetchImageAsBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Detect image format from Content-Type header or URL extension
      let mediaType = 'image/jpeg'; // default
      const contentType = response.headers.get('content-type');

      if (contentType) {
        if (contentType.includes('image/png')) {
          mediaType = 'image/png';
        } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
          mediaType = 'image/jpeg';
        } else if (contentType.includes('image/webp')) {
          mediaType = 'image/webp';
        } else if (contentType.includes('image/gif')) {
          mediaType = 'image/gif';
        }
      } else {
        // Fallback to URL extension
        if (imageUrl.toLowerCase().includes('.png')) {
          mediaType = 'image/png';
        } else if (imageUrl.toLowerCase().includes('.webp')) {
          mediaType = 'image/webp';
        } else if (imageUrl.toLowerCase().includes('.gif')) {
          mediaType = 'image/gif';
        }
      }

      return {
        base64: buffer.toString('base64'),
        mediaType
      };
    } catch (error) {
      console.error(`Error fetching image ${imageUrl}:`, error);
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }
  }

  /**
   * Parse Claude response to extract keywords
   * @param {Object} response - Claude API response
   * @returns {Object} Standardized response with keywords array
   */
  parseResponse(response) {
    // Extract function call result from Claude's response
    const toolUse = response.content.find(content => content.type === 'tool_use');
    
    if (toolUse && toolUse.name === 'generate_app_keywords') {
      return { keywords: toolUse.input.keywords };
    } else {
      throw new Error('No valid function call found in Claude response');
    }
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'claude';
  }

  /**
   * Format prompt specifically for Claude
   * @param {Object} appData - App data
   * @returns {string} Formatted prompt
   */
  formatPrompt(appData) {
    return super.formatPrompt(appData) + '\n\nUse the generate_app_keywords function to return your response with the identified keywords.';
  }
}

module.exports = {
  ClaudeProvider
};