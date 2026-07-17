// src/pages/admin/UsersManagement.jsx - COMPLETE UPDATED VERSION WITH SUPER ADMIN
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// add to the react-icons import
import { FaUser, FaEnvelope, FaPhone, FaCrown, FaUserCircle, FaSearch, FaFilter, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaShieldAlt ,FaBan, FaStore ,FaUserCheck} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UsersManagement = () => {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin'
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin or super admin
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      navigate('/signin');
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      
      const usersData = response.data?.data || response.data || [];
      
      if (!Array.isArray(usersData)) {
        console.error('Users data is not an array:', usersData);
        setUsers([]);
        return;
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
 const handleToggleSuspend = async (targetUser) => {
  const action = targetUser.isSuspended ? 'reactivate' : 'suspend';
  if (!window.confirm(`Are you sure you want to ${action} ${targetUser.name || 'this user'}?`)) {
    return;
  }
  try {
    await api.put(`/users/${targetUser._id}`, {
      isSuspended: !targetUser.isSuspended,
    });
    fetchUsers();
  } catch (error) {
    console.error('Error updating suspension status:', error);
    alert('Failed to update suspension status: ' + (error.response?.data?.message || error.message));
  }
};
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
  try {
    await api.put(`/users/${editingUser._id}`, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      isVerified: editingUser.isVerified,
      isSuspended: editingUser.isSuspended,
      department: editingUser.role === 'admin' ? (editingUser.department || null) : null,
    });
    setEditingUser(null);
    fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user: ' + (error.response?.data?.message || error.message));
  }
};

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreatingAdmin(true);
      const response = await api.post('/auth/register', {
        ...newAdmin,
        role: 'admin'
      });
      
      if (response.data.success) {
        alert('Admin created successfully!');
        setShowCreateAdminModal(false);
        setNewAdmin({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'admin'
        });
        fetchUsers(); // Refresh user list
      } else {
        alert(response.data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'verified' ? user.isVerified : !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
              <p className="text-gray-600 mt-1">Manage all registered users</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              {/* Create New Admin Button - Only for Super Admin */}
              {isSuperAdmin && (
                <button
                  onClick={() => setShowCreateAdminModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaCrown />
                  Create New Admin
                </button>
              )}
              <span className="text-gray-600">
                Total: {users.length} users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none text-gray-900 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="dealer">Dealer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="not-verified">Not Verified</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-gray-600">
                Showing {filteredUsers.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
  user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
  user.role === 'super_admin' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
  user.role === 'dealer' ? 'bg-gradient-to-r from-green-500 to-green-600' :
  'bg-gradient-to-r from-blue-500 to-blue-600'
}`}>
  {user.role === 'admin' && <FaShieldAlt className="text-white" />}
  {user.role === 'super_admin' && <FaCrown className="text-white" />}
  {user.role === 'dealer' && <FaStore className="text-white" />}
  {user.role === 'customer' && <FaUserCircle className="text-white" />}
</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id?.substring(0, 8) || 'N/A'}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email || 'No Email'}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaPhone className="text-gray-400 text-xs" />
                        {user.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
  user.role === 'super_admin' ? 'bg-yellow-100 text-yellow-800' :
  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
  user.role === 'dealer' ? 'bg-green-100 text-green-800' :
  'bg-blue-100 text-blue-800'
}`}>
  {user.role === 'super_admin' ? 'Super Admin' :
   user.role === 'admin' ? 'Administrator' :
   user.role === 'dealer' ? 'Dealer' :
   'Customer'}
</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isVerified ? (
                          <>
                            <FaCheckCircle />
                            Verified
                          </>
                        ) : (
                          <>
                            <FaTimesCircle />
                            Not Verified
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
  {(user.role !== 'super_admin' || isSuperAdmin) && (
    <button
      onClick={() => setEditingUser(user)}
      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
      title="Edit User"
    >
      <FaEdit />
    </button>
  )}

  {user._id !== currentUser._id &&
   user.role !== 'super_admin' &&
   (isSuperAdmin || user.role !== 'admin') && (
    <button
      onClick={() => handleToggleSuspend(user)}
      className={`p-2 rounded-lg ${
        user.isSuspended
          ? 'text-green-600 hover:text-green-900 hover:bg-green-50'
          : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
      }`}
      title={user.isSuspended ? 'Reactivate User' : 'Suspend User'}
    >
      {user.isSuspended ? <FaUserCheck /> : <FaBan />}
    </button>
  )}

  {user._id !== currentUser._id && user.role !== 'super_admin' && (
    <button
      onClick={() => setDeleteConfirm(user._id)}
      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
      title="Delete User"
    >
      <FaTrash />
    </button>
  )}
</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
              <p className="text-gray-500">
                {users.length === 0 
                  ? "No users registered yet."
                  : "No users match your search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? All their bookings and data will be removed.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Full Name
  </label>
  <input
    type="text"
    value={editingUser.name || ''}
    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
    disabled={!isSuperAdmin}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
  />
  {!isSuperAdmin && (
    <p className="text-xs text-gray-400 mt-1">Only Super Admin can edit name</p>
  )}
</div>

              {/* Email */}
              <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Email Address
  </label>
  <input
    type="email"
    value={editingUser.email || ''}
    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
    disabled={!isSuperAdmin}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
  />
  {!isSuperAdmin && (
    <p className="text-xs text-gray-400 mt-1">Only Super Admin can edit email</p>
  )}
</div>

              {/* Phone */}
              <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Phone Number
  </label>
  <input
    type="tel"
    value={editingUser.phone || ''}
    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
    disabled={!isSuperAdmin}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
  />
  {!isSuperAdmin && (
    <p className="text-xs text-gray-400 mt-1">Only Super Admin can edit phone number</p>
  )}
</div>

              {/* Role — only super_admin can change roles */}
              <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
  <select
    value={editingUser.role || 'customer'}
    onChange={(e) => setEditingUser({
      ...editingUser,
      role: e.target.value,
      department: e.target.value === 'admin' ? editingUser.department : null
    })}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
    disabled={editingUser.role === 'super_admin' || !isSuperAdmin}
  >
    <option value="customer">Customer</option>
    <option value="dealer">Dealer</option>
    <option value="admin">Administrator</option>
    {editingUser.role === 'super_admin' && (
      <option value="super_admin">Super Admin</option>
    )}
  </select>
  {!isSuperAdmin && (
    <p className="text-xs text-gray-400 mt-1">Only Super Admin can change roles</p>
  )}
</div>


              {/* Department — only shown & editable when role is admin, only by super_admin */}
{editingUser.role === 'admin' && (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Department
      {isSuperAdmin && (
        <span className="ml-2 text-xs text-purple-600 font-normal">
          (Visible on admin's profile page)
        </span>
      )}
    </label>
    <select
      value={editingUser.department || ''}
      onChange={(e) => setEditingUser({
        ...editingUser,
        department: e.target.value || null
      })}
      disabled={!isSuperAdmin}
      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200"
    >
      <option value="">-- No Department --</option>
      <option value="Operations">Operations</option>
      <option value="Management">Management</option>
      <option value="Customer Service">Customer Service</option>
      <option value="Fleet Management">Fleet Management</option>
      <option value="Finance">Finance</option>
      <option value="IT Support">IT Support</option>
      <option value="Marketing">Marketing</option>
    </select>
    <p className="text-xs text-gray-400 mt-1">
      {isSuperAdmin
        ? "This will appear on the admin's profile page"
        : "Only Super Admin can edit department"}
    </p>
  </div>
)}

              {/* Verification Status */}
              {/* Verification Status — admins & super admins can both toggle */}
<div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Verification Status
  </label>
  <div className="flex items-center gap-4">
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      editingUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {editingUser.isVerified ? 'Verified' : 'Not Verified'}
    </span>
    <button
      type="button"
      onClick={() => setEditingUser({ ...editingUser, isVerified: !editingUser.isVerified })}
      className={`px-3 py-1 text-xs rounded ${
        editingUser.isVerified
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      {editingUser.isVerified ? 'Mark as Not Verified' : 'Mark as Verified'}
    </button>
  </div>
</div>
                {/* Suspension Status */}
{editingUser.role !== 'super_admin' && (isSuperAdmin || editingUser.role !== 'admin') && (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Account Status
    </label>
    <div className="flex items-center gap-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        editingUser.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {editingUser.isSuspended ? 'Suspended' : 'Active'}
      </span>
      <button
        type="button"
        onClick={() => setEditingUser({ ...editingUser, isSuspended: !editingUser.isSuspended })}
        className={`px-3 py-1 text-xs rounded ${
          editingUser.isSuspended
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        {editingUser.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
      </button>
    </div>
    {editingUser.isSuspended && (
      <p className="text-xs text-red-500 mt-1">
        This {editingUser.role === 'dealer' ? 'dealer' : 'user'} will be blocked from signing in.
      </p>
    )}
  </div>
)}
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                onClick={() => setEditingUser(null)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Admin Modal - Only for Super Admin */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Create New Admin</h3>
                <p className="text-gray-600 text-sm mt-1">Add a new administrator to the system</p>
              </div>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  placeholder="Enter admin's full name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                />
              </div>

              {/* Role Display */}
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-800">
                  <FaCrown />
                  <span className="text-sm font-medium">Role: Administrator</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Admins can manage users, bookings, and view all system data
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={creatingAdmin}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creatingAdmin ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaCrown />
                    Create Admin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;