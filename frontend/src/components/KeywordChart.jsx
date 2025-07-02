import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts'

const KeywordChart = ({ data }) => {
  const getColor = (traffic, difficulty) => {
    if (traffic > 70 && difficulty < 50) return '#10b981' // Green - Excellent
    if (traffic > 50 && difficulty < 70) return '#3b82f6' // Blue - Good
    if (traffic > 30 || difficulty < 80) return '#f59e0b' // Yellow - Consider
    return '#ef4444' // Red - Challenging
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.keyword}</p>
          <p className="text-sm text-gray-600">Traffic: {data.traffic}</p>
          <p className="text-sm text-gray-600">Difficulty: {data.difficulty}</p>
          <p className="text-sm text-gray-600">Volume: {data.volume?.toLocaleString()}</p>
          <p className={`text-sm font-medium capitalize ${
            data.recommendation === 'excellent' ? 'text-green-600' :
            data.recommendation === 'good' ? 'text-blue-600' :
            data.recommendation === 'consider' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {data.recommendation}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="traffic" 
            name="Traffic Score"
            domain={[0, 100]}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            type="number" 
            dataKey="difficulty" 
            name="Difficulty Score"
            domain={[0, 100]}
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter 
            name="Keywords" 
            data={data} 
            fill="#3b82f6"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.traffic, entry.difficulty)} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Excellent (High Traffic, Low Difficulty)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Good</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Consider</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Challenging</span>
        </div>
      </div>
    </div>
  )
}

export default KeywordChart