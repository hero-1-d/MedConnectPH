import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Search, Filter, ChevronRight, Clock, MapPin,
  X, CheckCircle, Star, Loader2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import DoctorCard from '../../components/appointments/DoctorCard.jsx'
import CalendarPicker from '../../components/ui/CalendarPicker.jsx'
import Modal from '../../components/ui/Modal.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { generateTimeSlots } from '../../utils/helpers.js'
import {
  createAppointment,
  getDoctorsForBooking,
  subscribeToAppointmentsForUser,
  updateAppointmentStatus,
} from '../../services/firestoreService.js'

const AppointmentBooking = () => {
  const { user, userData } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingNotes, setBookingNotes] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [myAppointments, setMyAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('book')

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization).filter(Boolean))]
  const timeSlots = generateTimeSlots(8, 17, 30)

  useEffect(() => {
    let unsubscribeAppointments

    const loadData = async () => {
      if (!user?.uid) return

      try {
        const doctorList = await getDoctorsForBooking()
        setDoctors(doctorList)
        setFilteredDoctors(doctorList)

        unsubscribeAppointments = subscribeToAppointmentsForUser(
          user.uid,
          'student',
          setMyAppointments,
          (error) => showToast.error(error.message || 'Failed to load appointments')
        )
      } catch (error) {
        showToast.error(error.message || 'Failed to load doctors')
        setDoctors([])
        setFilteredDoctors([])
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      if (unsubscribeAppointments) unsubscribeAppointments()
    }
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    let filtered = doctors
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(d => d.specialization === selectedSpecialization)
    }
    setFilteredDoctors(filtered)
  }, [searchQuery, selectedSpecialization, doctors])

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedTime(null)
    setBookingNotes('')
    setShowBookingModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      showToast.warning('Please select a date and time')
      return
    }

    setBookingLoading(true)
    try {
      await createAppointment({
        studentId: user.uid,
        studentName: userData?.name || 'Student',
        doctorId: selectedDoctor.uid || selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        notes: bookingNotes,
        location: selectedDoctor.location || 'Counseling Center',
      })

      showToast.success('Appointment request sent successfully!')
      setShowBookingModal(false)
    } catch (error) {
      showToast.error('Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'cancelled')
      showToast.success('Appointment cancelled')
    } catch (error) {
      showToast.error(error.message || 'Failed to cancel appointment')
    }
  }

  const getDayAvailability = (doctor, date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = days[date.getDay()]
    const availability = doctor.availability?.[dayName]
    return availability?.length ? availability : timeSlots.map(slot => slot.value)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="page-title">Appointments</h1>
            <p className="page-subtitle">Book and manage your counseling sessions</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'book', label: 'Book New', icon: CalendarDays },
              { id: 'my', label: 'My Appointments', icon: Clock },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'book' ? (
              <motion.div
                key="book"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search doctors or specializations..."
                    className="flex-1"
                  />
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {specializations.map(spec => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialization(spec)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedSpecialization === spec
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {spec === 'all' ? 'All Specializations' : spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctors Grid */}
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="card animate-pulse">
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No doctors found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map(doctor => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onBook={handleBook}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="my"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {myAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No appointments yet</h3>
                    <p className="text-gray-500 mb-4">Book your first session with a counselor</p>
                    <button
                      onClick={() => setActiveTab('book')}
                      className="btn-primary"
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myAppointments.map(apt => (
                      <motion.div
                        key={apt.id}
                        layout
                        className="card flex flex-col md:flex-row md:items-center gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{apt.doctorName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              apt.status === 'approved' ? 'bg-wellness-100 text-wellness-700' :
                              apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              apt.status === 'completed' ? 'bg-primary-100 text-primary-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {apt.date.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {apt.location}
                            </span>
                          </div>
                          {apt.notes && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{apt.notes}</p>
                          )}
                        </div>
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-4 py-2 text-sm text-crisis-600 hover:bg-crisis-50 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Modal */}
          <Modal
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            title={`Book with ${selectedDoctor?.name}`}
            size="lg"
            footer={
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading || !selectedDate || !selectedTime}
                  className="flex-1 btn-primary"
                >
                  {bookingLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            }
          >
            {selectedDoctor && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold">
                    {selectedDoctor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedDoctor.name}</h3>
                    <p className="text-sm text-primary-600">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <div>
                  <label className="label">Select Date</label>
                  <CalendarPicker
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="label">Select Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map(slot => {
                        const available = getDayAvailability(selectedDoctor, selectedDate).includes(slot.value)
                        return (
                          <button
                            key={slot.value}
                            onClick={() => available && setSelectedTime(slot.label)}
                            disabled={!available}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedTime === slot.label
                                ? 'bg-primary-600 text-white'
                                : available
                                ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="label" htmlFor="notes">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    className="input min-h-[100px] resize-none"
                    placeholder="Any specific concerns or topics you'd like to discuss..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </Modal>
        </div>
      </main>
    </div>
  )
}

export default AppointmentBooking
