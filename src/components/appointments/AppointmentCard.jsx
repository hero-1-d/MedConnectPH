import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatDate, formatTime, getInitials, getAvatarColor } from '../../utils/helpers.js'
import { STATUS_COLORS } from '../../utils/constants.js'
import Badge from '../ui/Badge.jsx'

const AppointmentCard = ({ appointment, onApprove, onReject, onCancel, onComplete, userRole }) => {
  const statusColors = STATUS_COLORS[appointment.status] || STATUS_COLORS.pending

  const isStudent = userRole === 'student'
  const isDoctor = userRole === 'doctor'

  const otherPerson = isStudent ? appointment.doctorName : appointment.studentName
  const otherPersonRole = isStudent ? 'Doctor' : 'Student'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(otherPerson)}`}>
            {getInitials(otherPerson)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{otherPerson}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{otherPersonRole}</p>
          </div>
        </div>
        <Badge status={appointment.status}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-primary-500" />
          <span>{appointment.time}</span>
        </div>
        {appointment.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>{appointment.location}</span>
          </div>
        )}
        {appointment.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FileText className="w-4 h-4 text-primary-500 mt-0.5" />
            <span className="line-clamp-2">{appointment.notes}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        {appointment.status === 'pending' && isDoctor && (
          <>
            <button
              onClick={() => onApprove?.(appointment.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-wellness-50 text-wellness-700 hover:bg-wellness-100 dark:bg-wellness-900/20 dark:text-wellness-400 text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject?.(appointment.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-crisis-50 text-crisis-700 hover:bg-crisis-100 dark:bg-crisis-900/20 dark:text-crisis-400 text-sm font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
          </>
        )}

        {appointment.status === 'approved' && (
          <>
            {isDoctor && (
              <button
                onClick={() => onComplete?.(appointment.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </button>
            )}
            <button
              onClick={() => onCancel?.(appointment.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300 text-sm font-medium transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default AppointmentCard
