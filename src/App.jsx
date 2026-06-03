import React, { Suspense, lazy } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingSpinner from './components/ui/LoadingSpinner.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/public/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'))
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.jsx'))
const AppointmentBooking = lazy(() => import('./pages/student/AppointmentBooking.jsx'))
const MoodTracker = lazy(() => import('./pages/student/MoodTracker.jsx'))
const SelfHelpLibrary = lazy(() => import('./pages/student/SelfHelpLibrary.jsx'))
const CrisisSupport = lazy(() => import('./pages/student/CrisisSupport.jsx'))
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard.jsx'))
const DoctorSchedule = lazy(() => import('./pages/doctor/DoctorSchedule.jsx'))
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'))
const AppointmentManagement = lazy(() => import('./pages/admin/AppointmentManagement.jsx'))
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage.jsx'))

// Route guards
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleRoute from './routes/RoleRoute.jsx'

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}> 
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/appointments" element={<AppointmentBooking />} />
              <Route path="/student/mood-tracker" element={<MoodTracker />} />
              <Route path="/student/resources" element={<SelfHelpLibrary />} />
              <Route path="/student/crisis" element={<CrisisSupport />} />
            </Route>
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/appointments" element={<AppointmentManagement />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App
