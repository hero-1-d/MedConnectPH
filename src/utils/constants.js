// App constants
export const APP_NAME = 'MindConnect'
export const APP_TAGLINE = 'Your Mental Health & Wellness Partner'

// User roles
export const ROLES = {
  STUDENT: 'student',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
}

// Appointment statuses
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Appointment status colors
export const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  approved: { bg: 'bg-wellness-100', text: 'text-wellness-800', border: 'border-wellness-200' },
  rejected: { bg: 'bg-crisis-100', text: 'text-crisis-800', border: 'border-crisis-200' },
  completed: { bg: 'bg-primary-100', text: 'text-primary-800', border: 'border-primary-200' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
}

// Mood options
export const MOOD_OPTIONS = [
  { value: 'excellent', label: 'Excellent', emoji: '😄', score: 5 },
  { value: 'good', label: 'Good', emoji: '🙂', score: 4 },
  { value: 'okay', label: 'Okay', emoji: '😐', score: 3 },
  { value: 'bad', label: 'Bad', emoji: '😕', score: 2 },
  { value: 'terrible', label: 'Terrible', emoji: '😢', score: 1 },
]

// Resource categories
export const RESOURCE_CATEGORIES = [
  { value: 'anxiety', label: 'Anxiety & Stress', icon: 'Brain' },
  { value: 'depression', label: 'Depression', icon: 'CloudRain' },
  { value: 'mindfulness', label: 'Mindfulness', icon: 'Flower2' },
  { value: 'sleep', label: 'Sleep Health', icon: 'Moon' },
  { value: 'selfcare', label: 'Self-Care', icon: 'Heart' },
  { value: 'academic', label: 'Academic Stress', icon: 'BookOpen' },
  { value: 'social', label: 'Social Anxiety', icon: 'Users' },
  { value: 'crisis', label: 'Crisis Resources', icon: 'AlertTriangle' },
]

// Specializations
export const SPECIALIZATIONS = [
  'General Counseling',
  'Anxiety & Depression',
  'Trauma & PTSD',
  'Substance Abuse',
  'Family Therapy',
  'Academic Counseling',
  'Career Counseling',
  'Crisis Intervention',
  'LGBTQ+ Support',
  'Eating Disorders',
]

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  OPTIONS: [10, 25, 50, 100],
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
}
