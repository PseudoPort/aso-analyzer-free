import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react'
import { getConfiguration } from '../services/api'

const ConfigurationDisplay = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchConfiguration = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await getConfiguration()
      setConfig(response.configuration)
    } catch (err) {
      setError(err.message || 'Failed to fetch configuration')
      // Fallback to mock config for demo
      setConfig({
        AI_PROVIDER: 'gemini',
        AI_MODEL_GEMINI: 'gemini-2.5-pro',
        AI_MODEL_CLAUDE: 'not set (default: claude-sonnet-4-20250514)',
        AI_TEMPERATURE: 'not set (default: 0.3)',
        AI_MAX_TOKENS: 'not set (default: 2000)',
        GEMINI_API_KEY: 'set',
        ANTHROPIC_API_KEY: 'not set'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchConfiguration()
    }
  }, [isOpen])

  if (!isOpen) return null

  const getStatusIcon = (value) => {
    if (value === 'set' || (value && !value.includes('not set'))) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-gray-400" />
  }

  const getValueDisplay = (key, value) => {
    if (key.includes('API_KEY')) {
      return value === 'set' ? '••••••••••••' : 'Not configured'
    }
    return value
  }

  const configSections = [
    {
      title: 'Provider Configuration',
      items: [
        { key: 'AI_PROVIDER', label: 'Default AI Provider', value: config?.AI_PROVIDER },
        { key: 'GEMINI_API_KEY', label: 'Gemini API Key', value: config?.GEMINI_API_KEY },
        { key: 'ANTHROPIC_API_KEY', label: 'Claude API Key', value: config?.ANTHROPIC_API_KEY }
      ]
    },
    {
      title: 'Model Configuration',
      items: [
        { key: 'AI_MODEL_GEMINI', label: 'Gemini Model', value: config?.AI_MODEL_GEMINI },
        { key: 'AI_MODEL_CLAUDE', label: 'Claude Model', value: config?.AI_MODEL_CLAUDE }
      ]
    },
    {
      title: 'Generation Parameters',
      items: [
        { key: 'AI_TEMPERATURE', label: 'Temperature', value: config?.AI_TEMPERATURE },
        { key: 'AI_MAX_TOKENS', label: 'Max Tokens', value: config?.AI_MAX_TOKENS }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Current Configuration</h2>
                <p className="text-sm text-gray-600">Environment variables and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchConfiguration}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800 text-sm">
                  Could not fetch live configuration. Showing demo data.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-600">Loading configuration...</span>
            </div>
          ) : config ? (
            <div className="space-y-6">
              {configSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.value)}
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-mono">
                          {getValueDisplay(item.key, item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How to Modify Configuration</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>1. Edit your <code className="bg-blue-100 px-1 rounded">.env</code> file</p>
                  <p>2. Restart the application</p>
                  <p>3. Refresh this dialog to see changes</p>
                </div>
              </div>

              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Available Options</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p><code className="bg-green-100 px-1 rounded">AI_MODEL_GEMINI</code> - Specific Gemini model</p>
                  <p><code className="bg-green-100 px-1 rounded">AI_MODEL_CLAUDE</code> - Specific Claude model</p>
                  <p><code className="bg-green-100 px-1 rounded">AI_TEMPERATURE</code> - Creativity level (0.0-2.0)</p>
                  <p><code className="bg-green-100 px-1 rounded">AI_MAX_TOKENS</code> - Response length (100-100000)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No configuration data available
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ConfigurationDisplay