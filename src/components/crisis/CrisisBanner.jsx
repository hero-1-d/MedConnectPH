import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Phone, ExternalLink, Heart, Shield } from 'lucide-react'
import { getUniversityCounseling } from '../../services/firestoreService.js'

const CrisisBanner = () => {
  const [counselingCenter, setCounselingCenter] = useState(null)

  useEffect(() => {
    getUniversityCounseling()
      .then(setCounselingCenter)
      .catch(() => setCounselingCenter(null))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-crisis-500 to-crisis-600 rounded-2xl p-6 text-white shadow-lg mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Need Immediate Help?</h2>
          <p className="text-crisis-100 mb-4">
            If you are in crisis or having thoughts of self-harm, please reach out immediately. 
            Help is available 24/7.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:988"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-crisis-600 rounded-xl font-semibold hover:bg-crisis-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 988 Now
            </a>
            {counselingCenter?.emergency && (
              <a
                href={`tel:${counselingCenter.emergency.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-crisis-700 text-white rounded-xl font-medium hover:bg-crisis-800 transition-colors"
              >
                <Shield className="w-4 h-4" />
                University Emergency
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CrisisBanner
