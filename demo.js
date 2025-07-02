#!/usr/bin/env node

/**
 * Demo script for ASO Analyzer Free
 * Tests both CLI and API functionality
 */

const { analyzeApp } = require('./main')
const axios = require('axios')

const DEMO_APP_ID = '310633997' // WhatsApp
const API_BASE_URL = 'http://localhost:3000/api'

console.log('🎬 ASO Analyzer Free - Demo Script')
console.log('=====================================\n')

async function testCLI() {
  console.log('📱 Testing CLI Interface...')
  console.log(`Analyzing app ID: ${DEMO_APP_ID}`)
  
  try {
    const results = await analyzeApp(DEMO_APP_ID)
    console.log('✅ CLI Analysis completed successfully!')
    console.log(`📊 Generated ${results.allKeywords.length} keywords`)
    console.log(`🔍 Analyzed ${results.keywordAnalysis.length} keywords for ASO metrics`)
    return true
  } catch (error) {
    console.log('❌ CLI Analysis failed:', error.message)
    return false
  }
}

async function testAPI() {
  console.log('\n🌐 Testing API Interface...')
  
  try {
    // Test health endpoint
    console.log('🏥 Testing health endpoint...')
    const healthResponse = await axios.get(`${API_BASE_URL}/health`)
    console.log('✅ Health check passed:', healthResponse.data.status)
    
    // Test providers endpoint
    console.log('🤖 Testing providers endpoint...')
    const providersResponse = await axios.get(`${API_BASE_URL}/providers`)
    console.log('✅ Providers endpoint working')
    console.log(`📋 Available providers: ${providersResponse.data.providers.map(p => p.id).join(', ')}`)
    
    // Test app analysis endpoint
    console.log('📱 Testing app analysis endpoint...')
    const analysisResponse = await axios.post(`${API_BASE_URL}/analyze-app`, {
      appId: DEMO_APP_ID,
      aiProvider: 'gemini'
    })
    console.log('✅ App analysis API working!')
    console.log(`📊 Generated ${analysisResponse.data.allKeywords.length} keywords via API`)
    
    // Test keyword analysis endpoint
    console.log('🔍 Testing keyword analysis endpoint...')
    const keywordResponse = await axios.post(`${API_BASE_URL}/analyze-keywords`, {
      keywords: ['messaging', 'chat', 'communication']
    })
    console.log('✅ Keyword analysis API working!')
    console.log(`📈 Analyzed ${keywordResponse.data.length} keywords`)
    
    return true
  } catch (error) {
    console.log('❌ API test failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tip: Make sure to start the API server with: npm run api')
    }
    return false
  }
}

async function runDemo() {
  console.log('🚀 Starting comprehensive demo...\n')
  
  // Test CLI
  const cliSuccess = await testCLI()
  
  // Test API
  const apiSuccess = await testAPI()
  
  // Summary
  console.log('\n📋 Demo Summary')
  console.log('================')
  console.log(`CLI Interface: ${cliSuccess ? '✅ Working' : '❌ Failed'}`)
  console.log(`API Interface: ${apiSuccess ? '✅ Working' : '❌ Failed'}`)
  
  if (cliSuccess && apiSuccess) {
    console.log('\n🎉 All systems working! Ready for production.')
    console.log('\n🌐 Next steps:')
    console.log('1. Start the full development environment: npm run dev')
    console.log('2. Open http://localhost:5173 for the web interface')
    console.log('3. Deploy to production using DEPLOYMENT.md guide')
  } else {
    console.log('\n⚠️  Some issues detected. Check the error messages above.')
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure all dependencies are installed: npm install')
    console.log('2. Check your .env file has the required API keys')
    console.log('3. For API tests, start the server: npm run api')
  }
  
  console.log('\n📚 Documentation:')
  console.log('- README.md - Complete usage guide')
  console.log('- ARCHITECTURE.md - Technical architecture')
  console.log('- DEPLOYMENT.md - Deployment instructions')
  console.log('- frontend/README.md - Frontend-specific docs')
}

// Handle command line execution
if (require.main === module) {
  runDemo().catch(error => {
    console.error('❌ Demo failed:', error)
    process.exit(1)
  })
}

module.exports = { testCLI, testAPI, runDemo }