import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronRight,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppointmentStatusChart, WeeklyAppointmentsChart, TopCounselorsChart } from '../../components/analytics/AnalyticsCharts.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import { getAnalyticsData, getDocuments } from '../../services/firestoreService.js'

const formatRelativeTime = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'recently'

  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000))
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hr ago`

  const diffDays = Math.round(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

const buildRecentActivity = (appointments, users) => {
  const appointmentActivity = appointments.map((appointment) => ({
    action: `Appointment ${appointment.status || 'created'}`,
    user: `${appointment.studentName || 'Student'} with ${appointment.doctorName || 'Counselor'}`,
    time: formatRelativeTime(appointment.updatedAt || appointment.createdAt || appointment.date),
    sortDate: appointment.updatedAt || appointment.createdAt || appointment.date,
    icon: CalendarDays,
  }))

  const userActivity = users.map((user) => ({
    action: `${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'} registered`,
    user: user.name || user.email || 'New user',
    time: formatRelativeTime(user.createdAt),
    sortDate: user.createdAt,
    icon: Users,
  }))

  return [...appointmentActivity, ...userActivity]
    .sort((a, b) => {
      const dateA = a.sortDate instanceof Date ? a.sortDate : new Date(a.sortDate || 0)
      const dateB = b.sortDate instanceof Date ? b.sortDate : new Date(b.sortDate || 0)
      return dateB - dateA
    })
    .slice(0, 5)
}

const emptyStats = {
  totalUsers: 0,
  totalAppointments: 0,
  totalStudents: 0,
  totalDoctors: 0,
  pendingAppointments: 0,
  completedAppointments: 0,
  weeklyData: [],
  statusData: [],
  topCounselors: [],
  recentActivity: [],
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [analytics, appointments, users] = await Promise.all([
          getAnalyticsData(),
          getDocuments('appointments'),
          getDocuments('users'),
        ])

        setStats({
          ...emptyStats,
          ...analytics,
          recentActivity: buildRecentActivity(appointments, users),
        })
      } catch (error) {
        showToast.error(error.message || 'Failed to load admin dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, change: `${stats.totalStudents} students`, icon: Users, color: 'bg-primary-50 text-primary-600', trend: 'up' },
    { label: 'Appointments', value: stats.totalAppointments, change: `${stats.pendingAppointments} pending`, icon: CalendarDays, color: 'bg-wellness-50 text-wellness-600', trend: stats.pendingAppointments > 0 ? 'down' : 'up' },
    { label: 'Completed', value: stats.completedAppointments, change: 'sessions done', icon: UserCheck, color: 'bg-secondary-50 text-secondary-600', trend: 'up' },
    { label: 'Doctors', value: stats.totalDoctors, change: 'active roster', icon: Shield, color: 'bg-accent-50 text-accent-600', trend: 'up' },
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
                <div className="stat-value">{loading ? '...' : stat.value ?? 0}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Appointments</h2>
                  <p className="text-sm text-gray-500">Appointment volume by day</p>
                </div>
              </div>
              {stats.weeklyData?.length ? (
                <WeeklyAppointmentsChart data={stats.weeklyData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No appointment data yet</div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Status</h2>
                  <p className="text-sm text-gray-500">Distribution by status</p>
                </div>
              </div>
              {stats.statusData?.some(item => item.value > 0) ? (
                <AppointmentStatusChart data={stats.statusData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No appointment statuses yet</div>
              )}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Counselors</h2>
                  <p className="text-sm text-gray-500">Most booked counselors this month</p>
                </div>
                <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {stats.topCounselors?.length ? (
                <TopCounselorsChart data={stats.topCounselors} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No counselor bookings yet</div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Users className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</p>
                      <p className="text-xs text-gray-500">Edit roles and account status</p>
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

              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {(stats.recentActivity.length ? stats.recentActivity : [
                    { action: 'No recent activity', user: 'Activity will appear here when users register or book appointments', time: '', icon: AlertCircle },
                  ]).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.action}</p>
                        <p className="text-xs text-gray-400">{item.user}{item.time ? ` · ${item.time}` : ''}</p>
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
