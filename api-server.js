const express = require('express')
const cors = require('cors')
const { analyzeApp } = require('./main')
const { ASOAnalyzer } = require('./services/aso-analyzer')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Get available AI providers
app.get('/api/providers', (req, res) => {
  try {
    const { AIProviderFactory } = require('./services/ai-providers/ai-provider-factory')
    
    const providers = AIProviderFactory.getAvailableProviders().map(provider => {
      const validation = AIProviderFactory.validateProviderConfig(provider)
      return {
        id: provider,
        name: provider === 'gemini' ? 'Gemini 2.5 Pro' : 'Claude Sonnet 4',
        available: validation.success,
        default: provider === AIProviderFactory.DEFAULT_PROVIDER,
        description: provider === 'gemini' ? 'Cost-effective, fast analysis' : 'Premium quality analysis'
      }
    })
    
    // Include current configuration for debugging
    const config = AIProviderFactory.getEnvironmentConfig()
    
    res.json({ 
      providers,
      configuration: config,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting providers:', error)
    res.status(500).json({ 
      error: 'Failed to get providers',
      message: error.message 
    })
  }
})

// Get current configuration endpoint
app.get('/api/config', (req, res) => {
  try {
    const { AIProviderFactory } = require('./services/ai-providers/ai-provider-factory')
    const config = AIProviderFactory.getEnvironmentConfig()
    
    res.json({
      configuration: config,
      timestamp: new Date().toISOString(),
      note: 'Sensitive values like API keys are masked for security'
    })
  } catch (error) {
    console.error('Error getting configuration:', error)
    res.status(500).json({ 
      error: 'Failed to get configuration',
      message: error.message 
    })
  }
})

// Analyze app endpoint
app.post('/api/analyze-app', async (req, res) => {
  try {
    const { appId, aiProvider } = req.body
    
    // Validate input
    if (!appId) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'appId is required' 
      })
    }
    
    const numericAppId = parseInt(appId, 10)
    if (isNaN(numericAppId) || numericAppId <= 0) {
      return res.status(400).json({ 
        error: 'Invalid app ID',
        message: 'App ID must be a valid numeric value' 
      })
    }
    
    console.log(`🚀 Starting app analysis for ID: ${numericAppId} with provider: ${aiProvider || 'environment default'}`)
    
    // Call the main analysis function (aiProvider is optional, will use environment default)
    const results = await analyzeApp(numericAppId, aiProvider)
    
    console.log(`✅ App analysis completed for ID: ${numericAppId}`)
    res.json(results)
    
  } catch (error) {
    console.error('❌ App analysis failed:', error)
    
    // Handle specific error types
    if (error.message.includes('App not found')) {
      return res.status(404).json({ 
        error: 'App not found',
        message: 'The specified app ID was not found in the App Store' 
      })
    }
    
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'AI provider API key is missing or invalid' 
      })
    }
    
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during analysis'
    })
  }
})

// Analyze keywords endpoint
app.post('/api/analyze-keywords', async (req, res) => {
  try {
    const { keywords } = req.body
    
    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'keywords array is required and must not be empty' 
      })
    }
    
    const validKeywords = keywords.filter(k => k && k.trim())
    if (validKeywords.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid keywords',
        message: 'At least one valid keyword is required' 
      })
    }
    
    if (validKeywords.length > 20) {
      return res.status(400).json({ 
        error: 'Too many keywords',
        message: 'Maximum 20 keywords allowed per request' 
      })
    }
    
    console.log(`🔍 Starting keyword analysis for ${validKeywords.length} keywords`)
    
    // Use ASO analyzer for keyword analysis
    const asoAnalyzer = new ASOAnalyzer('itunes')
    const results = []
    
    for (const keyword of validKeywords) {
      try {
        const analysis = await asoAnalyzer.analyzeKeyword(keyword)
        results.push({
          keyword,
          traffic: analysis.trafficScore,
          difficulty: analysis.difficultyScore,
          competitionLevel: analysis.competitionLevel,
          recommendation: analysis.recommendation,
          volume: Math.floor(Math.random() * 10000) + 1000, // Mock volume data
          trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend data
        })
      } catch (error) {
        console.warn(`⚠️ Failed to analyze keyword "${keyword}": ${error.message}`)
        // Add failed keyword with default values
        results.push({
          keyword,
          traffic: 0,
          difficulty: 0,
          competitionLevel: 'unknown',
          recommendation: 'analysis_failed',
          volume: 0,
          trend: 'neutral',
          error: error.message
        })
      }
    }
    
    console.log(`✅ Keyword analysis completed for ${validKeywords.length} keywords`)
    res.json(results)
    
  } catch (error) {
    console.error('❌ Keyword analysis failed:', error)
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during keyword analysis'
    })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ASO Analyzer API Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📱 App analysis: POST http://localhost:${PORT}/api/analyze-app`)
  console.log(`🔍 Keyword analysis: POST http://localhost:${PORT}/api/analyze-keywords`)
})

module.exports = app