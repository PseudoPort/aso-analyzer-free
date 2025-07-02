import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Tag, 
  TrendingUp, 
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'

const ResultsDisplay = ({ results }) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false)

  const copyKeywords = () => {
    navigator.clipboard.writeText(results.allKeywords.join(', '))
    setCopiedKeywords(true)
    setTimeout(() => setCopiedKeywords(false), 2000)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-8">
      {/* App Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">App Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-2">{results.appData.title}</h4>
            <p className="text-gray-600 mb-4">{results.appData.description}</p>
            <div className="flex flex-wrap gap-2">
              {results.appData.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Similar Apps Analyzed</h5>
            <div className="space-y-2">
              {results.similarApps.map((app, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{app.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keywords Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Generated Keywords</h3>
          </div>
          <button
            onClick={copyKeywords}
            className="btn-secondary text-sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedKeywords ? 'Copied!' : 'Copy All'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Main App Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {results.mainAppKeywords.map((keyword, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Similar Apps Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {results.similarAppKeywords.slice(0, 10).map((keyword, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
              {results.similarAppKeywords.length > 10 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{results.similarAppKeywords.length - 10} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ASO Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">ASO Analysis</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Keyword</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Traffic Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Difficulty Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {results.keywordAnalysis.map((analysis, index) => (
                <motion.tr
                  key={analysis.keyword}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">{analysis.keyword}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${analysis.traffic}%` }}
                        ></div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(analysis.traffic)}`}>
                        {analysis.traffic}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${analysis.difficulty}%` }}
                        ></div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(100 - analysis.difficulty)}`}>
                        {analysis.difficulty}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`h-4 w-4 ${
                        analysis.traffic > analysis.difficulty ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        analysis.traffic > analysis.difficulty ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {analysis.traffic > analysis.difficulty ? 'Good' : 'Challenging'}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsDisplay