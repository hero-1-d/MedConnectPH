import React from 'react'
import { toast } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

export const showToast = {
  success: (message) => {
    toast.success(message, {
      icon: <CheckCircle className="w-5 h-5 text-wellness-500" />,
    })
  },
  error: (message) => {
    toast.error(message, {
      icon: <XCircle className="w-5 h-5 text-crisis-500" />,
    })
  },
  warning: (message) => {
    toast(message, {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      style: {
        background: '#fefce8',
        color: '#854d0e',
        border: '1px solid #fef08a',
      },
    })
  },
  info: (message) => {
    toast(message, {
      icon: <Info className="w-5 h-5 text-primary-500" />,
      style: {
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
    })
  },
}

export default showToast
