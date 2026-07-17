// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaHistory, FaUser, FaCalendarAlt, FaPlus, FaCheckCircle, FaClock, FaStar, FaArrowRight } from 'react-icons/fa';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      const bookingsData = response.data?.data || response.data || [];
      
      if (!Array.isArray(bookingsData)) {
        console.error('Bookings data is not an array:', bookingsData);
        setBookings([]);
        setStats({ totalBookings: 0, activeBookings: 0, completedBookings: 0 });
        return;
      }
      
      setBookings(bookingsData);
      
      const total = bookingsData.length;
      const active = bookingsData.filter(b => b.status === 'active' || b.status === 'confirmed').length;
      const completed = bookingsData.filter(b => b.status === 'completed').length;
      
      setStats({ totalBookings: total, activeBookings: active, completedBookings: completed });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setBookings([]);
      setStats({ totalBookings: 0, activeBookings: 0, completedBookings: 0 });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="text-yellow-600" />, label: 'Pending' },
      'confirmed': { color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle className="text-blue-600" />, label: 'Confirmed' },
      'active': { color: 'bg-green-100 text-green-800', icon: <FaCar className="text-green-600" />, label: 'Active' },
      'completed': { color: 'bg-gray-100 text-gray-800', icon: <FaCheckCircle className="text-gray-600" />, label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <FaClock className="text-red-600" />, label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: null, label: status };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-blue-100 mt-1">Manage your rentals and profile</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/cars')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors backdrop-blur-sm flex items-center gap-2"
              >
                <FaPlus />
                Book a Car
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors backdrop-blur-sm flex items-center gap-2"
              >
                <FaUser />
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeBookings}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaCar className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalBookings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FaHistory className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.completedBookings}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FaStar className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/cars')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Browse Available Cars
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaHistory />
              View All Bookings
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaUser />
              Update Profile
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
            {bookings.length > 0 && (
              <button 
                onClick={() => navigate('/bookings')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <FaArrowRight size={12} />
              </button>
            )}
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCar className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 mb-6">Start your first car rental journey!</p>
              <button
                onClick={() => navigate('/cars')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Cars
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0">
                        <FaCar className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {booking.car?.make || booking.car?.brand || 'Car'} {booking.car?.model || ''}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(booking.status)}
                      <button
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-semibold text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email Address</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Member Since</p>
              <p className="font-semibold text-gray-800">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
