import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaArrowLeft, FaUser } from 'react-icons/fa';
import api from '../../services/api';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data?.data || response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      setBooking(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':   return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active':    return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Booking not found</h2>
          <button onClick={() => navigate('/admin/bookings')}
            className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => navigate('/admin/bookings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <FaArrowLeft size={12} /> Back to bookings
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Booking #{booking._id?.substring(0, 8)}</h1>
                <p className="text-purple-100 mt-1">Created {formatDate(booking.createdAt)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Car Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaCar className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {booking.car?.make} {booking.car?.model}
                </h2>
                <p className="text-gray-500 text-sm">
                  {booking.car?.year} • {booking.car?.type}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUser className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {booking.user?.name || 'Customer'}
                </h2>
                <p className="text-gray-500 text-sm">{booking.user?.email}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl">
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                  <FaCalendarAlt /> Start Date
                </p>
                <p className="font-semibold text-gray-800">{formatDate(booking.startDate)}</p>
              </div>
              <div className="p-4 border rounded-xl">
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                  <FaCalendarAlt /> End Date
                </p>
                <p className="font-semibold text-gray-800">{formatDate(booking.endDate)}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || booking.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${booking.status === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
