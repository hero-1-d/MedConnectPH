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
      name: userData.name,
      email: userData.email,
      role,
      studentNumber: userData.studentNumber,
      course: userData.course,
      yearLevel: userData.yearLevel,
      moodLogs: studentData.moodLogs || [],
      isActive: userData.isActive,
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
      name: userData.name,
      email: userData.email,
      role,
      specialization: userData.specialization || doctorData.specialization || 'General Counseling',
      bio: userData.bio || doctorData.bio || '',
      availability: doctorData.availability || additionalData.availability || {},
      profileImage: doctorData.profileImage || userData.photoURL || '',
      rating: doctorData.rating || additionalData.rating || 0,
      totalReviews: doctorData.totalReviews || additionalData.totalReviews || 0,
      isActive: userData.isActive,
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
    const normalizedEmail = normalizeEmail(email)
    const userRole = resolveRole(normalizedEmail, role)

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    )

    const user = userCredential.user

    await updateProfile(user, {
      displayName:
        displayName || (userRole === 'admin' ? ADMIN_NAME : ''),
    })

    const userData = await ensureUserDocument(user, userRole, {
      ...additionalData,
      name: displayName,
      email: normalizedEmail,
    })

    return {
      success: true,
      user,
      userData,
    }
  } catch (error) {
    console.error('REGISTER ERROR:', error)

    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error(
          'This email is already registered. Please login instead.'
        )

      case 'auth/invalid-email':
        throw new Error('Invalid email address.')

      case 'auth/weak-password':
        throw new Error(
          'Password must be at least 6 characters.'
        )

      default:
        throw new Error(error.message)
    }
  }
}

// Login existing user
export const loginUser = async (email, password) => {
  try {
    const normalizedEmail = normalizeEmail(email)
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
    const user = userCredential.user
    const userData = await getCurrentUserData(user.uid)

    if (!userData) {
      throw new Error('Your account exists in Firebase Auth but has no Firestore profile yet. Please contact an admin or recreate the account.')
    }

    return { success: true, user, userData }
  } catch (error) {
    console.error('LOGIN ERROR:', error)

    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address.')
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.')
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.')
      default:
        throw new Error(error.message)
    }
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
export const getCurrentUserData = async (uid) => {
  try {
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
