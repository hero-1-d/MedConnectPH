import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChange, getCurrentUserData } from '../services/authService.js'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const data = await getCurrentUserData(firebaseUser.uid, firebaseUser)
          setUserData(data)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Subscribe to real-time user data updates
  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data())
      }
    })

    return () => unsubscribe()
  }, [user?.uid])

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isStudent: userData?.role === 'student',
    isDoctor: userData?.role === 'doctor',
    isAdmin: userData?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
