import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays, Brain, Heart, BookOpen, AlertTriangle, TrendingUp,
  Clock, ChevronRight, Sparkles, Activity, MessageSquare
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { formatDate, getRelativeTime, getMoodData } from '../../utils/helpers.js'
import AppointmentCard from '../../components/appointments/AppointmentCard.jsx'
import MoodChart from '../../components/mood/MoodChart.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { getAppointmentsForUser, getMoodLogsForUser, getWellnessTips } from '../../services/firestoreService.js'

const StudentDashboard = () => {
  const { user, userData } = useAuth()
  const { notifications } = useNotifications()
  const [appointments, setAppointments] = useState([])
  const [moodLogs, setMoodLogs] = useState([])
  const [wellnessTips, setWellnessTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const [appointmentData, moodData, tipData] = await Promise.all([
          getAppointmentsForUser(user.uid, 'student'),
          getMoodLogsForUser(user.uid),
          getWellnessTips(),
        ])
        setAppointments(appointmentData)
        setMoodLogs(moodData)
        setWellnessTips(tipData)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user?.uid])

  useEffect(() => {
    if (wellnessTips.length === 0) return undefined

    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % wellnessTips.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [wellnessTips.length])

  const upcomingAppointments = appointments.filter(a => 
    ['approved', 'pending'].includes(a.status) && new Date(a.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date))

  const recentMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null
  const moodData = recentMood ? getMoodData(recentMood.mood) : null

  const stats = [
    { label: 'Total Sessions', value: appointments.filter(a => a.status === 'completed').length, icon: CalendarDays, color: 'bg-primary-50 text-primary-600' },
    { label: 'Upcoming', value: upcomingAppointments.length, icon: Clock, color: 'bg-wellness-50 text-wellness-600' },
    { label: 'Mood Entries', value: moodLogs.length, icon: Brain, color: 'bg-secondary-50 text-secondary-600' },
    { label: 'Notifications', value: notifications.filter(n => !n.read).length, icon: TrendingUp, color: 'bg-accent-50 text-accent-600' },
  ]

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="page-title">
              Welcome back, <span className="text-gradient">{userData?.name?.split(' ')[0] || 'Student'}</span>
            </h1>
            <p className="page-subtitle">
              Here is your mental health overview for today
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
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
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                  <Link to="/student/appointments" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No upcoming appointments"
                    description="Book a session with a counselor to get started."
                    action={
                      <Link to="/student/appointments" className="btn-primary text-sm">
                        Book Appointment
                      </Link>
                    }
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {upcomingAppointments.slice(0, 2).map(apt => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        userRole="student"
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Mood Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mood History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track your emotional well-being over time</p>
                  </div>
                  <Link to="/student/mood-tracker" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                    Log Mood <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {moodLogs.length > 0 ? (
                  <MoodChart data={moodLogs} type="area" />
                ) : (
                  <EmptyState
                    icon={Brain}
                    title="No mood entries yet"
                    description="Start logging your daily mood to see patterns."
                  />
                )}
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Current Mood */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Mood</h2>
                {moodData ? (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-2">{moodData.emoji}</div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${moodData.color}`}>
                      {moodData.label}
                    </div>
                    {recentMood?.note && (
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic">
                        "{recentMood.note}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No mood logged today</p>
                    <Link to="/student/mood-tracker" className="text-primary-600 text-sm mt-2 inline-block">
                      Log your mood
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Daily Tip */}
              {wellnessTips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-100 dark:border-primary-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Wellness Tip</h2>
                  </div>
                  <motion.div
                    key={currentTip}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {wellnessTips[currentTip]?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {wellnessTips[currentTip]?.description}
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link to="/student/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Book Session</p>
                      <p className="text-xs text-gray-500">Schedule with a counselor</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/student/mood-tracker" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Log Mood</p>
                      <p className="text-xs text-gray-500">Track how you feel</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/student/resources" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-wellness-50 dark:bg-wellness-900/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-wellness-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Resources</p>
                      <p className="text-xs text-gray-500">Self-help articles & videos</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/student/crisis" className="flex items-center gap-3 p-3 rounded-xl hover:bg-crisis-50 dark:hover:bg-crisis-900/20 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-crisis-50 dark:bg-crisis-900/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-crisis-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-crisis-700 dark:text-crisis-400">Crisis Support</p>
                      <p className="text-xs text-gray-500">Get immediate help</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </motion.div>

              {/* Recent Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Notifications</h2>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(notif => (
                    <div key={notif.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.read ? 'bg-gray-300' : 'bg-primary-500'}`} />
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                        <p className="text-xs text-gray-400">{getRelativeTime(notif.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
