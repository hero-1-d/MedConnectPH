import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock, Plus, X, Check, ChevronLeft, ChevronRight,
  CalendarDays, Save, Loader2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { generateTimeSlots } from '../../utils/helpers.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState({
    monday: ['09:00', '10:00', '14:00', '15:00'],
    tuesday: ['10:00', '11:00', '13:00', '16:00'],
    wednesday: ['09:00', '11:00', '14:00'],
    thursday: ['10:00', '12:00', '15:00'],
    friday: ['09:00', '10:00', '14:00'],
    saturday: [],
    sunday: [],
  })
  const [saving, setSaving] = useState(false)
  const [selectedDay, setSelectedDay] = useState('monday')
  const timeSlots = generateTimeSlots(8, 18, 30)

  const toggleTimeSlot = (day, time) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].includes(time)
        ? prev[day].filter(t => t !== time)
        : [...prev[day], time].sort()
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast.success('Schedule updated successfully!')
    } catch (error) {
      showToast.error('Failed to update schedule')
    } finally {
      setSaving(false)
    }
  }

  const selectAll = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: timeSlots.map(s => s.value)
    }))
  }

  const clearAll = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: []
    }))
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">My Schedule</h1>
            <p className="page-subtitle">Set your weekly availability for appointments</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Day Selector */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  Select Day
                </h2>
                <div className="space-y-1">
                  {DAY_KEYS.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        selectedDay === day
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{DAYS[index]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        schedule[day].length > 0
                          ? 'bg-wellness-100 text-wellness-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {schedule[day].length} slots
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="lg:col-span-3">
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {DAYS[DAY_KEYS.indexOf(selectedDay)]}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {schedule[selectedDay].length} time slots selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectAll(selectedDay)}
                      className="px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => clearAll(selectedDay)}
                      className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map(slot => {
                    const isSelected = schedule[selectedDay].includes(slot.value)
                    return (
                      <motion.button
                        key={slot.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTimeSlot(selectedDay, slot.value)}
                        className={`relative px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && (
                          <Check className="absolute top-1 right-1 w-3 h-3" />
                        )}
                        {slot.label}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-white">{schedule[selectedDay].length}</span> slots on {DAYS[DAY_KEYS.indexOf(selectedDay)]}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Schedule
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Weekly Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mt-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Weekly Overview
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {DAY_KEYS.map((day, index) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{DAYS[index].slice(0, 3)}</div>
                      <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium ${
                        schedule[day].length > 0
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'bg-gray-50 dark:bg-gray-700/30 text-gray-400'
                      }`}>
                        {schedule[day].length}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Total weekly slots: <span className="font-medium text-gray-900 dark:text-white">
                    {Object.values(schedule).reduce((sum, slots) => sum + slots.length, 0)}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorSchedule
