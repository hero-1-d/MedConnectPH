import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { formatDate } from '../../utils/helpers.js'

const MoodChart = ({ data, type = 'line' }) => {
  const chartData = data.map(log => ({
    date: formatDate(log.createdAt, { month: 'short', day: 'numeric' }),
    score: log.score || 3,
    mood: log.mood,
    fullDate: formatDate(log.createdAt),
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-soft-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].payload.fullDate}</p>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Mood Score: {payload[0].value}/5
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {payload[0].payload.mood}
          </p>
        </div>
      )
    }
    return null
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis domain={[1, 5]} stroke="#9ca3af" fontSize={12} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#moodGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
        <YAxis domain={[1, 5]} stroke="#9ca3af" fontSize={12} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#6366f1' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MoodChart
