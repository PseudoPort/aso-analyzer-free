import { motion } from 'framer-motion'
import { Zap, Brain, DollarSign } from 'lucide-react'

const AIProviderSelector = ({ value, onChange, disabled }) => {
  const providers = [
    {
      id: 'gemini',
      name: 'Gemini 2.5 Pro',
      description: 'Cost-effective, fast analysis',
      icon: Zap,
      badge: 'Default',
      badgeColor: 'bg-green-100 text-green-800',
      cost: 'Lower cost',
      features: ['Fast processing', 'Good accuracy', 'Cost-effective']
    },
    {
      id: 'claude',
      name: 'Claude Sonnet 4',
      description: 'Premium quality analysis',
      icon: Brain,
      badge: 'Premium',
      badgeColor: 'bg-purple-100 text-purple-800',
      cost: 'Higher cost',
      features: ['Highest accuracy', 'Deep analysis', 'Premium quality']
    }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        AI Provider
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
              value === provider.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onChange(provider.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  value === provider.id ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <provider.icon className={`h-5 w-5 ${
                    value === provider.id ? 'text-primary-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${provider.badgeColor}`}>
                {provider.badge}
              </span>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{provider.cost}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {provider.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {value === provider.id && (
              <motion.div
                layoutId="selectedProvider"
                className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AIProviderSelector