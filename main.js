// Conditional imports to allow help without dependencies
let getAppData, getSimilarApps, generateKeywords, ASOAnalyzer;

try {
  ({ getAppData, getSimilarApps } = require('./services/app-store-scraper'));
  ({ generateKeywords } = require('./services/keyword-generator'));
  ({ ASOAnalyzer } = require('./services/aso-analyzer'));
} catch (error) {
  // Dependencies not installed - only allow help command
  if (!process.argv.includes('--help') && !process.argv.includes('-h')) {
    console.error('❌ Dependencies not installed. Please run: npm install');
    process.exit(1);
  }
}

/**
 * Collects app data and similar apps, then logs the main app
 */
async function collectAppData(appId) {
  // Validate app ID is numeric
  const numericAppId = parseInt(appId, 10);
  if (isNaN(numericAppId) || numericAppId <= 0) {
    throw new Error('App ID must be a valid numeric value');
  }

  console.log(`🚀 Starting analysis for app ID: ${numericAppId}`);
  
  // Get app data from App Store
  const appData = await getAppData(numericAppId);

  // Get similar apps (limit to 3)
  const allSimilarApps = await getSimilarApps(numericAppId);
  const top3SimilarApps = allSimilarApps.slice(0, 3);

  // Scrape app data for top 3 similar apps
  const similarAppsData = [];
  for (const similarApp of top3SimilarApps) {
    try {
      const similarAppData = await getAppData(similarApp.id);
      similarAppsData.push(similarAppData);
    } catch (error) {
      console.warn(`⚠️ Failed to scrape data for similar app ${similarApp.id}: ${error.message}`);
    }
  }

  // Log the main app data
  console.log(`\n📋 Scraped App Data for ${appData.title}`);
  console.log(`📋 Also scraped data of ${similarAppsData.length} similar apps`);
  
  return { appData, similarApps: similarAppsData, numericAppId };
}

/**
 * Generates keywords for main app and similar apps
 */
async function generateAppKeywords(appData, similarApps, aiProvider = null) {
  console.log('\n🧠 Generating keywords for main app...');
  const mainAppKeywords = await generateKeywords(appData, aiProvider);
  
  console.log(`✅ Generated keywords for ${appData.title}:`);
  console.log(mainAppKeywords.keywords.join(', '));
  
  console.log('\n🧠 Generating keywords for similar apps...');
  const similarAppKeywords = [];
  for (const similarApp of similarApps) {
    try {
      const keywords = await generateKeywords(similarApp, aiProvider);
      similarAppKeywords.push(...keywords.keywords);
      console.log(`✅ Generated keywords for ${similarApp.title}:`);
      console.log(keywords.keywords.join(', '));
    } catch (error) {
      console.warn(`⚠️ Failed to generate keywords for ${similarApp.title}: ${error.message}`);
    }
  }
  
  return {
    mainAppKeywords: mainAppKeywords.keywords,
    similarAppKeywords: similarAppKeywords,
    allKeywords: [...mainAppKeywords.keywords, ...similarAppKeywords]
  };
}

/**
 * Analyzes 5 random keywords with ASO metrics
 */
async function analyzeRandomKeywords(allKeywords) {
  // Shuffle array and take 5 random keywords
  const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
  const random5Keywords = shuffled.slice(0, 5);
  
  console.log('\n📊 Analyzing 5 random keywords with ASO...');
  
  const asoAnalyzer = new ASOAnalyzer('itunes');
  const results = [];
  
  for (const keyword of random5Keywords) {
    try {
      const analysis = await asoAnalyzer.analyzeKeyword(keyword);
      results.push({
        keyword,
        traffic: analysis.trafficScore,
        difficulty: analysis.difficultyScore
      });
      console.log(`- ${keyword} | traffic: ${analysis.trafficScore} | difficulty: ${analysis.difficultyScore}`);
    } catch (error) {
      console.warn(`⚠️ Failed to analyze keyword "${keyword}": ${error.message}`);
    }
  }
  
  return results;
}

/**
 * Main entry function for app analysis
 * @param {string|number} appId - The app ID (must be numeric)
 * @param {string} aiProvider - AI provider to use ('claude' or 'gemini')
 */
