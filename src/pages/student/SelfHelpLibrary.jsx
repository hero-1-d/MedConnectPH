import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Video, Search, Filter, Heart, Brain, CloudRain,
  Flower2, Moon, Activity, Users, AlertTriangle, Bookmark,
  Play, Clock, ChevronRight, Sparkles
} from 'lucide-react'
import { RESOURCE_CATEGORIES } from '../../utils/constants.js'
import ResourceCard from '../../components/resources/ResourceCard.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { showToast } from '../../components/ui/Toast.jsx'
import { getResourcesForLibrary } from '../../services/firestoreService.js'

const categoryIcons = {
  anxiety: Brain,
  depression: CloudRain,
  mindfulness: Flower2,
  sleep: Moon,
  selfcare: Heart,
  academic: Activity,
  social: Users,
  crisis: AlertTriangle,
}

const SelfHelpLibrary = () => {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [savedResources, setSavedResources] = useState([])
  const featuredResource = resources.find(resource => resource.featured)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const resourceData = await getResourcesForLibrary()
        setResources(resourceData)
        setFilteredResources(resourceData)
      } catch (error) {
        showToast.error(error.message || 'Failed to load resources')
        setResources([])
        setFilteredResources([])
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [])

  useEffect(() => {
    let filtered = resources
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType)
    }
    setFilteredResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, resources])

  const toggleSave = (resourceId) => {
    setSavedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">Self-Help Library</h1>
            <p className="page-subtitle">Explore articles, videos, and guides for your mental wellness</p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search resources..."
              className="flex-1"
            />
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="input px-4 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="guide">Guides</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              All Resources
            </button>
            {RESOURCE_CATEGORIES.map(cat => {
              const Icon = categoryIcons[cat.value] || BookOpen
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ResourceCard resource={resource} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Featured Section */}
          {!loading && selectedCategory === 'all' && !searchQuery && featuredResource && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recommended for You</h2>
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-100 dark:border-primary-800">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-4">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {featuredResource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {featuredResource.description}
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {featuredResource.readTime || '5 min read'}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        {featuredResource.type || 'Resource'}
                      </span>
                    </div>
                    <a href={featuredResource.url || '#'} className="btn-primary">
                      Read Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                  <div className="relative">
                    {featuredResource.image && (
                      <img
                        src={featuredResource.image}
                        alt={featuredResource.title}
                        className="rounded-2xl shadow-lg w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SelfHelpLibrary
