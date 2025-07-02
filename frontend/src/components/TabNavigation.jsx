import { motion } from 'framer-motion'
import { Smartphone, Search } from 'lucide-react'

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="h-5 w-5" />
      case 'search':
        return <Search className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 min-w-[200px] ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-linear-to-r from-primary-600 to-primary-700 rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          <div className="relative flex items-center space-x-3">
            {getIcon(tab.icon)}
            <div className="text-left">
              <div className="font-semibold">{tab.name}</div>
              <div className={`text-sm ${activeTab === tab.id ? 'text-primary-100' : 'text-gray-500'}`}>
                {tab.description}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default TabNavigation