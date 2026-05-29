/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format date and time together
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  return `${formatDate(date)} at ${formatTime(date)}`
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const d = date instanceof Date ? date : new Date(date)
  const diffInSeconds = Math.floor((now - d) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(date)
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Generate random color for avatar
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-calm-500',
    'bg-wellness-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
  ]
  const index = name?.charCodeAt(0) % colors.length || 0
  return colors[index]
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate password strength
 */
export const getPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Sleep/delay utility
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    result[group] = result[group] || []
    result[group].push(item)
    return result
  }, {})
}

/**
 * Sort array by date
 */
export const sortByDate = (array, key = 'createdAt', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key])
    const dateB = new Date(b[key])
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Filter array by search query
 */
export const filterByQuery = (array, query, keys) => {
  if (!query) return array
  const lowerQuery = query.toLowerCase()
  return array.filter(item =>
    keys.some(key =>
      String(item[key]).toLowerCase().includes(lowerQuery)
    )
  )
}

/**
 * Generate time slots for appointments
 */
export const generateTimeSlots = (startHour = 8, endHour = 17, interval = 30) => {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
      slots.push({ value: time, label: displayTime })
    }
  }
  return slots
}

/**
 * Get mood emoji and color
 */
export const getMoodData = (mood) => {
  const moods = {
    excellent: { emoji: '😄', color: 'bg-wellness-100 text-wellness-700', label: 'Excellent' },
    good: { emoji: '🙂', color: 'bg-primary-100 text-primary-700', label: 'Good' },
    okay: { emoji: '😐', color: 'bg-yellow-100 text-yellow-700', label: 'Okay' },
    bad: { emoji: '😕', color: 'bg-orange-100 text-orange-700', label: 'Bad' },
    terrible: { emoji: '😢', color: 'bg-crisis-100 text-crisis-700', label: 'Terrible' },
  }
  return moods[mood] || { emoji: '😐', color: 'bg-gray-100 text-gray-700', label: 'Unknown' }
}

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
