import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Video, ExternalLink, Clock, Tag } from 'lucide-react'

const ResourceCard = ({ resource }) => {
  const typeIcons = {
    article: <BookOpen className="w-5 h-5" />,
    video: <Video className="w-5 h-5" />,
    guide: <BookOpen className="w-5 h-5" />,
  }

  const typeColors = {
    article: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
    video: 'bg-crisis-50 text-crisis-600 dark:bg-crisis-900/20 dark:text-crisis-400',
    guide: 'bg-wellness-50 text-wellness-600 dark:bg-wellness-900/20 dark:text-wellness-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover"
    >
      {resource.image && (
        <div className="relative h-40 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
          <img
            src={resource.image}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${typeColors[resource.type] || typeColors.article}`}>
              {typeIcons[resource.type] || typeIcons.article}
              {resource.type?.charAt(0).toUpperCase() + resource.type?.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        {!resource.image && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[resource.type] || typeColors.article}`}>
            {typeIcons[resource.type] || typeIcons.article}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {resource.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {resource.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
        {resource.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{resource.readTime || '5 min read'}</span>
        </div>
        <a
          href={resource.url || '#'}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
        >
          Read More
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  )
}

export default ResourceCard
