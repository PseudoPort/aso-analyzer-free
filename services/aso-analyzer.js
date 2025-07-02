const { ASO } = require('aso-v2');

/**
 * ASO keyword analysis service using aso-v2
 */
class ASOAnalyzer {
  constructor(platform = 'gplay') {
    // Initialize ASO for specified platform ('gplay' or 'itunes')
    this.aso = new ASO(platform);
    this.platform = platform;
  }

  /**
   * Analyzes a single keyword for traffic and difficulty scores
   * @param {string} keyword - The keyword to analyze
   * @returns {Promise<Object>} Analysis results with traffic and difficulty scores
   */
  async analyzeKeyword(keyword) {
    try {
      console.log(`Analyzing keyword: "${keyword}" on ${this.platform}...`);
      
      // Get keyword analysis from ASO-V2
      const analysis = await this.aso.analyzeKeyword(keyword);
      
      // Extract scores from the correct properties
      const trafficScore = analysis.traffic?.score || 0;
      const difficultyScore = analysis.difficulty?.score || 0;
      
      // Convert to 0-100 scale (ASO-V2 seems to use 0-10 scale)
      const trafficScore100 = Math.round(trafficScore * 10);
      const difficultyScore100 = Math.round(difficultyScore * 10);
      
      return {
        keyword: keyword,
        platform: this.platform,
        trafficScore: trafficScore100,
        difficultyScore: difficultyScore100,
        competitionLevel: this.getCompetitionLevel(difficultyScore100),
        trafficLevel: this.getTrafficLevel(trafficScore100),
        recommendation: this.getRecommendation(trafficScore100, difficultyScore100),
        rawData: analysis,
        // Include detailed breakdown
        details: {
          traffic: {
            original: trafficScore,
            scaled: trafficScore100,
            breakdown: analysis.traffic
          },
          difficulty: {
            original: difficultyScore,
            scaled: difficultyScore100,
            breakdown: analysis.difficulty
          }
        }
      };
      
    } catch (error) {
      console.error(`Error analyzing keyword "${keyword}":`, error.message);
      return {
        keyword: keyword,
        platform: this.platform,
        trafficScore: 0,
        difficultyScore: 0,
        competitionLevel: 'unknown',
        trafficLevel: 'unknown',
        recommendation: 'analysis_failed',
        error: error.message
      };
    }
  }

  /**
   * Analyzes multiple keywords in batch
   * @param {Array<string>} keywords - Array of keywords to analyze
   * @returns {Promise<Array<Object>>} Array of analysis results
   */
  async analyzeKeywords(keywords) {
    console.log(`Analyzing ${keywords.length} keywords on ${this.platform}...`);
    
    const results = [];
    
    // Process keywords with delay to avoid rate limiting
    for (const keyword of keywords) {
      const analysis = await this.analyzeKeyword(keyword);
      results.push(analysis);
      
      // Add small delay between requests
      await this.delay(500);
    }
    
    return results;
  }

  /**
   * Gets human-readable competition level
   * @param {number} difficultyScore - Difficulty score (0-100)
   * @returns {string} Competition level description
   */
  getCompetitionLevel(difficultyScore) {
    if (difficultyScore >= 80) return 'very_high';
    if (difficultyScore >= 60) return 'high';
    if (difficultyScore >= 40) return 'medium';
    if (difficultyScore >= 20) return 'low';
    return 'very_low';
  }

  /**
   * Gets human-readable traffic level
   * @param {number} trafficScore - Traffic score (0-100)
   * @returns {string} Traffic level description
   */
  getTrafficLevel(trafficScore) {
    if (trafficScore >= 80) return 'very_high';
    if (trafficScore >= 60) return 'high';
    if (trafficScore >= 40) return 'medium';
    if (trafficScore >= 20) return 'low';
    return 'very_low';
  }

  /**
   * Provides keyword recommendation based on traffic and difficulty
   * @param {number} trafficScore - Traffic score (0-100)
   * @param {number} difficultyScore - Difficulty score (0-100)
   * @returns {string} Recommendation
   */
  getRecommendation(trafficScore, difficultyScore) {
    // High traffic, low difficulty = excellent
    if (trafficScore >= 60 && difficultyScore <= 40) return 'excellent';
    
    // Medium traffic, low difficulty = good
    if (trafficScore >= 40 && difficultyScore <= 50) return 'good';
    
    // High traffic, high difficulty = challenging
    if (trafficScore >= 60 && difficultyScore >= 70) return 'challenging';
    
    // Low traffic, high difficulty = avoid
    if (trafficScore <= 30 && difficultyScore >= 60) return 'avoid';
    
    // Medium values = consider
    return 'consider';
  }

  /**
   * Utility function to add delay between requests
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Analyzes keyword opportunities by finding the best keywords from a list
   * @param {Array<string>} keywords - Keywords to analyze
   * @param {number} topN - Number of top keywords to return (default: 10)
   * @returns {Promise<Object>} Analysis summary with top keywords
   */
  async findKeywordOpportunities(keywords, topN = 10) {
    const analyses = await this.analyzeKeywords(keywords);
    
    // Sort by recommendation score (excellent > good > consider > challenging > avoid)
    const recommendationOrder = { excellent: 5, good: 4, consider: 3, challenging: 2, avoid: 1, analysis_failed: 0 };
    
    const sortedKeywords = analyses.sort((a, b) => {
      // First sort by recommendation
      const recDiff = recommendationOrder[b.recommendation] - recommendationOrder[a.recommendation];
      if (recDiff !== 0) return recDiff;
      
      // Then by traffic score
      const trafficDiff = b.trafficScore - a.trafficScore;
      if (trafficDiff !== 0) return trafficDiff;
      
      // Finally by inverse difficulty (lower is better)
      return a.difficultyScore - b.difficultyScore;
    });
    
    return {
      platform: this.platform,
      totalAnalyzed: analyses.length,
      topOpportunities: sortedKeywords.slice(0, topN),
      summary: {
        excellent: analyses.filter(a => a.recommendation === 'excellent').length,
        good: analyses.filter(a => a.recommendation === 'good').length,
        consider: analyses.filter(a => a.recommendation === 'consider').length,
        challenging: analyses.filter(a => a.recommendation === 'challenging').length,
        avoid: analyses.filter(a => a.recommendation === 'avoid').length,
        failed: analyses.filter(a => a.recommendation === 'analysis_failed').length
      }
    };
  }
}

module.exports = {
  ASOAnalyzer
};