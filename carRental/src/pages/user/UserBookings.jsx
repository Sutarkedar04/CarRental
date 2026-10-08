// src/pages/user/UserBookings.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaDollarSign, FaFilter, FaSearch, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';

const UserBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      
      // Handle API response structure
      const bookingsData = response.data?.data || response.data || [];
      
      // Ensure it's an array
      if (!Array.isArray(bookingsData)) {
        console.error('Bookings data is not an array:', bookingsData);
        setBookings([]);
        return;
      }
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

 const filterBookings = () => {
  let filtered = bookings;

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter((booking) => {
      const car = booking.car || {};
      const make = (car.make || car.brand || '').toLowerCase();
      const model = (car.model || '').toLowerCase();
      const bookingId = (booking._id || '').toLowerCase();
      return make.includes(q) || model.includes(q) || bookingId.includes(q);
    });
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter((booking) => booking.status === statusFilter);
  }

  setFilteredBookings(filtered);
};
  const formatDate = (dateString) => {
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
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-500" />;
      case 'active': return <FaCheckCircle className="text-green-500" />;
      case 'completed': return <FaCheckCircle className="text-gray-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        fetchBookings(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your car rental bookings</p>
            </div>
            <button
              onClick={() => navigate('/cars')}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book New Car
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search - FIXED: Added text-gray-900 */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Status Filter - FIXED: Added text-gray-900 */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCar className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">No Bookings Found</h3>
            <p className="text-gray-500 mb-6">
              {bookings.length === 0 
                ? "You haven't made any bookings yet."
                : "No bookings match your search criteria."}
            </p>
            <button
              onClick={() => navigate('/cars')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Car Info */}
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <FaCar className="text-blue-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {booking.car?.make || booking.car?.brand || 'Car'} {booking.car?.model || ''}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {booking.car?.year} • {booking.car?.transmission} • {booking.car?.fuelType}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt />
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                          <span className="flex items-center gap-2 text-gray-600">
                            <FaDollarSign />
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Details
                        </button>
                        
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
