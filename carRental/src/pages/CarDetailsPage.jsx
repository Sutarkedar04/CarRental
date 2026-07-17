// src/pages/CarDetailsPage.jsx - COMPLETE UPDATED VERSION (with available-dates-only calendar)

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaCar, FaGasPump, FaCog, FaUsers, FaStar,
  FaCalendarAlt, FaCheckCircle, FaShieldAlt, FaArrowLeft,
  FaTag
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const CAR_TYPE_EMOJI = {
  suv: '🚙', sedan: '🚗', hatchback: '🚘',
  luxury: '🏎️', sports: '🚓', van: '🚐', truck: '🛻',
};

const getCarEmoji = (type) =>
  CAR_TYPE_EMOJI[(type || '').toLowerCase()] ?? '🚗';

// Today's date string without timezone shift
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Format a Date object -> 'YYYY-MM-DD' (no timezone shift)
const formatDateStr = (date) => {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Parse a 'YYYY-MM-DD' string -> local Date object (avoids UTC shift)
const parseDateStr = (str) => (str ? new Date(str + 'T00:00:00') : null);

// Expand a booked range into individual Date objects (inclusive)
const expandDateRange = (start, end) => {
  const toLocalDate = (value) => {
    if (typeof value === 'string') {
      return parseDateStr(value.slice(0, 10));
    }

    const date = new Date(value);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };

  const dates = [];
  const current = toLocalDate(start);
  const last = toLocalDate(end);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// ─── Transform backend car data to frontend format ─────────────────────────
const transformCarData = (backendCar) => {
  if (!backendCar) return null;

  return {
    _id: backendCar._id,
    brand: backendCar.make,
    model: backendCar.model,
    year: backendCar.year,
    type: backendCar.type,
    pricePerDay: backendCar.dailyRate,
    seats: backendCar.seatingCapacity,
    fuelType: backendCar.fuelType,
    transmission: backendCar.transmission,
    mileage: backendCar.mileage,
    image: backendCar.images?.[0]?.url || backendCar.images?.[0] || null,
    status: backendCar.isAvailable ? 'available' : 'unavailable',
    rating: backendCar.rating,
    description: backendCar.description,
    features: backendCar.features || [],
    licensePlate: backendCar.licensePlate,
    location: backendCar.location,
    condition: backendCar.condition,
    securityDeposit: backendCar.securityDeposit
  };
};

// ─── Main Component ─────────────────────────────────────────────────────────

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Booked-out dates for this car (array of Date objects)
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [datesLoading, setDatesLoading] = useState(true);

  // Check for pending booking data in URL params (after redirect from sign in)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pendingStartDate = params.get('startDate');
    const pendingEndDate = params.get('endDate');

    if (pendingStartDate && pendingEndDate) {
      setBookingDates({
        startDate: pendingStartDate,
        endDate: pendingEndDate
      });
    }
  }, [location.search]);

  useEffect(() => {
    fetchCarDetails();
    fetchUnavailableDates();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/cars/${id}`);
      const carData = response.data?.data || response.data || null;

      const transformedCar = carData && typeof carData === 'object' && !Array.isArray(carData)
        ? transformCarData(carData)
        : null;

      setCar(transformedCar);
    } catch (err) {
      console.error('Error fetching car details:', err);
      setError('Failed to load car details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch already-booked date ranges for this car so the calendar can block them
  const fetchUnavailableDates = async () => {
    try {
      setDatesLoading(true);
      const response = await api.get(`/cars/${id}/unavailable-dates`);
      const ranges = response.data?.data || [];

      const allDates = ranges.flatMap(r =>
        expandDateRange(new Date(r.startDate), new Date(r.endDate))
      );

      setUnavailableDates(allDates);
    } catch (err) {
      console.error('Error fetching unavailable dates:', err);
      // Fail gracefully — booking validation still happens server-side
      setUnavailableDates([]);
    } finally {
      setDatesLoading(false);
    }
  };

  const isDateBooked = (date) =>
    unavailableDates.some(d => d.toDateString() === date.toDateString());

  // Checks whether every day in [start, end] is free of existing bookings
  const isRangeClear = (start, end) => {
    const range = expandDateRange(start, end);
    return !range.some(d => isDateBooked(d));
  };

  const calculateDays = () => {
    if (!bookingDates.startDate || !bookingDates.endDate) return 0;
    const start = parseDateStr(bookingDates.startDate);
    const end = parseDateStr(bookingDates.endDate);
    if (end < start) return 0;
    return Math.round((end - start) / 86_400_000) + 1;
  };

  const days = calculateDays();
  const total = car ? days * (car.pricePerDay || 0) : 0;

  const handleStartDateChange = (date) => {
    const formatted = formatDateStr(date);
    setBookingDates(prev => {
      const updated = { ...prev, startDate: formatted };
      // Clear end date if it's now before start date or the new range crosses a booked day
      if (updated.endDate) {
        const endD = parseDateStr(updated.endDate);
        if (endD < date || !isRangeClear(date, endD)) {
          updated.endDate = '';
        }
      }
      return updated;
    });
    setBookingError('');
  };

  const handleEndDateChange = (date) => {
    setBookingDates(prev => ({ ...prev, endDate: formatDateStr(date) }));
    setBookingError('');
  };

  const validateBooking = () => {
    if (!bookingDates.startDate || !bookingDates.endDate) {
      setBookingError('Please select both start and end dates.');
      return false;
    }
    const today = todayStr();
    if (bookingDates.startDate < today) {
      setBookingError('Start date cannot be in the past.');
      return false;
    }
    if (bookingDates.endDate < bookingDates.startDate) {
      setBookingError('End date must be on or after the start date.');
      return false;
    }
    const start = parseDateStr(bookingDates.startDate);
    const end = parseDateStr(bookingDates.endDate);
    if (!isRangeClear(start, end)) {
      setBookingError('Selected dates overlap with an existing booking. Please choose different dates.');
      return false;
    }
    return true;
  };

  // Handle sign in redirect with booking data preservation
  const handleSignInRedirect = () => {
    const params = new URLSearchParams();
    if (bookingDates.startDate) params.set('startDate', bookingDates.startDate);
    if (bookingDates.endDate) params.set('endDate', bookingDates.endDate);

    const returnUrl = `/cars/${id}${params.toString() ? `?${params.toString()}` : ''}`;

    navigate('/signin', {
      state: { from: returnUrl }
    });
  };

  const handleBookNow = async () => {
    if (!user) {
      handleSignInRedirect();
      return;
    }
    if (!validateBooking()) return;

    setIsBooking(true);
    setBookingError('');

    try {
      const response = await api.post('/bookings', {
        carId: car._id,
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
        totalAmount: total,
      });

      if (response.data.success) {
        setBookingSuccess('Booking confirmed! Redirecting to your dashboard…');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setBookingError(response.data.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-64 bg-gray-100 rounded-xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error ? 'Something went wrong' : 'Car not found'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "We couldn't find the car you're looking for."}
          </p>
          <div className="flex gap-3 justify-center">
            {error && (
              <button
                onClick={fetchCarDetails}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => navigate('/cars')}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = car.status === 'available';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors text-sm"
        >
          <FaArrowLeft size={12} /> Back to Cars
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Car Details ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-gray-500 mt-1 capitalize">{car.year} · {car.type}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {car.rating != null && (
                        <span className="flex items-center gap-1 text-sm">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold text-gray-700">{Number(car.rating).toFixed(1)}</span>
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isAvailable ? '● Available Now' : '● Currently Unavailable'}
                      </span>
                      {car.licensePlate && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FaTag /> {car.licensePlate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Daily rate</p>
                    <p className="text-4xl font-bold text-blue-600">
                      ₹{car.pricePerDay ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400">per day</p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="mx-8 mt-6 h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-8xl select-none">{getCarEmoji(car.type)}</span>
                )}
              </div>

              {/* Specs */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: <FaGasPump />, label: 'Fuel', value: car.fuelType },
                    { icon: <FaCog />, label: 'Transmission', value: car.transmission },
                    { icon: <FaUsers />, label: 'Seats', value: car.seats ? `${car.seats} seats` : null },
                    { icon: <FaCar />, label: 'Mileage', value: car.mileage ? `${car.mileage} kmpl` : null },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 text-blue-600">
                        {icon}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="font-semibold text-gray-800 text-sm">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                {Array.isArray(car.features) && car.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((f, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full"
                        >
                          <FaCheckCircle className="text-blue-400" size={10} /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {car.description ||
                      `Experience the perfect blend of comfort and performance with the ${car.brand} ${car.model}. ` +
                      `This ${car.year} ${(car.type || '').toLowerCase()} features ${(car.fuelType || 'a modern').toLowerCase()} ` +
                      `engine paired with ${(car.transmission || 'a smooth').toLowerCase()} transmission — ` +
                      `ideal for both city driving and longer journeys.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Booking Form ───────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Book This Car</h2>

              {/* Unavailable notice */}
              {!isAvailable && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  This car is currently unavailable for booking.
                </div>
              )}

              {/* Booking success */}
              {bookingSuccess && (
                <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                    <FaCheckCircle /> {bookingSuccess}
                  </div>
                </div>
              )}

              {/* Booking error */}
              {bookingError && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {bookingError}
                </div>
              )}

              <div className="space-y-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <FaCalendarAlt className="inline mr-1.5 text-gray-400" />
                    Start Date
                  </label>
                  <DatePicker
                    selected={parseDateStr(bookingDates.startDate)}
                    onChange={handleStartDateChange}
                    excludeDates={unavailableDates}
                    minDate={new Date()}
                    disabled={!isAvailable || datesLoading}
                    placeholderText={datesLoading ? 'Loading availability…' : 'Select start date'}
                    dateFormat="yyyy-MM-dd"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <FaCalendarAlt className="inline mr-1.5 text-gray-400" />
                    End Date
                  </label>
                  <DatePicker
                    selected={parseDateStr(bookingDates.endDate)}
                    onChange={handleEndDateChange}
                    excludeDates={unavailableDates}
                    minDate={bookingDates.startDate ? parseDateStr(bookingDates.startDate) : new Date()}
                    // Blocks any end date whose range would pass through an already-booked day
                    filterDate={(date) => {
                      if (isDateBooked(date)) return false;
                      if (!bookingDates.startDate) return true;
                      const start = parseDateStr(bookingDates.startDate);
                      if (date < start) return false;
                      return isRangeClear(start, date);
                    }}
                    disabled={!isAvailable || !bookingDates.startDate || datesLoading}
                    placeholderText="Select end date"
                    dateFormat="yyyy-MM-dd"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white border border-gray-300 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Booked
                  </span>
                </div>

                {/* Price Breakdown */}
                {days > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 text-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Price Breakdown</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-600">
                        <span>₹{car.pricePerDay} × {days} day{days !== 1 ? 's' : ''}</span>
                        <span>₹{car.pricePerDay * days}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 border-t border-blue-200 pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-blue-600">₹{total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assurances */}
                <div className="border-t pt-4 space-y-2">
                  {[
                    'Free cancellation up to 24 hours before',
                    'Full insurance coverage included',
                    'No hidden fees',
                  ].map(text => (
                    <div key={text} className="flex items-start gap-2 text-xs text-gray-500">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {!user ? (
                  <button
                    onClick={handleSignInRedirect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Sign In to Book
                  </button>
                ) : (
                  <button
                    onClick={handleBookNow}
                    disabled={isBooking || !isAvailable || !!bookingSuccess}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      !isAvailable
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isBooking || bookingSuccess
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : !isAvailable ? (
                      'Currently Unavailable'
                    ) : bookingSuccess ? (
                      'Booking Confirmed ✓'
                    ) : (
                      `Book Now${days > 0 ? ` — ₹${total}` : ''}`
                    )}
                  </button>
                )}

                {/* Security note */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <FaShieldAlt />
                  <span>Secure & encrypted booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;