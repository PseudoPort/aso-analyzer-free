import { motion } from 'framer-motion'
import { Heart, Github, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-white border-t border-gray-200 mt-16"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">ASO Analyzer Free</h3>
            <p className="text-gray-600 text-sm">
              Open-source App Store Optimization tools with AI-powered keyword generation 
              and comprehensive ASO analysis.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI-powered keyword generation</li>
              <li>• App Store data analysis</li>
              <li>• Traffic & difficulty metrics</li>
              <li>• Multiple AI providers</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Links</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/PseudoPort/aso-analyzer-free"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Documentation</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 ASO Analyzer Free. Open source under MIT License.
          </p>
          <div className="flex items-center space-x-1 text-gray-600 text-sm mt-4 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for the developer community</span>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer