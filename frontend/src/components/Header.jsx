import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Github, ExternalLink, Settings } from 'lucide-react'
import ConfigurationDisplay from './ConfigurationDisplay'

const Header = () => {
  const [showConfig, setShowConfig] = useState(false)

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-linear-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ASO Analyzer Free</h1>
              <p className="text-sm text-gray-600">App Store Optimization Tools</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConfig(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="View Configuration"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Config</span>
            </button>
            <a
              href="https://github.com/PseudoPort/aso-analyzer-free"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="hidden sm:inline">Docs</span>
            </a>
          </div>
        </div>
      </div>
    </motion.header>

    <ConfigurationDisplay 
      isOpen={showConfig} 
      onClose={() => setShowConfig(false)} 
    />
    </>
  )
}

export default Header