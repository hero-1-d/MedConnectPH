import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, Mail, Lock, User, GraduationCap, Stethoscope, Shield, ArrowRight, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ADMIN_EMAIL, registerUser, signInWithGoogle } from '../../services/authService.js'
import { showToast } from '../../components/ui/Toast.jsx'
import { SPECIALIZATIONS } from '../../utils/constants.js'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student')
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const password = watch('password', '')
  const email = watch('email', '')
  const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const selectedRole = isAdminEmail ? 'admin' : role
      const additionalData = {
        studentNumber: data.studentNumber,
        course: data.course,
        specialization: data.specialization,
        bio: data.bio,
      }

      const result = await registerUser(data.email, data.password, data.name, selectedRole, additionalData)
      showToast.success('Account created successfully!')

      if (result.userData?.role === 'admin') navigate('/admin')
      else if (result.userData?.role === 'doctor') navigate('/doctor/dashboard')
      else navigate('/student/dashboard')
    } catch (error) {
      showToast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signInWithGoogle(role)
      showToast.success('Welcome!')
      if (result.userData?.role === 'admin') navigate('/admin')
      else if (result.userData?.role === 'doctor') navigate('/doctor/dashboard')
      else navigate('/student/dashboard')
    } catch (error) {
      showToast.error(error.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mental-health flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">MindConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Join our mental health community</p>
        </div>

        <div className="card">
          {/* Role Selection */}
          {!isAdminEmail && <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { value: 'student', label: 'Student', icon: GraduationCap },
              { value: 'doctor', label: 'Doctor', icon: Stethoscope },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  role === r.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                }`}
              >
                <r.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{r.label}</span>
              </button>
            ))}
          </div>}

          {isAdminEmail && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">This email will be created as the MindConnect admin account.</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-crisis-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } })}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@university.edu"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-crisis-500">{errors.email.message}</p>}
            </div>

            {role === 'student' && !isAdminEmail && (
              <>
                <div>
                  <label className="label" htmlFor="studentNumber">Student Number</label>
                  <input
                    id="studentNumber"
                    type="text"
                    {...register('studentNumber', { required: 'Student number is required' })}
                    className={`input ${errors.studentNumber ? 'input-error' : ''}`}
                    placeholder="ST2024001"
                  />
                  {errors.studentNumber && <p className="mt-1 text-sm text-crisis-500">{errors.studentNumber.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="course">Course / Major</label>
                  <input
                    id="course"
                    type="text"
                    {...register('course', { required: 'Course is required' })}
                    className={`input ${errors.course ? 'input-error' : ''}`}
                    placeholder="Computer Science"
                  />
                  {errors.course && <p className="mt-1 text-sm text-crisis-500">{errors.course.message}</p>}
                </div>
              </>
            )}

            {role === 'doctor' && !isAdminEmail && (
              <>
                <div>
                  <label className="label" htmlFor="specialization">Specialization</label>
                  <select
                    id="specialization"
                    {...register('specialization', { required: 'Specialization is required' })}
                    className={`input ${errors.specialization ? 'input-error' : ''}`}
                  >
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.specialization && <p className="mt-1 text-sm text-crisis-500">{errors.specialization.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    className="input min-h-[80px] resize-none"
                    placeholder="Brief description of your experience and approach..."
                    rows={3}
                  />
                </div>
              </>
            )}

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-crisis-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-crisis-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                {...register('terms', { required: 'You must agree to the terms' })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-sm text-crisis-500">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default RegisterPage
