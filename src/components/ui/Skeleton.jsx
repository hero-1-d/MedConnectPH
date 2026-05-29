import React from 'react'

const Skeleton = ({ className = '', count = 1, circle = false }) => {
  const baseClass = circle 
    ? 'rounded-full' 
    : 'rounded-lg'

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${baseClass} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export default Skeleton
