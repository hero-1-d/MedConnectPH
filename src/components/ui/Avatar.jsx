import React from 'react'
import { getInitials, getAvatarColor } from '../../utils/helpers.js'

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-semibold ${className}`}
      aria-label={`Avatar for ${name || 'user'}`}
    >
      {getInitials(name)}
    </div>
  )
}

export default Avatar
