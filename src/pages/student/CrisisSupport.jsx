import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Phone, Heart, Shield, MessageCircle, Users,
  Clock, MapPin, ExternalLink, ChevronRight, X, CheckCircle
} from 'lucide-react'
import CrisisBanner from '../../components/crisis/CrisisBanner.jsx'
import CrisisResources from '../../components/crisis/CrisisResources.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import { getCalmingTechniques, getUniversityCounseling } from '../../services/firestoreService.js'

const CrisisSupport = () => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('inhale')
  const [breathingActive, setBreathingActive] = useState(false)
  const [counselingCenter, setCounselingCenter] = useState(null)
  const [selfHelpTechniques, setSelfHelpTechniques] = useState([])

  useEffect(() => {
    const loadCrisisData = async () => {
      try {
        const [center, techniques] = await Promise.all([
          getUniversityCounseling(),
          getCalmingTechniques(),
        ])
        setCounselingCenter(center)
        setSelfHelpTechniques(techniques)
      } catch (error) {
        showToast.error(error.message || 'Failed to load crisis support data')
        setCounselingCenter(null)
        setSelfHelpTechniques([])
      }
    }

    loadCrisisData()
  }, [])

  const startBreathing = () => {
    setBreathingActive(true)
    setBreathingPhase('inhale')

    const cycle = () => {
      setBreathingPhase('inhale')
      setTimeout(() => {
        setBreathingPhase('hold')
        setTimeout(() => {
          setBreathingPhase('exhale')
          setTimeout(() => {
            if (breathingActive) cycle()
          }, 4000)
        }, 4000)
      }, 4000)
    }
    cycle()
  }

  const stopBreathing = () => {
    setBreathingActive(false)
    setBreathingPhase('inhale')
  }

  const techniqueIcons = {
    breathing: Heart,
    grounding: Shield,
    relaxation: Users,
    affirmation: MessageCircle,
  }

  const runTechnique = (technique) => {
    if (technique.actionType === 'breathing') {
      setShowBreathingExercise(true)
      return
    }

    showToast.info(technique.prompt || technique.description || 'Take a moment to care for yourself.')
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Crisis Support</h1>
            <p className="page-subtitle">Immediate help and resources when you need them most</p>
          </motion.div>

          {/* Crisis Banner */}
          <CrisisBanner />

          {/* Emergency Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="w-full bg-gradient-to-r from-crisis-500 to-crisis-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold">988 Crisis Support</h2>
                  <p className="text-crisis-100">One-click access to suicide and crisis lifeline</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Crisis Resources */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Emergency Resources
                </h2>
                <CrisisResources />
              </motion.div>

              {/* University Counseling Info */}
              {counselingCenter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card mt-8 border-2 border-primary-200 dark:border-primary-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{counselingCenter.name}</h2>
                    <p className="text-sm text-gray-500">On-campus support for students</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary-500" />
                      <span>{counselingCenter.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span>{counselingCenter.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>{counselingCenter.hours}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${counselingCenter.phone?.replace(/\D/g, '') || ''}`}
                      className="btn-primary text-sm py-2.5"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${counselingCenter.email}`}
                      className="btn-outline text-sm py-2.5"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </div>
                </div>
              </motion.div>
              )}
            </div>

            {/* Right - Self-Help Techniques */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Calming Techniques
                </h2>
                <div className="space-y-3">
                  {selfHelpTechniques.map((technique, index) => (
                    (() => {
                      const Icon = techniqueIcons[technique.icon] || Heart
                      return (
                    <motion.button
                      key={technique.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => runTechnique(technique)}
                      className="w-full card text-left hover:shadow-soft-lg transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${technique.color || 'bg-primary-50 text-primary-600'} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">{technique.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{technique.description}</p>
                        </div>
                      </div>
                    </motion.button>
                      )
                    })()
                  ))}
                  {selfHelpTechniques.length === 0 && (
                    <div className="card text-sm text-gray-500 dark:text-gray-400">
                      No calming techniques available yet.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Safety Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card mt-6 bg-gradient-to-br from-calm-50 to-primary-50 dark:from-calm-900/20 dark:to-primary-900/20"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Create a Safety Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  A safety plan helps you identify warning signs, coping strategies, and support contacts 
                  before a crisis occurs.
                </p>
                <button className="w-full btn-primary text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Start Safety Plan
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency Modal */}
      <Modal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        title="Emergency Support"
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-crisis-100 dark:bg-crisis-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-crisis-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Are you in immediate danger?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            If you or someone you know is in immediate danger, please call emergency services.
          </p>
          <div className="space-y-3">
            <a
              href="tel:988"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-crisis-600 text-white rounded-xl font-semibold hover:bg-crisis-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call 988 Suicide & Crisis Lifeline
            </a>
            <a
              href="tel:911"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-crisis-700 text-white rounded-xl font-semibold hover:bg-crisis-800 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call 911 Emergency
            </a>
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors"
            >
              I am not in immediate danger
            </button>
          </div>
        </div>
      </Modal>

      {/* Breathing Exercise Modal */}
      <Modal
        isOpen={showBreathingExercise}
        onClose={() => {
          stopBreathing()
          setShowBreathingExercise(false)
        }}
        title="Box Breathing Exercise"
        size="md"
      >
        <div className="text-center py-8">
          <motion.div
            animate={{
              scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 1,
              opacity: breathingPhase === 'hold' ? 0.8 : 1,
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-primary-200 dark:bg-primary-800/30 flex items-center justify-center">
              <Heart className={`w-10 h-10 text-primary-600 ${breathingActive ? 'animate-pulse' : ''}`} />
            </div>
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
            {breathingPhase}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
            {breathingPhase === 'hold' && 'Hold your breath...'}
            {breathingPhase === 'exhale' && 'Breathe out slowly through your mouth...'}
          </p>

          {!breathingActive ? (
            <button onClick={startBreathing} className="btn-primary">
              Start Exercise
            </button>
          ) : (
            <button onClick={stopBreathing} className="btn-ghost">
              Stop
            </button>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default CrisisSupport
