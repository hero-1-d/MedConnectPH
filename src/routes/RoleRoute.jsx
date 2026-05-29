import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const RoleRoute = ({ allowedRoles }) => {
  const { userData, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!userData || !allowedRoles.includes(userData.role)) {
    // Redirect to appropriate dashboard based on role
    if (userData?.role === 'student') return <Navigate to="/student/dashboard" replace />
    if (userData?.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />
    if (userData?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleRoute
