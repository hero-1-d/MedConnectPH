import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Search, Filter, CheckCircle, XCircle, FileText,
  Clock, MapPin, User, ChevronDown, Loader2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import AppointmentCard from '../../components/appointments/AppointmentCard.jsx'
import Modal from '../../components/ui/Modal.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { formatDate } from '../../utils/helpers.js'
import { subscribeToAppointmentsForUser, updateAppointmentStatus, updateDocument } from '../../services/firestoreService.js'

const DoctorAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [sessionNotes, setSessionNotes] = useState('')
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToAppointmentsForUser(
      user.uid,
      'doctor',
      (docs) => {
        setAppointments(docs)
        setFilteredAppointments(docs)
        setLoading(false)
      },
      (error) => {
        showToast.error(error.message || 'Failed to load appointments')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  useEffect(() => {
    let filtered = appointments
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter)
    }
    setFilteredAppointments(filtered)
  }, [searchQuery, statusFilter, appointments])

  const handleApprove = async (id) => {
    try {
      await updateAppointmentStatus(id, 'approved')
      showToast.success('Appointment approved!')
    } catch (error) {
      showToast.error(error.message || 'Failed to approve appointment')
    }
  }

  const handleReject = async (id) => {
    try {
      await updateAppointmentStatus(id, 'rejected')
      showToast.info('Appointment declined')
    } catch (error) {
      showToast.error(error.message || 'Failed to decline appointment')
    }
  }

  const handleComplete = async (id) => {
    try {
      await updateAppointmentStatus(id, 'completed')
      showToast.success('Session marked as completed')
    } catch (error) {
      showToast.error(error.message || 'Failed to complete appointment')
    }
  }

  const handleAddNotes = (appointment) => {
    setSelectedAppointment(appointment)
    setSessionNotes(appointment.notes || '')
    setShowNotesModal(true)
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      await updateDocument('appointments', selectedAppointment.id, { notes: sessionNotes })
      showToast.success('Notes saved successfully!')
      setShowNotesModal(false)
    } catch (error) {
      showToast.error('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    rejected: appointments.filter(a => a.status === 'rejected').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Appointments</h1>
            <p className="page-subtitle">Manage all your patient appointments</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by patient name..."
              className="flex-1"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { value: 'all', label: 'All', count: statusCounts.all },
                { value: 'pending', label: 'Pending', count: statusCounts.pending },
                { value: 'approved', label: 'Approved', count: statusCounts.approved },
                { value: 'completed', label: 'Completed', count: statusCounts.completed },
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {status.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    statusFilter === status.value ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse h-32" />
              ))}
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="card text-center py-16">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(apt => (
                <motion.div
                  key={apt.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AppointmentCard
                    appointment={apt}
                    userRole="doctor"
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onComplete={handleComplete}
                  />
                  {apt.status === 'completed' && (
                    <button
                      onClick={() => handleAddNotes(apt)}
                      className="mt-2 ml-4 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {apt.notes ? 'Edit Notes' : 'Add Session Notes'}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Notes Modal */}
          <Modal
            isOpen={showNotesModal}
            onClose={() => setShowNotesModal(false)}
            title="Session Notes"
            size="lg"
            footer={
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowNotesModal(false)} className="flex-1 btn-ghost">
                  Cancel
                </button>
                <button onClick={saveNotes} disabled={savingNotes} className="flex-1 btn-primary">
                  {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Notes'}
                </button>
              </div>
            }
          >
            {selectedAppointment && (
              <div>
                <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold">
                    {selectedAppointment.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedAppointment.studentName}</p>
                    <p className="text-sm text-gray-500">{formatDate(selectedAppointment.date)} at {selectedAppointment.time}</p>
                  </div>
                </div>
                <label className="label">Session Notes</label>
                <textarea
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  className="input min-h-[200px] resize-none"
                  placeholder="Enter your session observations, recommendations, and follow-up plans..."
                  rows={8}
                />
              </div>
            )}
          </Modal>
        </div>
      </main>
    </div>
  )
}

export default DoctorAppointments
