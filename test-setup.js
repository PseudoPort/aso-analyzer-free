#!/usr/bin/env node

/**
 * Test script to verify the AI provider setup
 * This script tests the provider factory without making actual API calls
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (error) {
  console.log('📝 Note: dotenv not installed, using system environment variables');
}

async function testProviderSetup() {
  console.log('🧪 Testing ASO Analyzer AI Provider Setup...\n');
  
  try {
    // Test imports
    console.log('📦 Testing imports...');
    const { AIProviderFactory } = require('./services/ai-providers/ai-provider-factory');
    console.log('✅ AI Provider Factory imported successfully');
    
    // Test provider validation
    console.log('\n🔍 Testing provider validation...');
    const availableProviders = AIProviderFactory.getAvailableProviders();
    console.log(`✅ Available providers: ${availableProviders.join(', ')}`);
    
    // Test environment provider detection
    console.log('\n🌍 Testing environment configuration...');
    const envProvider = AIProviderFactory.getProviderFromEnv();
    console.log(`✅ Environment provider: ${envProvider}`);
    
    // Test provider validation
    console.log('\n🔐 Testing provider configurations...');
    
    for (const provider of availableProviders) {
      const validation = AIProviderFactory.validateProviderConfig(provider);
      const status = validation.success ? '✅' : '❌';
      console.log(`${status} ${provider}: ${validation.message}`);
    }
    
    // Test provider creation (without API calls)
    console.log('\n🏭 Testing provider creation...');
    
    for (const provider of availableProviders) {
      try {
        const validation = AIProviderFactory.validateProviderConfig(provider);
        if (validation.success) {
          const providerInstance = AIProviderFactory.createProvider(provider);
          console.log(`✅ ${provider} provider created successfully`);
          console.log(`   Provider name: ${providerInstance.getProviderName()}`);
          console.log(`   Config valid: ${providerInstance.validateConfig()}`);
        } else {
          console.log(`⏭️  ${provider} provider skipped (missing API key)`);
        }
      } catch (error) {
        console.log(`❌ ${provider} provider creation failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Provider setup test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Copy .env.example to .env: cp .env.example .env');
    console.log('3. Edit .env file with your actual API keys');
    console.log('4. Run: node main.js <app_id>');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure all files are in place');
    console.log('2. Check for syntax errors');
    console.log('3. Verify Node.js version compatibility');
  }
}

// Run the test
testProviderSetup();