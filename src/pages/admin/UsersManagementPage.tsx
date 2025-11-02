import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableCell, Modal } from '../../components/ui'
import type { Database, Json } from '../../types/supabase'
import '../../styles/admin.css'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  user_metadata?: Json
  last_sign_in_at?: string
}

const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Fetch profiles with auth user data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get auth users data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

      if (authError) throw authError

      // Combine profile and auth data
      const combinedUsers = profiles?.map(profile => {
        const authUser = authUsers.users.find(user => user.id === profile.id)
        return {
          ...profile,
          user_metadata: authUser?.user_metadata,
          last_sign_in_at: authUser?.last_sign_in_at
        }
      }) || []

      setUsers(combinedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole as 'admin' | 'editor' | 'user' } : user
      ))

      alert('User role updated successfully')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Error updating user role')
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user? This will prevent them from signing in.')) return

    try {
      // Note: This requires Supabase Admin API setup
      // For now, we'll just update their role to prevent access
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'banned' })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: 'banned' } : user
      ))

      alert('User has been banned')
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Error banning user')
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      case 'banned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Users Management</h1>
        <div className="admin-actions">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Avatar</TableCell>
              <TableCell header>Name</TableCell>
              <TableCell header>Email</TableCell>
              <TableCell header>Role</TableCell>
              <TableCell header>Last Sign In</TableCell>
              <TableCell header>Joined</TableCell>
              <TableCell header>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.email}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    options={[
                      { value: 'user', label: 'User' },
                      { value: 'editor', label: 'Editor' },
                      { value: 'admin', label: 'Admin' }
                    ]}
                    className="w-32"
                  />
                </TableCell>
                <TableCell>
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'
                  }
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowModal(true)
                    }}
                    className="mr-2"
                  >
                    View Details
                  </Button>
                  {user.role !== 'banned' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleBanUser(user.id)}
                    >
                      Ban User
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedUser(null)
        }}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedUser.avatar_url ? (
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.full_name || selectedUser.email}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-700">
                    {(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{selectedUser.full_name || 'N/A'}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Joined</label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                <p className="text-sm text-gray-600">
                  {selectedUser.last_sign_in_at
                    ? new Date(selectedUser.last_sign_in_at).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UsersManagementPage