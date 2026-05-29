import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, CalendarDays, Activity, ArrowUp, ArrowDown,
  BarChart3, PieChart, LineChart, Download
} from 'lucide-react'
import {
  AppointmentStatusChart,
  WeeklyAppointmentsChart,
  TopCounselorsChart
} from '../../components/analytics/AnalyticsCharts.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { getAnalyticsData } from '../../services/firestoreService.js'
import { showToast } from '../../components/ui/Toast.jsx'

const AnalyticsPage = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalyticsData()
        setStats(data)
      } catch (error) {
        showToast.error(error.message || 'Failed to load analytics')
        setStats({})
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const statCards = [
    { label: 'Total Appointments', value: stats.totalAppointments, change: '+12%', icon: CalendarDays, trend: 'up' },
    { label: 'Active Students', value: stats.totalStudents, change: '+8%', icon: Users, trend: 'up' },
    { label: 'Completion Rate', value: '78%', change: '+5%', icon: Activity, trend: 'up' },
    { label: 'Avg Response Time', value: '2.4h', change: '-15%', icon: TrendingUp, trend: 'up' },
  ]

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="page-title">Analytics & Reports</h1>
                <p className="page-subtitle">Platform performance and insights</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="input px-4 py-2 text-sm"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 3 Months</option>
                  <option value="365">Last Year</option>
                </select>
                <button className="btn-outline text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="stat-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-wellness-600">
                    <ArrowUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Appointments</h2>
                  <p className="text-sm text-gray-500">Appointment volume by day of week</p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              {stats.weeklyData && <WeeklyAppointmentsChart data={stats.weeklyData} />}
            </motion.div>

            {/* Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Status</h2>
                  <p className="text-sm text-gray-500">Distribution by current status</p>
                </div>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              {stats.statusData && <AppointmentStatusChart data={stats.statusData} />}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top Counselors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Counselors</h2>
                  <p className="text-sm text-gray-500">Most booked counselors this period</p>
                </div>
                <LineChart className="w-5 h-5 text-gray-400" />
              </div>
              {stats.topCounselors && <TopCounselorsChart data={stats.topCounselors} />}
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Pending Appointments', value: stats.pendingAppointments, total: stats.totalAppointments, color: 'bg-yellow-500' },
                    { label: 'Approved', value: stats.approvedAppointments, total: stats.totalAppointments, color: 'bg-wellness-500' },
                    { label: 'Completed', value: stats.completedAppointments, total: stats.totalAppointments, color: 'bg-primary-500' },
                    { label: 'Cancelled', value: stats.cancelledAppointments, total: stats.totalAppointments, color: 'bg-gray-400' },
                  ].map((metric, index) => {
                    const percentage = metric.total > 0 ? Math.round((metric.value / metric.total) * 100) : 0
                    return (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{metric.value} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                            className={`h-full ${metric.color} rounded-full`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Student-to-Doctor Ratio</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalStudents}:{stats.totalDoctors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Appointments/Student</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.totalStudents > 0 ? (stats.totalAppointments / stats.totalStudents).toFixed(1) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                    <span className="text-sm font-medium text-wellness-600">
                      {stats.totalAppointments > 0 
                        ? Math.round(((stats.approvedAppointments + stats.completedAppointments) / stats.totalAppointments) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsPage
