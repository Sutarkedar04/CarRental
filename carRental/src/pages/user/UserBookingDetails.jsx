// src/pages/user/UserBookingDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCar, FaCalendarAlt, FaDollarSign, FaClock, FaCheckCircle, 
  FaTimesCircle, FaArrowLeft, FaGasPump, FaCog, FaUsers, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaPrint, FaDownload ,FaUser
} from 'react-icons/fa';
import api from '../../services/api';

const UserBookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchBookingDetails();
  }, [id, user, navigate]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/bookings/${id}`);
      
      // Handle API response structure
      const bookingData = response.data?.data || response.data;
      
      if (!bookingData) {
        setError('Booking not found');
        return;
      }
      
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError(error.response?.data?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
      const response = await api.put(`/bookings/${id}/cancel`);
      
      if (response.data.success) {
        // Refresh booking details
        await fetchBookingDetails();
        alert('Booking cancelled successfully');
      } else {
        alert(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // ─── Add this map just above getStatusConfig ─────────────────────────────────
const STATUS_BG_MAP = {
  pending:   'bg-yellow-50',
  confirmed: 'bg-blue-50',
  active:    'bg-green-50',
  completed: 'bg-gray-50',
  cancelled: 'bg-red-50',
};

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <FaClock className="text-yellow-600" />,
      label: 'Pending Confirmation',
      message: 'Your booking is awaiting confirmation from the rental company.',
    },
    confirmed: {
      color: 'bg-blue-100 text-blue-800',
      icon: <FaCheckCircle className="text-blue-600" />,
      label: 'Confirmed',
      message: 'Your booking has been confirmed. Get ready for your trip!',
    },
    active: {
      color: 'bg-green-100 text-green-800',
      icon: <FaCar className="text-green-600" />,
      label: 'Active',
      message: 'You are currently renting this vehicle.',
    },
    completed: {
      color: 'bg-gray-100 text-gray-800',
      icon: <FaCheckCircle className="text-gray-600" />,
      label: 'Completed',
      message: 'This rental has been completed. Thank you for choosing us!',
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: <FaTimesCircle className="text-red-600" />,
      label: 'Cancelled',
      message: 'This booking has been cancelled.',
    },
  };
  return configs[status] || configs.pending;
};

  const calculateDays = () => {
    if (!booking?.startDate || !booking?.endDate) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const canCancel = () => {
    const cancelableStatuses = ['pending', 'confirmed'];
    return cancelableStatuses.includes(booking?.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the booking you're looking for."}</p>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const days = calculateDays();
  const car = booking.car || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to My Bookings
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Booking #{booking._id?.slice(-8).toUpperCase()}
                </h1>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </div>
              </div>
              <p className="text-gray-600">
                Booked on {formatDateTime(booking.createdAt)}
              </p>
            </div>
            
            {canCancel() && (
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-start"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    Cancel Booking
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Information */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Vehicle Information</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaCar className="text-blue-600 text-6xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {car.make || car.brand} {car.model}
                    </h3>
                    <p className="text-gray-600 mb-4">{car.year} • {car.type || 'Standard'}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaGasPump className="text-gray-400" />
                        <span>{car.fuelType || 'Petrol'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCog className="text-gray-400" />
                        <span>{car.transmission || 'Automatic'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUsers className="text-gray-400" />
                        <span>{car.seatingCapacity || 5} Seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCar className="text-gray-400" />
                        <span>{car.mileage || 'N/A'} kmpl</span>
                      </div>
                    </div>
                    
                    {car.licensePlate && (
                      <p className="text-sm text-gray-500">
                        License Plate: <span className="font-mono">{car.licensePlate}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Rental Period</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Pick-up Date & Time</p>
                    <p className="font-semibold text-gray-800 text-lg">{formatDate(booking.startDate)}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(booking.startDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="border rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Return Date & Time</p>
                    <p className="font-semibold text-gray-800 text-lg">{formatDate(booking.endDate)}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(booking.endDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Total Rental Duration</p>
                  <p className="text-2xl font-bold text-blue-600">{days} {days === 1 ? 'Day' : 'Days'}</p>
                </div>
              </div>
            </div>

            {/* Status Message */}
<div className={`rounded-2xl shadow-lg overflow-hidden ${STATUS_BG_MAP[booking.status] || 'bg-gray-50'}`}>
  <div className="p-6">
    <div className="flex items-start gap-3">
      <div className="mt-1">{statusConfig.icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">Booking Status: {statusConfig.label}</h3>
        <p className="text-gray-600">{statusConfig.message}</p>
      </div>
    </div>
  </div>
</div>
          </div>

          {/* Sidebar - Payment & Contact */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Payment Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Daily Rate</span>
                    <span>{formatCurrency(car.dailyRate || booking.dailyRate)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Number of Days</span>
                    <span>{days} {days === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency((car.dailyRate || booking.dailyRate || 0) * days)}</span>
                  </div>
                  {booking.securityDeposit > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Security Deposit</span>
                      <span>{formatCurrency(booking.securityDeposit)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-2xl text-blue-600">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                  <p>✓ No hidden fees</p>
                  <p>✓ Free cancellation up to 24 hours before pick-up</p>
                  <p>✓ Full insurance coverage included</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Contact Information</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaUser className="text-gray-400" />
                    <span>{booking.user?.name || user?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaEnvelope className="text-gray-400" />
                    <span>{booking.user?.email || user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaPhone className="text-gray-400" />
                    <span>{booking.user?.phone || user?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pick-up Location */}
            {car.location && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Pick-up Location</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p>{car.location.pickupAddress || '123 Main Street'}</p>
                      <p>{car.location.city || 'New York'}, {car.location.state || 'NY'} {car.location.zipCode || '10001'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Print/Download Button */}
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <FaPrint />
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookingDetails;
