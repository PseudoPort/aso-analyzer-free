import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Search, 
  Loader2, 
  Download, 
  BarChart3, 
  TrendingUp,
  Star,
  Users,
  Globe,
  Zap
} from 'lucide-react'
import ResultsDisplay from './ResultsDisplay'
import StatsCards from './StatsCards'
import { analyzeApp as analyzeAppAPI } from '../services/api'

const AppAnalyzer = () => {
  const [appId, setAppId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!appId.trim()) {
      setError('Please enter a valid App Store ID')
      return
    }

    setIsLoading(true)
    setError('')
    setResults(null)

    try {
      // Call the real API (AI provider is configured via environment variables)
      const results = await analyzeAppAPI(appId)
      setResults(results)
    } catch (err) {
      setError(err.message || 'Failed to analyze app. Please try again.')
      
      // Fallback to mock data for demo purposes
      console.warn('Using mock data for demo:', err.message)
      
      const mockResults = {
        appData: {
          title: 'Sample App (Demo)',
          description: 'A great mobile application for productivity and entertainment. This is demo data since the backend is not connected.',
          genres: ['Productivity', 'Business'],
          screenshots: []
        },
        similarApps: [
          { title: 'Similar App 1' },
          { title: 'Similar App 2' },
          { title: 'Similar App 3' }
        ],
        mainAppKeywords: [
          'productivity', 'business', 'mobile app', 'task manager', 'workflow',
          'efficiency', 'organization', 'planning', 'calendar', 'notes'
        ],
        similarAppKeywords: [
          'project management', 'team collaboration', 'time tracking', 'scheduling',
          'document sharing', 'communication', 'remote work', 'automation'
        ],
        allKeywords: [
          'productivity', 'business', 'mobile app', 'task manager', 'workflow',
          'efficiency', 'organization', 'planning', 'calendar', 'notes',
          'project management', 'team collaboration', 'time tracking', 'scheduling',
          'document sharing', 'communication', 'remote work', 'automation'
        ],
        keywordAnalysis: [
          { keyword: 'productivity', traffic: 85, difficulty: 72 },
          { keyword: 'task manager', traffic: 78, difficulty: 65 },
          { keyword: 'workflow', traffic: 69, difficulty: 58 },
          { keyword: 'business app', traffic: 82, difficulty: 74 },
          { keyword: 'organization', traffic: 71, difficulty: 61 }
        ]
      }
      
      setResults(mockResults)
      setError('') // Clear error since we're showing demo data
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aso-analysis-${appId}.json`
    link.click()
    URL.revokeObjectURL(url)
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
          <div className="bg-primary-100 p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">App Store Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Store ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="e.g., 1294015297"
                className="input-field"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the numeric App Store ID found in the app's URL
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
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !appId.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing App...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Analyze App
                </>
              )}
            </button>

            {results && (
              <button
                onClick={handleExport}
                className="btn-secondary"
              >
                <Download className="h-5 w-5" />
                Export Results
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {results && <StatsCards results={results} />}

      {/* Results Display */}
      {results && <ResultsDisplay results={results} />}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <div className="loading-spinner mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analyzing Your App
          </h3>
          <p className="text-gray-600">
            This may take a few moments while we gather data and generate insights...
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Globe, text: 'Fetching app data' },
              { icon: Zap, text: 'AI keyword generation' },
              { icon: BarChart3, text: 'ASO analysis' }
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

export default AppAnalyzer