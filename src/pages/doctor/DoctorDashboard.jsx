import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays, Users, Clock, CheckCircle, XCircle, TrendingUp,
  MessageSquare, Star, ChevronRight, Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers.js'
import AppointmentCard from '../../components/appointments/AppointmentCard.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import { getAppointmentsForUser, updateAppointmentStatus } from '../../services/firestoreService.js'

const DoctorDashboard = () => {
  const { user, userData } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const appointmentData = await getAppointmentsForUser(user.uid, 'doctor')
        setAppointments(appointmentData)
        setStats({
          totalPatients: new Set(appointmentData.map(a => a.studentId)).size,
          todayAppointments: appointmentData.filter(a =>
            new Date(a.date).toDateString() === new Date().toDateString()
          ).length,
          pendingRequests: appointmentData.filter(a => a.status === 'pending').length,
          completedSessions: appointmentData.filter(a => a.status === 'completed').length,
          rating: userData?.rating || 0,
          responseRate: 100,
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user?.uid, userData?.rating])

  const today = new Date().toDateString()
  const todaysAppointments = appointments.filter(a => 
    new Date(a.date).toDateString() === today && a.status === 'approved'
  )

  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  const upcomingAppointments = appointments.filter(a => 
    a.status === 'approved' && new Date(a.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleApprove = async (id) => {
    try {
      await updateAppointmentStatus(id, 'approved')
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a))
      showToast.success('Appointment approved!')
    } catch (error) {
      showToast.error(error.message || 'Failed to approve appointment')
    }
  }

  const handleReject = async (id) => {
    try {
      await updateAppointmentStatus(id, 'rejected')
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
      showToast.info('Appointment declined')
    } catch (error) {
      showToast.error(error.message || 'Failed to decline appointment')
    }
  }

  const handleComplete = async (id) => {
    try {
      await updateAppointmentStatus(id, 'completed')
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a))
      showToast.success('Session marked as completed')
    } catch (error) {
      showToast.error(error.message || 'Failed to complete session')
    }
  }

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-primary-50 text-primary-600' },
    { label: "Today's Sessions", value: stats.todayAppointments, icon: CalendarDays, color: 'bg-wellness-50 text-wellness-600' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Completed', value: stats.completedSessions, icon: CheckCircle, color: 'bg-secondary-50 text-secondary-600' },
  ]

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">
              Welcome, <span className="text-gradient">Dr. {userData?.name?.split(' ')[1] || 'Doctor'}</span>
            </h1>
            <p className="page-subtitle">Manage your appointments and patient care</p>
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
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pending Requests */}
              {pendingAppointments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pending Requests
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                      {pendingAppointments.length} new
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pendingAppointments.map(apt => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        userRole="doctor"
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Today's Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Today's Schedule
                  </h2>
                  <Link to="/doctor/schedule" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                    View Full Schedule <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {todaysAppointments.length === 0 ? (
                  <div className="card text-center py-8">
                    <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysAppointments.map(apt => (
                      <div key={apt.id} className="card flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${getAvatarColor(apt.studentName)}`}>
                          {getInitials(apt.studentName)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{apt.studentName}</h3>
                          <p className="text-sm text-gray-500">{apt.time} · {apt.location}</p>
                        </div>
                        <button
                          onClick={() => handleComplete(apt.id)}
                          className="px-4 py-2 bg-wellness-50 text-wellness-700 rounded-lg text-sm font-medium hover:bg-wellness-100 transition-colors"
                        >
                          Complete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Upcoming */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming Appointments
                </h2>
                {upcomingAppointments.length === 0 ? (
                  <div className="card text-center py-8">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map(apt => (
                      <div key={apt.id} className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{apt.studentName}</h3>
                          <p className="text-sm text-gray-500">{formatDate(apt.date)} at {apt.time}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-wellness-100 text-wellness-700 text-xs font-medium">
                          Approved
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary-600">{userData?.name?.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{userData?.name}</h3>
                  <p className="text-sm text-primary-600">{userData?.specialization || 'Counselor'}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{stats.rating}</span>
                    <span className="text-xs text-gray-400">({stats.completedSessions} reviews)</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Response Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stats.responseRate}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/doctor/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Update Schedule</p>
                      <p className="text-xs text-gray-500">Set your availability</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  <Link to="/doctor/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <CalendarDays className="w-5 h-5 text-wellness-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">All Appointments</p>
                      <p className="text-xs text-gray-500">View full history</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <MessageSquare className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Messages</p>
                      <p className="text-xs text-gray-500">Check patient messages</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                </div>
              </motion.div>

              {/* Weekly Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-8">{day}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${[60, 85, 45, 90, 70][index]}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6">{[3, 5, 2, 6, 4][index]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard
