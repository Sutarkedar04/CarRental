// src/pages/admin/AdminDashboard.jsx - STRIPPED VERSION (no inline nav, no sidebar)

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaUsers, FaCalendarAlt, FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalUsers: 0,
    totalCars: 0,
    revenue: 0,
    revenueChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    // Allow both 'admin' and 'super_admin'
    if (!user) {
      navigate('/signin');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [bookingsRes, carsRes, usersRes] = await Promise.allSettled([
        api.get('/bookings'),
        api.get('/cars'),
        api.get('/users')
      ]);
      
      const bookings = bookingsRes.status === 'fulfilled' ? 
        (bookingsRes.value.data?.data || bookingsRes.value.data || []) : [];
      const cars = carsRes.status === 'fulfilled' ? 
        (carsRes.value.data?.data || carsRes.value.data || []) : [];
      const users = usersRes.status === 'fulfilled' ? 
        (usersRes.value.data?.data || usersRes.value.data || []) : [];
      
      const bookingsData = Array.isArray(bookings) ? bookings : [];
      const carsData = Array.isArray(cars) ? cars : [];
      const usersData = Array.isArray(users) ? users : [];
      
      const totalBookings = bookingsData.length;
      const activeBookings = bookingsData.filter(b => b.status === 'active').length;
      const totalUsers = usersData.length;
      const totalCars = carsData.length;
      const revenue = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
      
      setStats({ totalBookings, activeBookings, totalUsers, totalCars, revenue, revenueChange: 12.5 });
      setRecentBookings(bookingsData.slice(0, 5));
      setRecentUsers(usersData.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ totalBookings: 0, activeBookings: 0, totalUsers: 0, totalCars: 0, revenue: 0, revenueChange: 0 });
      setRecentBookings([]);
      setRecentUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(stats.revenue)}</p>
                <div className="flex items-center gap-2 mt-2">
                  {stats.revenueChange > 0 ? (
                    <><FaArrowUp className="text-green-500" /><span className="text-green-600 text-sm font-medium">+{stats.revenueChange}%</span></>
                  ) : (
                    <><FaArrowDown className="text-red-500" /><span className="text-red-600 text-sm font-medium">{stats.revenueChange}%</span></>
                  )}
                  <span className="text-gray-500 text-sm">from last month</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FaDollarSign className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings}</p>
                <p className="text-gray-500 text-sm mt-2">{stats.activeBookings} active bookings</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaCalendarAlt className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                <p className="text-gray-500 text-sm mt-2">Registered customers</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cars</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCars}</p>
                <p className="text-gray-500 text-sm mt-2">Available in fleet</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <FaCar className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeBookings}</p>
                <p className="text-gray-500 text-sm mt-2">Currently rented</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <FaCar className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">78%</p>
                <p className="text-gray-500 text-sm mt-2">Fleet utilization</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <FaChartLine className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings & Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
              <button onClick={() => navigate('/admin/bookings')} className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id || booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{booking.car?.brand || 'Car'} {booking.car?.model || ''}</h4>
                        <p className="text-gray-600 text-sm mt-1">{booking.user?.name || 'User'} • {formatDate(booking.startDate)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status || 'unknown'}
                          </span>
                          <span className="text-gray-700 font-medium">{formatCurrency(booking.totalAmount)}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/admin/bookings/${booking._id}`)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8"><p className="text-gray-500">No bookings found</p></div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Users</h3>
              <button onClick={() => navigate('/admin/users')} className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((u) => (
                  <div key={u._id || u.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{u.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{u.name || 'Unknown User'}</h4>
                          <p className="text-gray-600 text-sm">{u.email || 'No email'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              u.role === 'super_admin' ? 'bg-yellow-100 text-yellow-800' :
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {u.role === 'super_admin' ? 'Super Admin' : u.role || 'customer'}
                            </span>
                            <span className="text-gray-500 text-xs">Joined {formatDate(u.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/admin/users/${u._id}`)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8"><p className="text-gray-500">No users found</p></div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => navigate('/admin/cars')} className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-purple-600 text-xl" />
              </div>
              <h4 className="font-bold text-gray-800">Add New Car</h4>
              <p className="text-gray-600 text-sm mt-2">Add a new vehicle to the fleet</p>
            </button>
            <button onClick={() => navigate('/admin/bookings')} className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-bold text-gray-800">Manage Bookings</h4>
              <p className="text-gray-600 text-sm mt-2">View and manage all bookings</p>
            </button>
            <button onClick={() => navigate('/admin/users')} className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <h4 className="font-bold text-gray-800">Manage Users</h4>
              <p className="text-gray-600 text-sm mt-2">View and manage all users</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
