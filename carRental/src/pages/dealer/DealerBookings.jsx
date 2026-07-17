import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCar, FaCheck, FaMapMarkerAlt, FaTimes, FaUser } from 'react-icons/fa';
import api from '../../services/api';

const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

const DealerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get('/bookings/dealer');
        setBookings(response.data?.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleDecision = async (bookingId, decision) => {
    try {
      setActioningId(bookingId);
      setError('');
      const response = await api.put(`/bookings/${bookingId}/dealer-decision`, { decision });
      setBookings((currentBookings) => currentBookings.map((booking) =>
        booking._id === bookingId ? response.data.data : booking
      ));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this booking. Please try again.');
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-300">Loading bookings…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold">My Car Bookings</h1>
        <p className="mt-1 text-sm text-gray-400">Bookings received for vehicles in your fleet.</p>

        {error && <p className="mt-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300">{error}</p>}
        {!error && bookings.length === 0 && <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center text-gray-400">No bookings for your cars yet.</div>}

        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <article key={booking._id} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold"><FaCar className="text-orange-400" />{booking.car?.make} {booking.car?.model}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-400"><FaUser />{booking.user?.name || 'Customer'} · {booking.user?.phone || booking.user?.email}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-400"><FaCalendarAlt />{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-400"><FaMapMarkerAlt />{booking.car?.location?.city || booking.pickupLocation}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-sm capitalize text-blue-300">{booking.status}</span>
                  <p className="mt-2 text-lg font-semibold text-white">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Payment: {booking.paymentStatus}</p>
                  {booking.status === 'pending' && (
                    <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                      <button
                        onClick={() => handleDecision(booking._id, 'accept')}
                        disabled={actioningId === booking._id}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleDecision(booking._id, 'decline')}
                        disabled={actioningId === booking._id}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <FaTimes /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealerBookings;
