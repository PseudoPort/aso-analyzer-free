import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3,
  Users,
  Star
} from 'lucide-react'

const StatsCards = ({ results }) => {
  const stats = [
    {
      title: 'Total Keywords',
      value: results.allKeywords.length,
      icon: Target,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Avg Traffic Score',
      value: Math.round(results.keywordAnalysis.reduce((acc, k) => acc + k.traffic, 0) / results.keywordAnalysis.length),
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Avg Difficulty',
      value: Math.round(results.keywordAnalysis.reduce((acc, k) => acc + k.difficulty, 0) / results.keywordAnalysis.length),
      icon: BarChart3,
      color: 'bg-orange-500',
      change: '-5%',
      changeType: 'negative'
    },
    {
      title: 'Similar Apps',
      value: results.similarApps.length,
      icon: Users,
      color: 'bg-purple-500',
      change: 'New',
      changeType: 'neutral'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last analysis</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StatsCards