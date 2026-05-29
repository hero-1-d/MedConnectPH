import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays, Search, Filter, CheckCircle, XCircle, Clock,
  MapPin, User, ChevronDown, ArrowUpDown
} from 'lucide-react'
import { showToast } from '../../components/ui/Toast.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers.js'
import { getAppointmentsForUser, updateAppointmentStatus } from '../../services/firestoreService.js'

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointmentsForUser(null, 'admin')
      setAppointments(data)
      setFilteredAppointments(data)
      } catch (error) {
        showToast.error(error.message || 'Failed to load appointments')
      } finally {
      setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  useEffect(() => {
    let filtered = appointments
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      }
      if (sortBy === 'status') {
        return sortOrder === 'desc'
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status)
      }
      return 0
    })

    setFilteredAppointments(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortBy, sortOrder, appointments])

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    approved: 'bg-wellness-100 text-wellness-700 dark:bg-wellness-900/20 dark:text-wellness-400',
    rejected: 'bg-crisis-100 text-crisis-700 dark:bg-crisis-900/20 dark:text-crisis-400',
    completed: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
      showToast.success(`Appointment ${newStatus}`)
    } catch (error) {
      showToast.error(error.message || 'Failed to update appointment')
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Appointment Management</h1>
            <p className="page-subtitle">Monitor and manage all platform appointments</p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total', value: appointments.length, color: 'bg-primary-50 text-primary-600' },
              { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-50 text-yellow-600' },
              { label: 'Approved', value: appointments.filter(a => a.status === 'approved').length, color: 'bg-wellness-50 text-wellness-600' },
              { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-secondary-50 text-secondary-600' },
              { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-gray-50 text-gray-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card text-center py-4"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by student or doctor..."
              className="flex-1"
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input px-4 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => {
                  setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
                }}
                className="input px-4 py-2 text-sm flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </button>
            </div>
          </div>

          {/* Appointments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card overflow-hidden"
          >
            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAppointments.map((apt) => (
                        <motion.tr
                          key={apt.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(apt.studentName)}`}>
                                {getInitials(apt.studentName)}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{apt.studentName}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{apt.doctorName}</span>
                          </td>
                          <td>
                            <div className="text-sm">
                              <p className="text-gray-900 dark:text-white">{formatDate(apt.date)}</p>
                              <p className="text-gray-500">{apt.time}</p>
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-gray-500">{apt.location}</span>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-1">
                              {apt.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(apt.id, 'approved')}
                                    className="p-1.5 rounded-lg text-wellness-600 hover:bg-wellness-50 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(apt.id, 'rejected')}
                                    className="p-1.5 rounded-lg text-crisis-600 hover:bg-crisis-50 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {apt.status === 'approved' && (
                                <button
                                  onClick={() => handleStatusChange(apt.id, 'completed')}
                                  className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                                  title="Mark Complete"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredAppointments.length}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default AppointmentManagement
