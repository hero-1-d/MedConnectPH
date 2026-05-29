import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config.js'

export const ADMIN_EMAIL = 'mindconnect.univ@gmail.com'
export const ADMIN_NAME = 'MindConnect Admin'

const normalizeEmail = (email = '') => email.trim().toLowerCase()
const resolveRole = (email, requestedRole = 'student') => {
  return normalizeEmail(email) === ADMIN_EMAIL ? 'admin' : requestedRole
}

const buildUserData = (user, role = 'student', additionalData = {}) => ({
  uid: user.uid,
  name: additionalData.name || user.displayName || (role === 'admin' ? ADMIN_NAME : ''),
  email: normalizeEmail(user.email || additionalData.email),
  role,
  createdAt: additionalData.createdAt || serverTimestamp(),
  updatedAt: serverTimestamp(),
  isActive: additionalData.isActive ?? true,
  studentNumber: additionalData.studentNumber || '',
  course: additionalData.course || '',
  yearLevel: additionalData.yearLevel || '',
  specialization: additionalData.specialization || '',
  bio: additionalData.bio || '',
  photoURL: additionalData.photoURL || user.photoURL || '',
})

export const ensureUserDocument = async (user, requestedRole = 'student', additionalData = {}) => {
  if (!user?.uid) return null

  const userRef = doc(db, 'users', user.uid)
  const userDoc = await getDoc(userRef)
  const existingData = userDoc.exists() ? userDoc.data() : null
  const role = resolveRole(user.email || additionalData.email, existingData?.role || requestedRole)

  const userData = buildUserData(user, role, {
    ...existingData,
    ...additionalData,
    name: additionalData.name || existingData?.name || user.displayName,
    createdAt: existingData?.createdAt,
    isActive: existingData?.isActive,
  })

  await setDoc(userRef, userData, { merge: true })

  if (role === 'student') {
    const studentRef = doc(db, 'students', user.uid)
    const studentSnap = await getDoc(studentRef)
    const studentData = studentSnap.exists() ? studentSnap.data() : {}

    await setDoc(doc(db, 'students', user.uid), {
      uid: user.uid,
      studentNumber: userData.studentNumber,
      course: userData.course,
      yearLevel: userData.yearLevel,
      moodLogs: studentData.moodLogs || [],
      createdAt: studentData.createdAt || existingData?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }

  if (role === 'doctor') {
    const doctorRef = doc(db, 'doctors', user.uid)
    const doctorSnap = await getDoc(doctorRef)
    const doctorData = doctorSnap.exists() ? doctorSnap.data() : {}

    await setDoc(doctorRef, {
      uid: user.uid,
      specialization: userData.specialization || doctorData.specialization || 'General Counseling',
      bio: userData.bio || doctorData.bio || '',
      availability: doctorData.availability || additionalData.availability || {},
      profileImage: doctorData.profileImage || userData.photoURL || '',
      rating: doctorData.rating || additionalData.rating || 0,
      totalReviews: doctorData.totalReviews || additionalData.totalReviews || 0,
      createdAt: doctorData.createdAt || existingData?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }

  return userData
}

// Register a new user
export const registerUser = async (
  email,
  password,
  displayName,
  role = 'student',
  additionalData = {}
) => {
  try {
    additionalData = additionalData || {}
    const userRole = resolveRole(email, role || 'student')

   const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  )

    const user = userCredential.user

    await updateProfile(user, {
      displayName: displayName || (userRole === 'admin' ? ADMIN_NAME : ''),
    })

    const userData = await ensureUserDocument(user, userRole, {
      name: displayName || (userRole === 'admin' ? ADMIN_NAME : ''),
      email,
      studentNumber: additionalData.studentNumber || '',
      course: additionalData.course || '',
      yearLevel: additionalData.yearLevel || '',
      specialization: additionalData.specialization || '',
      bio: additionalData.bio || '',
      photoURL: additionalData.photoURL || '',
    })

    return { user, userData }
  } catch (error) {
    console.error(error)
    throw error
  }
}
// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    )

    const user = userCredential.user

    const userData = await ensureUserDocument(user, 'student')

    return { user, userData }
  } catch (error) {
    throw error
  }
}

// Google Sign In
export const signInWithGoogle = async (role = 'student') => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    const userRole = resolveRole(user.email, role)

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = await ensureUserDocument(user, userRole, {
      name: user.displayName,
      photoURL: user.photoURL || '',
    })

    return { user, userData, isNew: !userDoc.exists() }
  } catch (error) {
    throw error
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    throw error
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return true
  } catch (error) {
    throw error
  }
}

// Get current user data
export const getCurrentUserData = async (uid, firebaseUser = null) => {
  try {
    if (firebaseUser) {
      return ensureUserDocument(firebaseUser, 'student')
    }

    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    throw error
  }
}

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export { auth }
