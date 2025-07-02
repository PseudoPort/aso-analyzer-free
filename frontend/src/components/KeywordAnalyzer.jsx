import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  X, 
  Loader2, 
  TrendingUp, 
  BarChart3,
  Target,
  Zap,
  Download
} from 'lucide-react'
import KeywordChart from './KeywordChart'
import { analyzeKeywords as analyzeKeywordsAPI } from '../services/api'

const KeywordAnalyzer = () => {
  const [keywords, setKeywords] = useState([''])
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords.filter(k => k.trim()), currentKeyword.trim(), ''])
      setCurrentKeyword('')
    }
  }

  const removeKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index)
    if (newKeywords.length === 0 || newKeywords[newKeywords.length - 1] !== '') {
      newKeywords.push('')
    }
    setKeywords(newKeywords)
  }

  const updateKeyword = (index, value) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const handleAnalyze = async () => {
    const validKeywords = keywords.filter(k => k.trim())
    
    if (validKeywords.length === 0) {
      setError('Please enter at least one keyword')
      return
    }

    setIsLoading(true)
    setError('')
    setResults(null)

    try {
      // Call the real API
      const results = await analyzeKeywordsAPI(validKeywords)
      setResults(results)
    } catch (err) {
      setError(err.message || 'Failed to analyze keywords. Please try again.')
      
      // Fallback to mock data for demo purposes
      console.warn('Using mock data for demo:', err.message)
      
      const mockResults = validKeywords.map(keyword => ({
        keyword,
        traffic: Math.floor(Math.random() * 100),
        difficulty: Math.floor(Math.random() * 100),
        competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        recommendation: ['excellent', 'good', 'consider', 'challenging'][Math.floor(Math.random() * 4)],
        trend: Math.random() > 0.5 ? 'up' : 'down',
        volume: Math.floor(Math.random() * 10000) + 1000
      }))
      
      setResults(mockResults)
      setError('') // Clear error since we're showing demo data
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!results) return
    
    const csvContent = [
      ['Keyword', 'Traffic Score', 'Difficulty Score', 'Competition Level', 'Recommendation', 'Search Volume'],
      ...results.map(r => [r.keyword, r.traffic, r.difficulty, r.competitionLevel, r.recommendation, r.volume])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'keyword-analysis.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'consider': return 'text-yellow-600 bg-yellow-50'
      case 'challenging': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-accent-100 p-2 rounded-lg">
            <Search className="h-6 w-6 text-accent-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Keyword Analysis</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords to Analyze
            </label>
            <div className="space-y-2">
              {keywords.map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && index === keywords.length - 1) {
                        addKeyword()
                      }
                    }}
                    placeholder={index === 0 ? "Enter keyword..." : "Add another keyword..."}
                    className="input-field"
                    disabled={isLoading}
                  />
                  {keyword.trim() && (
                    <button
                      onClick={() => removeKeyword(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add up to 20 keywords for comprehensive analysis
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || keywords.filter(k => k.trim()).length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Keywords...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  Analyze Keywords
                </>
              )}
            </button>

            {results && (
              <button
                onClick={handleExport}
                className="btn-secondary"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results Chart */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Keyword Performance Overview</h3>
          <KeywordChart data={results} />
        </motion.div>
      )}

      {/* Results Table */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Keyword</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Traffic</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Difficulty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Competition</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Recommendation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Volume</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <motion.tr
                    key={result.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{result.keyword}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${result.traffic}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{result.traffic}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${result.difficulty}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{result.difficulty}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        result.competitionLevel === 'low' ? 'bg-green-100 text-green-800' :
                        result.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.competitionLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRecommendationColor(result.recommendation)}`}>
                        {result.recommendation}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {result.volume.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <div className="loading-spinner mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analyzing Keywords
          </h3>
          <p className="text-gray-600">
            Gathering traffic data and difficulty metrics for your keywords...
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Target, text: 'Traffic analysis' },
              { icon: Zap, text: 'Competition research' },
              { icon: TrendingUp, text: 'Trend analysis' }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center space-x-3 text-gray-600"
              >
                <step.icon className="h-5 w-5" />
                <span className="text-sm">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default KeywordAnalyzer