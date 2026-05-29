import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Clock, ExternalLink, Heart, MessageCircle, Users, Shield } from 'lucide-react'
import { showToast } from '../ui/Toast.jsx'
import { getCrisisResources, getUniversityCounseling } from '../../services/firestoreService.js'

const CrisisResources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [crisisResources, counselingCenter] = await Promise.all([
          getCrisisResources(),
          getUniversityCounseling(),
        ])

        setResources([
          ...crisisResources,
          ...(counselingCenter ? [{
            name: counselingCenter.name,
            phone: counselingCenter.phone,
            description: counselingCenter.description || 'On-campus mental health support and counseling services.',
            available: counselingCenter.hours,
            isUniversity: true,
          }] : []),
        ])
      } catch (error) {
        showToast.error(error.message || 'Failed to load crisis resources')
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [])

  const getIcon = (name) => {
    if (name.includes('Text')) return <MessageCircle className="w-6 h-6" />
    if (name.includes('Sexual')) return <Shield className="w-6 h-6" />
    if (name.includes('Trevor') || name.includes('LGBTQ')) return <Users className="w-6 h-6" />
    if (name.includes('University')) return <Heart className="w-6 h-6" />
    return <Phone className="w-6 h-6" />
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(item => (
          <div key={item} className="card animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="card text-center py-10">
        <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No crisis resources available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`card ${resource.isUniversity ? 'border-2 border-primary-200 dark:border-primary-800' : ''}`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              resource.isUniversity 
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'bg-crisis-50 text-crisis-600 dark:bg-crisis-900/20 dark:text-crisis-400'
            }`}>
              {getIcon(resource.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {resource.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {resource.description}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <a 
                href={`tel:${resource.phone.replace(/\D/g, '')}`}
                className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                {resource.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{resource.available}</span>
            </div>
          </div>

          <a
            href={`tel:${resource.phone.replace(/\D/g, '')}`}
            className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              resource.isUniversity
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-crisis-50 text-crisis-700 hover:bg-crisis-100 dark:bg-crisis-900/20 dark:text-crisis-400'
            }`}
          >
            <Phone className="w-4 h-4" />
            Call Now
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        </motion.div>
      ))}
    </div>
  )
}

export default CrisisResources
