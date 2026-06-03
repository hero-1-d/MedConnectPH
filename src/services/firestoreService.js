import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

export const toDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()
  return new Date(value)
}

const normalizeDocument = (docSnap) => {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    ...data,
    date: toDate(data.date) || data.date,
    createdAt: toDate(data.createdAt) || data.createdAt,
    updatedAt: toDate(data.updatedAt) || data.updatedAt,
  }
}

const sortByField = (items, field = 'createdAt', direction = 'desc') => {
  return [...items].sort((a, b) => {
    const valueA = toDate(a[field]) || a[field] || ''
    const valueB = toDate(b[field]) || b[field] || ''

    if (valueA < valueB) return direction === 'desc' ? 1 : -1
    if (valueA > valueB) return direction === 'desc' ? -1 : 1
    return 0
  })
}

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    throw error
  }
}

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    throw error
  }
}

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return { id: docId, ...data }
  } catch (error) {
    throw error
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId))
    return true
  } catch (error) {
    throw error
  }
}

export const getDocuments = async (collectionName, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(normalizeDocument)
  } catch (error) {
    throw error
  }
}

// Real-time listeners
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId)
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() })
    } else {
      callback(null)
    }
  })
}

export const subscribeToCollection = (collectionName, constraints = [], callback, onError) => {
  const q = query(collection(db, collectionName), ...constraints)
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(normalizeDocument)
    callback(data)
  }, onError)
}

// Appointment-specific operations
export const createAppointment = async (appointmentData) => {
  try {
    const appointmentDate = appointmentData.date instanceof Date
      ? Timestamp.fromDate(appointmentData.date)
      : appointmentData.date

    const appointment = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      date: appointmentDate,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Create notification for doctor
    await addDoc(collection(db, 'notifications'), {
      uid: appointmentData.doctorId,
      type: 'appointment_request',
      message: `New appointment request from ${appointmentData.studentName}`,
      appointmentId: appointment.id,
      read: false,
      createdAt: serverTimestamp(),
    })

    return { id: appointment.id, ...appointmentData, status: 'pending' }
  } catch (error) {
    throw error
  }
}

export const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId)
    const appointmentSnap = await getDoc(appointmentRef)

    if (!appointmentSnap.exists()) {
      throw new Error('Appointment not found')
    }

    const appointmentData = appointmentSnap.data()

    await updateDoc(appointmentRef, {
      status,
      notes: notes || appointmentData.notes,
      updatedAt: serverTimestamp(),
    })

    // Create notification for student
    const statusMessages = {
      approved: 'Your appointment has been approved!',
      rejected: 'Your appointment request was declined.',
      completed: 'Your session has been marked as completed.',
      cancelled: 'Your appointment has been cancelled.',
    }

    await addDoc(collection(db, 'notifications'), {
      uid: appointmentData.studentId,
      type: `appointment_${status}`,
      message: statusMessages[status] || `Your appointment status has been updated to ${status}`,
      appointmentId,
      read: false,
      createdAt: serverTimestamp(),
    })

    return { id: appointmentId, status }
  } catch (error) {
    throw error
  }
}

// Mood log operations
export const addMoodLog = async (uid, moodData) => {
  try {
    const moodLog = await addDoc(collection(db, 'mood_logs'), {
      uid,
      ...moodData,
      createdAt: serverTimestamp(),
    })

    // Update student's mood logs array
    const studentRef = doc(db, 'students', uid)
    const studentSnap = await getDoc(studentRef)

    if (studentSnap.exists()) {
      const currentLogs = studentSnap.data().moodLogs || []
      await updateDoc(studentRef, {
        moodLogs: [...currentLogs, { id: moodLog.id, ...moodData, createdAt: new Date() }],
      })
    }

    return { id: moodLog.id, ...moodData }
  } catch (error) {
    throw error
  }
}

export const getDoctorsForBooking = async () => {
  const usersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'doctor')))

  const doctors = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
    const user = normalizeDocument(userDoc)
    const doctorSnap = await getDoc(doc(db, 'doctors', user.uid))
    const profile = doctorSnap.exists() ? doctorSnap.data() : {}

    return {
      ...profile,
      ...user,
      id: user.uid,
      uid: user.uid,
      specialization: profile.specialization || user.specialization || 'General Counseling',
      bio: profile.bio || user.bio || '',
      availability: profile.availability || {},
      profileImage: profile.profileImage || user.photoURL || '',
      rating: profile.rating || 0,
      totalReviews: profile.totalReviews || 0,
      location: profile.location || 'Counseling Center',
    }
  }))

  return doctors.filter(doctor => doctor.isActive !== false)
}

