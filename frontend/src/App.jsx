import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import AppAnalyzer from './components/AppAnalyzer'
import KeywordAnalyzer from './components/KeywordAnalyzer'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('app-analyzer')

  const tabs = [
    {
      id: 'app-analyzer',
      name: 'App Analyzer',
      description: 'Analyze app store data and generate keywords',
      icon: 'smartphone'
    },
    {
      id: 'keyword-analyzer',
      name: 'Keywords Analyzer',
      description: 'Analyze keyword traffic and difficulty',
      icon: 'search'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">ASO Analyzer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful App Store Optimization tools with AI-powered keyword generation 
            and comprehensive ASO analysis
          </p>
        </motion.div>

        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {activeTab === 'app-analyzer' && <AppAnalyzer />}
            {activeTab === 'keyword-analyzer' && <KeywordAnalyzer />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App