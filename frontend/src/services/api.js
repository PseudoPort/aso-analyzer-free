import axios from 'axios'

// API base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request parameters')
        case 401:
          throw new Error('Authentication required')
        case 403:
          throw new Error('Access forbidden')
        case 404:
          throw new Error('Resource not found')
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(data.message || `Server error: ${status}`)
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.')
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

/**
 * Analyze an app by App Store ID
 * @param {string} appId - App Store track ID
 * @param {string} aiProvider - AI provider ('gemini' or 'claude') - optional, uses environment default
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeApp = async (appId, aiProvider = null) => {
  try {
    const requestBody = {
      appId: appId.toString(),
    }
    
    // Only include aiProvider if explicitly specified (otherwise use server default)
    if (aiProvider) {
      requestBody.aiProvider = aiProvider
    }
    
    const response = await api.post('/analyze-app', requestBody)
    
    return response.data
  } catch (error) {
    console.error('App analysis failed:', error)
    throw error
  }
}

/**
 * Analyze multiple keywords
 * @param {string[]} keywords - Array of keywords to analyze
 * @returns {Promise<Object>} Keyword analysis results
 */
export const analyzeKeywords = async (keywords) => {
  try {
    const response = await api.post('/analyze-keywords', {
      keywords: keywords.filter(k => k.trim()),
    })
    
    return response.data
  } catch (error) {
    console.error('Keyword analysis failed:', error)
    throw error
  }
}

/**
 * Get available AI providers and their status
 * @returns {Promise<Object>} Provider information
 */
export const getProviders = async () => {
  try {
    const response = await api.get('/providers')
    return response.data
  } catch (error) {
    console.error('Failed to get providers:', error)
    throw error
  }
}

/**
 * Get current configuration
 * @returns {Promise<Object>} Current configuration
 */
export const getConfiguration = async () => {
  try {
    const response = await api.get('/config')
    return response.data
  } catch (error) {
    console.error('Failed to get configuration:', error)
    throw error
  }
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

export default api