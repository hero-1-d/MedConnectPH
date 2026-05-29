import React from 'react'
import { STATUS_COLORS } from '../../utils/constants.js'

const Badge = ({ status, children, className = '' }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
