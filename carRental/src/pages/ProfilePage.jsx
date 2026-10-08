// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaArrowLeft, FaCheckCircle, FaCrown, FaShieldAlt, FaBuilding, FaIdCard, FaLock } from 'react-icons/fa';
import toast from '../utils/toast';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isVerified: false,
    department: '',
    dealerStatus: '',
    dealerProfile: {
      businessName: '',
      city: '',
      documentsUrl: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    driverLicense: {
      number: '',
      expiryDate: '',
      imageUrl: ''
    }
  });

  // Check if user is admin or super admin
  const isAdmin = profileData.role === 'admin' || profileData.role === 'super_admin';
  const isDealer = profileData.role === 'dealer';
  const isSuperAdmin = profileData.role === 'super_admin';
  const isCurrentUserSuperAdmin = user?.role === 'super_admin';

  // Determine what fields are editable
  const canEditRole = isCurrentUserSuperAdmin;
  const canEditDepartment = isCurrentUserSuperAdmin;

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      setFetching(true);
      const response = await api.get('/auth/me');
      const userData = response.data?.user || response.data;
      
      if (userData) {
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'customer',
          isVerified: userData.isVerified || false,
          department: userData.department || '',
          dealerStatus: userData.dealerStatus || '',
          dealerProfile: userData.dealerProfile || {
            businessName: '',
            city: '',
            documentsUrl: ''
          },
          address: userData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          driverLicense: userData.driverLicense || {
            number: '',
            expiryDate: '',
            imageUrl: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      };
      
      // Only super admin can update role and department
      if (isCurrentUserSuperAdmin) {
        if (profileData.role !== user?.role) {
          updateData.role = profileData.role;
        }
        if (profileData.department !== user?.department) {
          updateData.department = profileData.department;
        }
      }
      
      // Add driver license if provided (for customers)
      if (profileData.driverLicense?.number) {
        updateData.driverLicense = profileData.driverLicense;
      }
      if (isDealer) {
        updateData.dealerProfile = profileData.dealerProfile;
      }
      
      const response = await api.put('/auth/profile', updateData);
      
      if (response.data.success) {
         await fetchUserProfile();

        if (updateUser) {
    updateUser(response.data.user || {
      ...user,
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address,
      department: profileData.department,
      role: profileData.role,
      dealerStatus: profileData.dealerStatus,
      dealerProfile: profileData.dealerProfile,
    });
  }
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        await fetchUserProfile();
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = () => {
    if (profileData.role === 'super_admin') {
      return {
        label: 'Super Administrator',
        icon: <FaCrown className="text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Full system access with all privileges'
      };
    } else if (profileData.role === 'admin') {
      return {
        label: 'Administrator',
        icon: <FaShieldAlt className="text-purple-600" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        description: 'Can manage users, cars, and bookings'
      };
    } else if (profileData.role === 'dealer') {
      return {
        label: 'Rental Dealer',
        icon: <FaBuilding className="text-orange-600" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'Can list and manage rental cars after approval'
      };
    } else {
      return {
        label: 'Customer',
        icon: <FaUser className="text-blue-600" />,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Can rent cars and manage personal bookings'
      };
    }
  };

  const getDashboardLink = () => {
    if (isAdmin) {
      return '/admin/dashboard';
    }
    if (isDealer) {
      return '/dealer/dashboard';
    }
    return '/dashboard';
  };

  const roleInfo = getRoleDisplay();

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(getDashboardLink())}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-white ${
            profileData.role === 'super_admin' 
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700'
              : profileData.role === 'admin' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                : profileData.role === 'dealer'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  {profileData.role === 'super_admin' ? <FaCrown className="text-2xl" /> : 
                   profileData.role === 'admin' ? <FaShieldAlt className="text-2xl" /> : 
                   profileData.role === 'dealer' ? <FaBuilding className="text-2xl" /> :
                   <FaUser className="text-2xl" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">My Profile</h1>
                  <p className="text-white/90 mt-1">Manage your account information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 backdrop-blur-sm"
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing || loading}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Email - Disabled field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {profileData.isVerified ? (
                        <FaCheckCircle className="text-green-500" title="Verified Email" />
                      ) : (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Email not verified" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing || loading}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Account Type
                    {!canEditRole && isEditing && (
                      <span className="ml-2 text-xs text-gray-400 inline-flex items-center gap-1">
                        <FaLock size={10} /> Cannot edit
                      </span>
                    )}
                  </label>
                  
                  {canEditRole && isEditing ? (
                    <div className="relative">
                      <select
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        disabled={!isEditing || loading}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                        <option value="super_admin">Super Administrator</option>
                      </select>
                      <p className="text-xs text-yellow-600 mt-1">
                        You have super admin privileges to change roles
                      </p>
                    </div>
                  ) : (
                    <div className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${roleInfo.color}`}>
                      {roleInfo.icon}
                      <span className="font-semibold">{roleInfo.label}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{roleInfo.description}</p>
                </div>

                {/* Department — shown for admin role users, read-only on their own profile */}
                {profileData.role === 'admin' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FaBuilding className="inline mr-2 text-gray-400" />
                      Department
                      <span className="ml-2 text-xs text-gray-400 inline-flex items-center gap-1">
                        <FaLock size={10} /> Assigned by Super Admin
                      </span>
                    </label>
                    <div className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${
                      profileData.department
                        ? 'bg-purple-50 border-purple-200 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                      <FaBuilding className={profileData.department ? 'text-purple-500' : 'text-gray-300'} />
                      <span className={profileData.department ? 'font-medium' : 'italic text-sm'}>
                        {profileData.department || 'No department assigned yet'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Contact your Super Admin to change your department assignment
                    </p>
                  </div>
                )}

                {isDealer && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Dealer Approval Status</label>
                      <div className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${
                        profileData.dealerStatus === 'verified'
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : profileData.dealerStatus === 'rejected'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}>
                        <FaCheckCircle />
                        <span className="font-semibold capitalize">{profileData.dealerStatus || 'Pending'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                      <input
                        type="text"
                        value={profileData.dealerProfile?.businessName || ''}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          dealerProfile: { ...profileData.dealerProfile, businessName: e.target.value }
                        })}
                        disabled={!isEditing || loading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' : 'bg-gray-50 border-gray-200'
                        }`}
                        placeholder="Your rental business name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Primary Operating City</label>
                      <input
                        type="text"
                        value={profileData.dealerProfile?.city || ''}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          dealerProfile: { ...profileData.dealerProfile, city: e.target.value }
                        })}
                        disabled={!isEditing || loading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' : 'bg-gray-50 border-gray-200'
                        }`}
                        placeholder="e.g., Delhi"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Business Document URL</label>
                      <input
                        type="url"
                        value={profileData.dealerProfile?.documentsUrl || ''}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          dealerProfile: { ...profileData.dealerProfile, documentsUrl: e.target.value }
                        })}
                        disabled={!isEditing || loading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' : 'bg-gray-50 border-gray-200'
                        }`}
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Address Section */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
                  {!isEditing && !profileData.address?.street && (
                    <span className="text-xs text-gray-400 ml-2">(Not provided)</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      value={profileData.address?.street || ''}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, street: e.target.value}
                      })}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.address?.city || ''}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, city: e.target.value}
                      })}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.address?.state || ''}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, state: e.target.value}
                      })}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={profileData.address?.zipCode || ''}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, zipCode: e.target.value}
                      })}
                      disabled={!isEditing || loading}
                      className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>

              {/* Driver License Section */}
              {profileData.role === 'customer' && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <FaIdCard className="text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Driver License Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">License Number</label>
                      <input
                        type="text"
                        value={profileData.driverLicense?.number || ''}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          driverLicense: {...profileData.driverLicense, number: e.target.value}
                        })}
                        disabled={!isEditing || loading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        placeholder="Enter your driver license number"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">License Expiry Date</label>
                      <input
                        type="date"
                        value={profileData.driverLicense?.expiryDate ? new Date(profileData.driverLicense.expiryDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          driverLicense: {...profileData.driverLicense, expiryDate: e.target.value}
                        })}
                        disabled={!isEditing || loading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {isEditing && (
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile();
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 ${
                      profileData.role === 'super_admin' 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                        : profileData.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                          : profileData.role === 'dealer'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(getDashboardLink())}
            className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 font-medium">Go to Dashboard</p>
            <p className="text-xs text-gray-500 mt-1">
              {isAdmin ? 'View admin dashboard' : isDealer ? 'Manage your rental cars' : 'View your bookings'}
            </p>
          </button>
          
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 font-medium">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">View and manage all users</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
