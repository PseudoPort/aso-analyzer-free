#!/usr/bin/env node

/**
 * Setup verification script for ASO Analyzer Free
 * Checks all dependencies and configuration
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 ASO Analyzer Free - Setup Verification')
console.log('==========================================\n')

const checks = []

function addCheck(name, status, message, fix = null) {
  checks.push({ name, status, message, fix })
  const icon = status ? '✅' : '❌'
  console.log(`${icon} ${name}: ${message}`)
  if (!status && fix) {
    console.log(`   💡 Fix: ${fix}`)
  }
}

// Check Node.js version
function checkNodeVersion() {
  const version = process.version
  const majorVersion = parseInt(version.slice(1).split('.')[0])
  const isValid = majorVersion >= 18
  
  addCheck(
    'Node.js Version',
    isValid,
    `${version} ${isValid ? '(✓ Compatible)' : '(✗ Requires v18+)'}`,
    isValid ? null : 'Install Node.js v18 or higher from https://nodejs.org'
  )
}

// Check if package.json exists and has required scripts
function checkPackageJson() {
  try {
    const packagePath = path.join(__dirname, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    
    const requiredScripts = ['start', 'api', 'dev', 'build', 'demo']
    const hasAllScripts = requiredScripts.every(script => packageJson.scripts[script])
    
    addCheck(
      'Package.json Scripts',
      hasAllScripts,
      hasAllScripts ? 'All required scripts present' : 'Missing required scripts',
      hasAllScripts ? null : 'Run: git pull to get latest package.json'
    )
    
    // Check dependencies
    const requiredDeps = ['express', 'cors', '@anthropic-ai/sdk', '@google/generative-ai']
    const installedDeps = Object.keys(packageJson.dependencies || {})
    const hasAllDeps = requiredDeps.every(dep => installedDeps.includes(dep))
    
    addCheck(
      'Backend Dependencies',
      hasAllDeps,
      hasAllDeps ? 'All backend dependencies listed' : 'Missing backend dependencies',
      hasAllDeps ? null : 'Run: npm install'
    )
    
  } catch (error) {
    addCheck('Package.json', false, 'File not found or invalid', 'Check if you\'re in the correct directory')
  }
}

// Check frontend setup
function checkFrontend() {
  const frontendPath = path.join(__dirname, 'frontend')
  const frontendExists = fs.existsSync(frontendPath)
  
  addCheck(
    'Frontend Directory',
    frontendExists,
    frontendExists ? 'Frontend directory exists' : 'Frontend directory missing',
    frontendExists ? null : 'Frontend setup incomplete'
  )
  
  if (frontendExists) {
    const frontendPackagePath = path.join(frontendPath, 'package.json')
    const frontendPackageExists = fs.existsSync(frontendPackagePath)
    
    addCheck(
      'Frontend Package.json',
      frontendPackageExists,
      frontendPackageExists ? 'Frontend package.json exists' : 'Frontend package.json missing',
      frontendPackageExists ? null : 'Run: cd frontend && npm install'
    )
    
    if (frontendPackageExists) {
      try {
        const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'))
        const hasReact = frontendPackage.dependencies && frontendPackage.dependencies.react
        
        addCheck(
          'Frontend Dependencies',
          !!hasReact,
          hasReact ? 'React and dependencies configured' : 'Frontend dependencies missing',
          hasReact ? null : 'Run: cd frontend && npm install'
        )
      } catch (error) {
        addCheck('Frontend Package.json', false, 'Invalid JSON', 'Check frontend/package.json syntax')
      }
    }
  }
}

// Check environment configuration
function checkEnvironment() {
  const envPath = path.join(__dirname, '.env')
  const envExamplePath = path.join(__dirname, '.env.example')
  
  const envExists = fs.existsSync(envPath)
  const envExampleExists = fs.existsSync(envExamplePath)
  
  addCheck(
    '.env.example',
    envExampleExists,
    envExampleExists ? 'Environment template exists' : 'Environment template missing',
    envExampleExists ? null : 'Template should be created automatically'
  )
  
  addCheck(
    '.env file',
    envExists,
    envExists ? 'Environment file exists' : 'Environment file missing',
    envExists ? null : 'Run: cp .env.example .env and add your API keys'
  )
  
  if (envExists) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8')
      const hasGeminiKey = envContent.includes('GEMINI_API_KEY=') && !envContent.includes('your_gemini_api_key_here')
      const hasClaudeKey = envContent.includes('ANTHROPIC_API_KEY=') && !envContent.includes('your_anthropic_api_key_here')
      
      addCheck(
        'API Keys Configuration',
        hasGeminiKey || hasClaudeKey,
        hasGeminiKey || hasClaudeKey ? 'At least one API key configured' : 'No API keys configured',
        hasGeminiKey || hasClaudeKey ? null : 'Add your Gemini or Claude API key to .env file'
      )
    } catch (error) {
      addCheck('Environment File', false, 'Cannot read .env file', 'Check file permissions')
    }
  }
}

// Check project structure
function checkProjectStructure() {
  const requiredDirs = ['services', 'tools', 'services/ai-providers']
  const requiredFiles = ['main.js', 'api-server.js', 'ARCHITECTURE.md']
  
  const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(__dirname, dir)))
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)))
  
  addCheck(
    'Project Structure',
    missingDirs.length === 0 && missingFiles.length === 0,
    missingDirs.length === 0 && missingFiles.length === 0 ? 'All required files and directories present' : `Missing: ${[...missingDirs, ...missingFiles].join(', ')}`,
    missingDirs.length === 0 && missingFiles.length === 0 ? null : 'Ensure you have the complete project files'
  )
}

// Check if node_modules exists
function checkNodeModules() {
  const nodeModulesPath = path.join(__dirname, 'node_modules')
  const nodeModulesExists = fs.existsSync(nodeModulesPath)
  
  addCheck(
    'Backend Node Modules',
    nodeModulesExists,
    nodeModulesExists ? 'Backend dependencies installed' : 'Backend dependencies not installed',
    nodeModulesExists ? null : 'Run: npm install'
  )
  
  const frontendNodeModulesPath = path.join(__dirname, 'frontend', 'node_modules')
  const frontendNodeModulesExists = fs.existsSync(frontendNodeModulesPath)
  
  addCheck(
    'Frontend Node Modules',
    frontendNodeModulesExists,
    frontendNodeModulesExists ? 'Frontend dependencies installed' : 'Frontend dependencies not installed',
    frontendNodeModulesExists ? null : 'Run: cd frontend && npm install'
  )
}

async function runAllChecks() {
  console.log('Running comprehensive setup verification...\n')
  
  checkNodeVersion()
  checkPackageJson()
  checkFrontend()
  checkEnvironment()
  checkProjectStructure()
  checkNodeModules()
  
  console.log('\n📊 Summary')
  console.log('===========')
  
  const passed = checks.filter(check => check.status).length
  const total = checks.length
  const percentage = Math.round((passed / total) * 100)
  
  console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`)
  
  if (percentage === 100) {
    console.log('\n🎉 Perfect! Your setup is complete and ready to go!')
    console.log('\n🚀 Next steps:')
    console.log('1. npm run demo     - Run the demo script')
    console.log('2. npm run dev      - Start development environment')
    console.log('3. Open http://localhost:5173 for the web interface')
  } else if (percentage >= 80) {
    console.log('\n✨ Almost there! Just a few more steps to complete setup.')
    console.log('\n🔧 Priority fixes:')
    checks.filter(check => !check.status && check.fix).forEach(check => {
      console.log(`   • ${check.name}: ${check.fix}`)
    })
  } else {
    console.log('\n⚠️  Setup needs attention. Please address the issues above.')
    console.log('\n📚 Resources:')
    console.log('   • README.md - Complete setup guide')
    console.log('   • .env.example - Environment configuration template')
    console.log('   • DEPLOYMENT.md - Deployment instructions')
  }
  
  console.log('\n💡 Need help? Check the documentation or create an issue on GitHub.')
}

// Handle command line execution
if (require.main === module) {
  runAllChecks().catch(error => {
    console.error('❌ Setup check failed:', error)
    process.exit(1)
  })
}

module.exports = { runAllChecks }