async function analyzeApp(appId, aiProvider = null) {
  try {
    // Step 1: Collect app data and similar apps, then log
    const { appData, similarApps } = await collectAppData(appId);

    // Step 2: Generate keywords for main app and similar apps
    const { mainAppKeywords, similarAppKeywords, allKeywords } = await generateAppKeywords(appData, similarApps, aiProvider);

    // Step 3: Analyze 5 random keywords from all keywords with ASO
    const keywordAnalysis = await analyzeRandomKeywords(allKeywords);

    return {
      appData,
      similarApps,
      mainAppKeywords,
      similarAppKeywords,
      allKeywords,
      keywordAnalysis
    };

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    throw error;
  }
}

// Export for use in other modules
module.exports = {
  analyzeApp
};

// If run directly, get app ID from command line arguments
if (require.main === module) {
  let AIProviderFactory;
  
  try {
    ({ AIProviderFactory } = require('./services/ai-providers/ai-provider-factory'));
  } catch (error) {
    // Dependencies not installed - only allow help command
    if (!process.argv.includes('--help') && !process.argv.includes('-h')) {
      console.error('❌ Dependencies not installed. Please run: npm install');
      process.exit(1);
    }
  }
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  let appId = null;
  let aiProvider = null;
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--ai-provider' || arg === '-p') {
      aiProvider = args[i + 1];
      i++; // Skip next argument as it's the provider value
    } else if (arg === '--help' || arg === '-h') {
      console.log('ASO Analyzer Free - App Store Keyword Research & Analysis Tool');
      console.log('');
      console.log('Usage: node main.js <appId> [options]');
      console.log('');
      console.log('Arguments:');
      console.log('  appId                    App Store track ID (numeric)');
      console.log('');
      console.log('Options:');
      console.log('  --ai-provider, -p        AI provider to use (claude, gemini)');
      console.log('                           Default: gemini');
      console.log('  --config                 Show current configuration');
      console.log('  --help, -h               Show this help message');
      console.log('');
      console.log('Examples:');
      console.log('  node main.js 310633997                    # Use default provider (Gemini)');
      console.log('  node main.js 310633997 --ai-provider claude   # Use Claude');
      console.log('  node main.js 310633997 -p gemini              # Use Gemini explicitly');
      console.log('  node main.js --config                         # Show current configuration');
      console.log('');
      console.log('Environment Variables:');
      console.log('  AI_PROVIDER              Default AI provider (claude, gemini)');
      console.log('  GEMINI_API_KEY           Google Gemini API key (required for Gemini)');
      console.log('  ANTHROPIC_API_KEY        Anthropic API key (required for Claude)');
      console.log('');
      console.log('Advanced Configuration (Optional):');
      console.log('  AI_MODEL_GEMINI          Specific Gemini model (default: gemini-2.5-pro)');
      console.log('  AI_MODEL_CLAUDE          Specific Claude model (default: claude-sonnet-4-20250514)');
      console.log('  AI_TEMPERATURE           AI temperature 0-2 (default: 0.3)');
      console.log('  AI_MAX_TOKENS            Maximum tokens (default: 2000)');
      process.exit(0);
    } else if (arg === '--config') {
      AIProviderFactory.printEnvironmentConfig();
      process.exit(0);
    } else if (!appId && !arg.startsWith('-')) {
      appId = arg;
    }
  }
  
  if (!appId) {
    console.error('❌ Please provide an app ID as argument');
    console.log('Usage: node main.js <appId> [options]');
    console.log('Use --help for more information');
    process.exit(1);
  }
  
  // Validate AI provider if specified
  if (aiProvider && !AIProviderFactory.isValidProvider(aiProvider)) {
    console.error(`❌ Invalid AI provider: ${aiProvider}`);
    console.log(`Available providers: ${AIProviderFactory.getAvailableProviders().join(', ')}`);
    process.exit(1);
  }
  
  // Show configuration info
  const selectedProvider = aiProvider || AIProviderFactory.getProviderFromEnv();
  console.log(`🤖 AI Provider: ${selectedProvider.toUpperCase()}`);
  
  // Validate provider configuration
  const validation = AIProviderFactory.validateProviderConfig(selectedProvider);
  if (!validation.success) {
    console.error(`❌ ${validation.message}`);
    console.log('Please check your environment variables and try again.');
    process.exit(1);
  }

  analyzeApp(appId, aiProvider);
}