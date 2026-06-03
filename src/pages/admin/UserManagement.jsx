import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, MoreHorizontal, Shield, GraduationCap,
  Stethoscope, UserCheck, UserX, Edit, Trash2, ChevronLeft, ChevronRight,
  Plus, X, Check, Loader2, Mail, Phone
} from 'lucide-react'
import { showToast } from '../../components/ui/Toast.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import Sidebar from '../../components/layouts/Sidebar.jsx'
import Navbar from '../../components/layouts/Navbar.jsx'
import { getInitials, getAvatarColor } from '../../utils/helpers.js'
import { getDocuments, updateDocument, deleteDocument } from '../../services/firestoreService.js'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editForm, setEditForm] = useState({ role: 'student', isActive: true })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getDocuments('users')
      setUsers(data)
      setFilteredUsers(data)
      } catch (error) {
        showToast.error(error.message || 'Failed to load users')
      } finally {
      setLoading(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    let filtered = users
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.isActive === (statusFilter === 'active'))
    }
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchQuery, roleFilter, statusFilter, users])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleToggleStatus = async (userId) => {
    const target = users.find(u => u.id === userId)
    if (!target) return

    try {
      await updateDocument('users', userId, { isActive: !target.isActive })
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ))
      showToast.success('User status updated')
    } catch (error) {
      showToast.error(error.message || 'Failed to update user')
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setEditForm({
      role: user.role || 'student',
      isActive: user.isActive !== false,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return

    setSaving(true)
    try {
      const updates = {
        role: editForm.role,
        isActive: editForm.isActive,
      }

      await updateDocument('users', selectedUser.id, updates)
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id ? { ...u, ...updates } : u
      ))
      showToast.success('User updated successfully')
      setShowEditModal(false)
    } catch (error) {
      showToast.error(error.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteDocument('users', selectedUser.id)
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      showToast.success('User deleted successfully')
      setShowDeleteModal(false)
    } catch (error) {
      showToast.error('Failed to delete user')
    } finally {
      setSaving(false)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-4 h-4" />
      case 'doctor': return <Stethoscope className="w-4 h-4" />
      case 'admin': return <Shield className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
      case 'doctor': return 'bg-wellness-50 text-wellness-700 dark:bg-wellness-900/20 dark:text-wellness-400'
      case 'admin': return 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16">
        <div className="dashboard-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage all platform users</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search users by name or email..."
              className="flex-1"
            />
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="input px-4 py-2 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input px-4 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card overflow-hidden"
          >
            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group"
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(user.name)}`}>
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                user.isActive
                                  ? 'bg-wellness-100 text-wellness-700 dark:bg-wellness-900/20 dark:text-wellness-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                              {user.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td>
                            <span className="text-sm text-gray-500">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                                className="p-2 rounded-lg text-gray-400 hover:text-crisis-600 hover:bg-crisis-50 dark:hover:bg-crisis-900/20 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredUsers.length}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </motion.div>

          {/* Edit Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit User"
            size="md"
          >
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(selectedUser.name)}`}>
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    className="input"
                    value={editForm.role}
                    onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="student">Student</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input"
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={e => setEditForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 btn-ghost">Cancel</button>
                  <button onClick={handleSaveEdit} disabled={saving} className="flex-1 btn-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete User"
            size="sm"
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-crisis-100 dark:bg-crisis-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-crisis-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete {selectedUser?.name}?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. All user data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-ghost">Cancel</button>
                <button onClick={handleDelete} disabled={saving} className="flex-1 btn-danger">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete User'}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  )
}

export default UserManagement
