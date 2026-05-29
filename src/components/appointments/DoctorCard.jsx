import React from 'react'
import { motion } from 'framer-motion'
import { Star, Calendar, Award, MapPin, ChevronRight } from 'lucide-react'
import { getInitials, getAvatarColor } from '../../utils/helpers.js'

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover"
    >
      <div className="flex items-start gap-4">
        {doctor.profileImage ? (
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl ${getAvatarColor(doctor.name)}`}>
            {getInitials(doctor.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{doctor.name}</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{doctor.specialization}</p>

          {doctor.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{doctor.rating}</span>
              <span className="text-xs text-gray-400">({doctor.totalReviews} reviews)</span>
            </div>
          )}
        </div>
      </div>

      {doctor.bio && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {doctor.bio}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {doctor.availability && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Available</span>
          </div>
        )}
        {doctor.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{doctor.location}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onBook?.(doctor)}
        className="mt-4 w-full btn-primary text-sm py-2.5"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book Appointment
        <ChevronRight className="w-4 h-4 ml-auto" />
      </button>
    </motion.div>
  )
}

export default DoctorCard