export const getAppointmentsForUser = async (uid, role) => {
  const constraints = role === 'admin'
    ? []
    : [where(role === 'doctor' ? 'doctorId' : 'studentId', '==', uid)]

  const appointments = await getDocuments('appointments', constraints)
  return sortByField(appointments, 'createdAt', 'desc')
}

export const subscribeToAppointmentsForUser = (uid, role, callback, onError) => {
  const constraints = role === 'admin'
    ? []
    : [where(role === 'doctor' ? 'doctorId' : 'studentId', '==', uid)]

  return subscribeToCollection(
    'appointments',
    constraints,
    (appointments) => callback(sortByField(appointments, 'createdAt', 'desc')),
    onError
  )
}

export const getMoodLogsForUser = async (uid) => {
  const moodLogs = await getDocuments('mood_logs', [where('uid', '==', uid)])
  return sortByField(moodLogs, 'createdAt', 'asc')
}

export const getNotificationsForUser = async (uid) => {
  const notifications = await getDocuments('notifications', [where('uid', '==', uid)])
  return sortByField(notifications, 'createdAt', 'desc')
}

export const getResourcesForLibrary = async () => {
  const resources = await getDocuments('resources')
  return sortByField(
    resources.filter(resource => resource.isActive !== false),
    'createdAt',
    'desc'
  )
}

export const getWellnessTips = async () => {
  const tips = await getDocuments('wellness_tips')
  return sortByField(
    tips.filter(tip => tip.isActive !== false),
    'createdAt',
    'desc'
  )
}

export const getCrisisResources = async () => {
  const resources = await getDocuments('crisis_resources')
  return resources
    .filter(resource => resource.isActive !== false)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || (a.name || '').localeCompare(b.name || ''))
}

export const getUniversityCounseling = async () => {
  const centers = await getDocuments('counseling_centers')
  return centers.find(center => center.isActive !== false && (center.type === 'university' || center.isUniversity)) || null
}

export const getCalmingTechniques = async () => {
  const techniques = await getDocuments('calming_techniques')
  return techniques
    .filter(technique => technique.isActive !== false)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || (a.title || '').localeCompare(b.title || ''))
}

// Batch operations for admin
export const batchUpdate = async (operations) => {
  try {
    const batch = writeBatch(db)

    operations.forEach(({ collectionName, docId, data }) => {
      const docRef = doc(db, collectionName, docId)
      batch.update(docRef, data)
    })

    await batch.commit()
    return true
  } catch (error) {
    throw error
  }
}

// Analytics helpers
export const getAnalyticsData = async () => {
  try {
    const appointmentsSnapshot = await getDocs(collection(db, 'appointments'))
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const studentsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
    const doctorsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'doctor')))

    const appointments = appointmentsSnapshot.docs.map(d => normalizeDocument(d))
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyData = dayLabels.map(day => ({ day, name: day, appointments: 0 }))
    const counselorCounts = new Map()

    appointments.forEach((appointment) => {
      const date = toDate(appointment.date) || toDate(appointment.createdAt)
      if (date) {
        weeklyData[date.getDay()].appointments += 1
      }

      if (appointment.doctorName) {
        counselorCounts.set(appointment.doctorName, (counselorCounts.get(appointment.doctorName) || 0) + 1)
      }
    })

    const statusData = ['pending', 'approved', 'completed', 'cancelled', 'rejected'].map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: appointments.filter(appointment => appointment.status === status).length,
    }))

    const topCounselors = Array.from(counselorCounts.entries())
      .map(([name, appointments]) => ({ name, appointments, bookings: appointments }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5)

    return {
      totalAppointments: appointments.length,
      totalUsers: usersSnapshot.docs.length,
      totalStudents: studentsSnapshot.docs.length,
      totalDoctors: doctorsSnapshot.docs.length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      approvedAppointments: appointments.filter(a => a.status === 'approved').length,
      completedAppointments: appointments.filter(a => a.status === 'completed').length,
      cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
      weeklyData,
      statusData,
      topCounselors,
    }
  } catch (error) {
    throw error
  }
}

export { db }
