const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BaseAIProvider } = require('./base-ai-provider');
const { GEMINI_KEYWORD_FUNCTION } = require('../../tools/gemini-keyword-tool');

/**
 * Gemini AI Provider implementation using Google Generative AI SDK
 */
class GeminiProvider extends BaseAIProvider {
  constructor(apiKey, config = {}) {
    super(apiKey, config);
    
    this.client = new GoogleGenerativeAI(this.apiKey);
    this.model = config.model || 'gemini-2.5-pro';
    this.generativeModel = this.client.getGenerativeModel({ 
      model: this.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });
  }

  /**
   * Generate keywords using Gemini
   * @param {Object} appData - App data containing title, description, screenshots
   * @returns {Promise<Object>} Object with keywords array
   */
  async generateKeywords(appData) {
    try {
      console.log(`🧠 Using Gemini AI (${this.model}) for keyword generation...`);
      
      // Prepare content array with text and images
      const content = [this.formatPrompt(appData)];

      // Process and add screenshot images
      const processedImages = await this.processImages(appData.screenshots);
      content.push(...processedImages);

      // Configure model with function calling
      const modelWithFunctions = this.client.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        },
        tools: [{
          functionDeclarations: [GEMINI_KEYWORD_FUNCTION]
        }],
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: ["generate_app_keywords"]
          }
        }
      });

      // Generate content with function calling
      const result = await modelWithFunctions.generateContent(content);
      
      return this.parseResponse(result);

    } catch (error) {
      console.error('Error generating keywords with Gemini:', error.message);
      throw new Error(`Gemini AI error: ${error.message}`);
    }
  }

  /**
   * Process images for Gemini format
   * @param {Array<string>} imageUrls - Array of image URLs
   * @returns {Promise<Array>} Processed images in Gemini format
   */
  async processImages(imageUrls) {
    const processedImages = [];
    
    for (const imageUrl of imageUrls) {
      try {
        const imageData = await this.fetchImageAsBase64(imageUrl);
        
        processedImages.push({
          inlineData: {
            data: imageData.base64,
            mimeType: imageData.mediaType
          }
        });
      } catch (error) {
        console.warn(`⚠️ Failed to process screenshot for Gemini: ${error.message}`);
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
   * Parse Gemini response to extract keywords
   * @param {Object} response - Gemini API response
   * @returns {Object} Standardized response with keywords array
   */
  parseResponse(response) {
    try {
      const result = response.response;
      
      // Check for function calls in the response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const content = result.candidates[0].content;
        
        // Look for function call parts
        const functionCallPart = content.parts.find(part => part.functionCall);
        
        if (functionCallPart && functionCallPart.functionCall.name === 'generate_app_keywords') {
          const keywords = functionCallPart.functionCall.args.keywords;
          return { keywords };
        }
      }
      
      // Fallback: try to parse text response if function calling failed
      const textResponse = result.text();
      if (textResponse) {
        // Try to extract keywords from text response using regex or JSON parsing
        const keywordMatch = textResponse.match(/\[([^\]]+)\]/);
        if (keywordMatch) {
          const keywordsStr = keywordMatch[1];
          const keywords = keywordsStr.split(',').map(k => k.trim().replace(/['"]/g, ''));
          return { keywords };
        }
      }
      
      throw new Error('No valid function call or parseable keywords found in Gemini response');
      
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'gemini';
  }

  /**
   * Format prompt specifically for Gemini
   * @param {Object} appData - App data
   * @returns {string} Formatted prompt
   */
  formatPrompt(appData) {
    return super.formatPrompt(appData) + '\n\nPlease use the generate_app_keywords function to return your response with the identified keywords in a structured format.';
  }
}

module.exports = {
  GeminiProvider
};