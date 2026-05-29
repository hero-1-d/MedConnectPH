import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, CalendarDays, TrendingUp, Shield, Activity,
  ChevronRight, ArrowUp, ArrowDown, UserCheck, UserX
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppointmentStatusChart, WeeklyAppointmentsChart, TopCounselorsChart } from '../../components/analytics/AnalyticsCharts.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { getAnalyticsData, getDocuments } from '../../services/firestoreService.js'

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [analytics, appointments] = await Promise.all([
          getAnalyticsData(),
          getDocuments('appointments'),
        ])

        const statusCounts = ['pending', 'approved', 'completed', 'cancelled', 'rejected'].map(status => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: appointments.filter(a => a.status === status).length,
        }))

        setStats({
          ...analytics,
          weeklyData: [],
          statusData: statusCounts,
          topCounselors: [],
        })
      } finally {
      setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, change: '+12%', icon: Users, color: 'bg-primary-50 text-primary-600', trend: 'up' },
    { label: 'Total Appointments', value: stats.totalAppointments, change: '+8%', icon: CalendarDays, color: 'bg-wellness-50 text-wellness-600', trend: 'up' },
    { label: 'Active Students', value: stats.totalStudents, change: '+15%', icon: UserCheck, color: 'bg-secondary-50 text-secondary-600', trend: 'up' },
    { label: 'Active Doctors', value: stats.totalDoctors, change: '+2', icon: Shield, color: 'bg-accent-50 text-accent-600', trend: 'up' },
  ]

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Overview of platform activity and performance</p>
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
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-wellness-600' : 'text-crisis-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
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
                  <p className="text-sm text-gray-500">Appointment volume by day</p>
                </div>
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
                  <p className="text-sm text-gray-500">Distribution by status</p>
                </div>
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
                  <p className="text-sm text-gray-500">Most booked counselors this month</p>
                </div>
                <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {stats.topCounselors && <TopCounselorsChart data={stats.topCounselors} />}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Users className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</p>
                      <p className="text-xs text-gray-500">Add, edit, or remove users</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  <Link to="/admin/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <CalendarDays className="w-5 h-5 text-wellness-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">All Appointments</p>
                      <p className="text-xs text-gray-500">Monitor and manage bookings</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  <Link to="/admin/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Activity className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Detailed Analytics</p>
                      <p className="text-xs text-gray-500">View comprehensive reports</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New appointment booked', user: 'Alex Thompson', time: '2 min ago', icon: CalendarDays },
                    { action: 'Doctor profile updated', user: 'Dr. Sarah Johnson', time: '15 min ago', icon: UserCheck },
                    { action: 'Student registered', user: 'Jordan Lee', time: '1 hour ago', icon: Users },
                    { action: 'Appointment completed', user: 'Maria Garcia', time: '2 hours ago', icon: Activity },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.action}</p>
                        <p className="text-xs text-gray-400">{item.user} · {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
