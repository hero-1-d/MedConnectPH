import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Smile, Frown, Meh, Laugh, Angry, Calendar, TrendingUp,
  BookOpen, ChevronLeft, ChevronRight, Sparkles, Heart
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import MoodChart from '../../components/mood/MoodChart.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { formatDate, getMoodData } from '../../utils/helpers.js'
import { addMoodLog, getMoodLogsForUser } from '../../services/firestoreService.js'

const MOOD_OPTIONS = [
  { value: 'excellent', label: 'Excellent', emoji: '😄', score: 5, icon: Laugh, color: 'bg-wellness-100 text-wellness-700 border-wellness-200' },
  { value: 'good', label: 'Good', emoji: '🙂', score: 4, icon: Smile, color: 'bg-primary-100 text-primary-700 border-primary-200' },
  { value: 'okay', label: 'Okay', emoji: '😐', score: 3, icon: Meh, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'bad', label: 'Bad', emoji: '😕', score: 2, icon: Frown, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'terrible', label: 'Terrible', emoji: '😢', score: 1, icon: Angry, color: 'bg-crisis-100 text-crisis-700 border-crisis-200' },
]

const MoodTracker = () => {
  const { user } = useAuth()
  const [moodLogs, setMoodLogs] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState('chart')

  useEffect(() => {
    const loadMoodLogs = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const logs = await getMoodLogsForUser(user.uid)
        setMoodLogs(logs)
      } catch (error) {
        showToast.error(error.message || 'Failed to load mood logs')
      } finally {
        setLoading(false)
      }
    }

    loadMoodLogs()
  }, [user?.uid])

  const handleSaveMood = async () => {
    if (!selectedMood) {
      showToast.warning('Please select a mood')
      return
    }
    if (!user?.uid) {
      showToast.error('Please sign in before logging your mood')
      return
    }

    setSaving(true)
    try {
      const moodOption = MOOD_OPTIONS.find(m => m.value === selectedMood)
      const newLog = await addMoodLog(user.uid, {
        mood: selectedMood,
        score: moodOption.score,
        note: note,
      })

      setMoodLogs(prev => [...prev, { ...newLog, createdAt: new Date() }])
      setSelectedMood(null)
      setNote('')
      showToast.success('Mood logged successfully!')
    } catch (error) {
      showToast.error('Failed to log mood')
    } finally {
      setSaving(false)
    }
  }

  const getMoodForDate = (date) => {
    return moodLogs.find(log => {
      const logDate = new Date(log.createdAt)
      return logDate.toDateString() === date.toDateString()
    })
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day))
    return days
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const averageMood = moodLogs.length > 0
    ? (moodLogs.reduce((sum, log) => sum + log.score, 0) / moodLogs.length).toFixed(1)
    : 0

  const moodTrend = moodLogs.length >= 2
    ? moodLogs[moodLogs.length - 1].score - moodLogs[moodLogs.length - 2].score
    : 0

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Mood Tracker</h1>
            <p className="page-subtitle">Log your daily mood and track your emotional well-being</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Log Mood */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mood Logger */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How are you feeling?</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  {MOOD_OPTIONS.map((mood) => (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selectedMood === mood.value
                          ? `${mood.color} border-current shadow-md`
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <div className="text-left">
                        <p className={`font-medium ${selectedMood === mood.value ? '' : 'text-gray-900 dark:text-white'}`}>
                          {mood.label}
                        </p>
                        <p className="text-xs text-gray-500">Score: {mood.score}/5</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="label">Journal Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="input min-h-[100px] resize-none"
                    placeholder="What's on your mind today?"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleSaveMood}
                  disabled={saving || !selectedMood}
                  className="w-full btn-primary"
                >
                  {saving ? 'Saving...' : 'Log Mood'}
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-primary-600">{moodLogs.length}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                  <div className="text-center p-4 bg-wellness-50 dark:bg-wellness-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-wellness-600">{averageMood}</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                </div>
                {moodTrend !== 0 && (
                  <div className={`mt-4 flex items-center gap-2 text-sm ${moodTrend > 0 ? 'text-wellness-600' : 'text-crisis-600'}`}>
                    <TrendingUp className={`w-4 h-4 ${moodTrend < 0 ? 'rotate-180' : ''}`} />
                    <span>{moodTrend > 0 ? 'Improving' : 'Declining'} trend</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Charts & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* View Toggle */}
              <div className="flex gap-2">
                {[
                  { id: 'chart', label: 'Chart View', icon: TrendingUp },
                  { id: 'calendar', label: 'Calendar View', icon: Calendar },
                  { id: 'list', label: 'History', icon: BookOpen },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      viewMode === view.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <view.icon className="w-4 h-4" />
                    {view.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {viewMode === 'chart' && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Mood Trends</h2>
                    {moodLogs.length > 0 ? (
                      <MoodChart data={moodLogs} type="area" />
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No mood data yet. Start logging!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {viewMode === 'calendar' && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mood Calendar</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
                      ))}
                      {getDaysInMonth().map((date, index) => {
                        const moodLog = date ? getMoodForDate(date) : null
                        const moodData = moodLog ? getMoodData(moodLog.mood) : null
                        return (
                          <div key={index} className="aspect-square">
                            {date && (
                              <div
                                className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                                  moodData
                                    ? `${moodData.color.split(' ')[0]} border border-current`
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                                }`}
                                title={moodLog?.note || ''}
                              >
                                <span className="text-xs">{date.getDate()}</span>
                                {moodData && <span className="text-lg">{moodData.emoji}</span>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {viewMode === 'list' && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {moodLogs.length === 0 ? (
                      <div className="card text-center py-12">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No mood history yet</p>
                      </div>
                    ) : (
                      [...moodLogs].reverse().map((log, index) => {
                        const moodData = getMoodData(log.mood)
                        return (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card flex items-start gap-4"
                          >
                            <div className="text-3xl">{moodData.emoji}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${moodData.color}`}>
                                  {moodData.label}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatDate(log.createdAt)}
                                </span>
                              </div>
                              {log.note && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{log.note}</p>
                              )}
                            </div>
                            <div className="text-lg font-bold text-gray-300">{log.score}/5</div>
                          </motion.div>
                        )
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MoodTracker
