import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('mindconnect-darkmode')
    return saved ? JSON.parse(saved) : false
  })

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('mindconnect-highcontrast')
    return saved ? JSON.parse(saved) : false
  })

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('mindconnect-fontsize')
    return saved || 'normal'
  })

  useEffect(() => {
    localStorage.setItem('mindconnect-darkmode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('mindconnect-highcontrast', JSON.stringify(highContrast))
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem('mindconnect-fontsize', fontSize)
    document.documentElement.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : 
      fontSize === 'x-large' ? '20px' : '16px'
  }, [fontSize])

  const toggleDarkMode = () => setDarkMode(prev => !prev)
  const toggleHighContrast = () => setHighContrast(prev => !prev)

  const value = {
    darkMode,
    toggleDarkMode,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
