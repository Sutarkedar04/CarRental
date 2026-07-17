// src/pages/CarsPage.jsx - FIXED & IMPROVED
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCar, FaGasPump, FaCog, FaUsers, FaStar,
  FaFilter, FaSearch, FaTimes, FaSortAmountDown, FaMapMarkerAlt, FaCalendarAlt
} from 'react-icons/fa';
import api from '../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const CAR_TYPE_EMOJI = {
  suv: '🚙',
  sedan: '🚗',
  hatchback: '🚘',
  luxury: '🏎️',
  sports: '🚓',
  van: '🚐',
  truck: '🛻',
};

const getCarEmoji = (type) =>
  CAR_TYPE_EMOJI[(type || '').toLowerCase()] ?? '🚗';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'          },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'year_desc',  label: 'Newest First'      },
  { value: 'rating',     label: 'Top Rated'         },
];

// ─── Skeleton card ──────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded" />
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-9 bg-gray-200 rounded w-28" />
      </div>
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

const CarsPage = () => {
  const [cars, setCars]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [selectedType, setSelectedType]   = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy]           = useState('default');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchCars();
  }, [city, startDate, endDate]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (city.trim()) params.location = city.trim();
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const response = await api.get('/cars', { params });
      const carsData = response.data?.data || response.data || [];
      
      const transformedCars = (Array.isArray(carsData) ? carsData : []).map(car => ({
        _id: car._id,
        brand: car.make,
        model: car.model,
        year: car.year,
        type: car.type,
        pricePerDay: car.dailyRate,
        seats: car.seatingCapacity,
        fuelType: car.fuelType,
        transmission: car.transmission,
        mileage: car.mileage,
        image: car.images?.[0]?.url || car.images?.[0] || null,
        status: car.isAvailable ? 'available' : 'unavailable',
        rating: car.rating,
        description: car.description,
        features: car.features,
        licensePlate: car.licensePlate,
        location: car.location
      }));
      
      setCars(transformedCars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const carTypes  = [...new Set(cars.map(c => c.type).filter(Boolean))].sort();
  const carBrands = [...new Set(cars.map(c => c.brand).filter(Boolean))].sort();

  const filteredCars = cars
    .filter(car => {
      if (availableOnly && car.status !== 'available') return false;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        car.brand?.toLowerCase().includes(q) ||
        car.model?.toLowerCase().includes(q) ||
        car.type?.toLowerCase().includes(q);
      const matchesType  = selectedType  === 'all' || car.type  === selectedType;
      const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
      return matchesSearch && matchesType && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':  return (a.pricePerDay || 0) - (b.pricePerDay || 0);
        case 'price_desc': return (b.pricePerDay || 0) - (a.pricePerDay || 0);
        case 'year_desc':  return (b.year || 0) - (a.year || 0);
        case 'rating':     return (b.rating || 0) - (a.rating || 0);
        default:           return 0;
      }
    });

  const hasActiveFilters =
    searchTerm || selectedType !== 'all' || selectedBrand !== 'all' || availableOnly || city || startDate || endDate;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedBrand('all');
    setAvailableOnly(false);
    setSortBy('default');
    setCity('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Find Your Perfect Ride</h1>
          <p className="text-blue-100 text-lg">
            {loading
              ? 'Loading available vehicles…'
              : `${cars.length} vehicles available for rent`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pickup city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                aria-label="Pickup date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                aria-label="Drop-off date"
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search brand, model…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={12} />
                </button>
              )}
              {city && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  <FaMapMarkerAlt size={10} /> {city}
                  <button onClick={() => setCity('')}><FaTimes size={10} /></button>
                </span>
              )}
              {startDate && endDate && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  <FaCalendarAlt size={10} /> {startDate} to {endDate}
                  <button onClick={() => { setStartDate(''); setEndDate(''); }}><FaTimes size={10} /></button>
                </span>
              )}
            </div>

            {/* Type */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm text-gray-700 bg-white"
              >
                <option value="all">All Types</option>
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="relative">
              <FaCar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm text-gray-700 bg-white"
              >
                <option value="all">All Brands</option>
                {carBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm text-gray-700 bg-white"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Available only + count */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available only</span>
              </label>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {filteredCars.length} result{filteredCars.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}><FaTimes size={10} /></button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {selectedType}
                  <button onClick={() => setSelectedType('all')}><FaTimes size={10} /></button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}><FaTimes size={10} /></button>
                </span>
              )}
              {availableOnly && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                  Available only
                  <button onClick={() => setAvailableOnly(false)}><FaTimes size={10} /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Error state ───────────────────────────────────────────────── */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={fetchCars}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Loading skeletons ─────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCar className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">No Cars Found</h3>
            <p className="text-gray-500 mb-6">
              {cars.length === 0
                ? 'No vehicles have been added yet.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ── Cars Grid ─────────────────────────────────────────────────── */}
        {!loading && !error && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image / Emoji placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative flex-shrink-0">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-6xl select-none">{getCarEmoji(car.type)}</span>
                  )}

                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    car.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {car.status === 'available' ? '● Available' : '● Unavailable'}
                  </span>

                  {/* Year badge */}
                  {car.year && (
                    <span className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {car.year}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5 capitalize">{car.type}</p>
                      {car.location?.city && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <FaMapMarkerAlt className="text-blue-500" />
                          {car.location.city}{car.location.state ? `, ${car.location.state}` : ''}
                        </p>
                      )}
                    </div>
                    {car.rating != null && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="font-semibold text-sm text-gray-700">
                          {Number(car.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaGasPump className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{car.fuelType || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCog className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{car.transmission || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400 flex-shrink-0" />
                      <span>{car.seats ? `${car.seats} seats` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCar className="text-gray-400 flex-shrink-0" />
                      <span>{car.mileage ? `${car.mileage} kmpl` : '—'}</span>
                    </div>
                  </div>

                  {/* Price + CTA — pushed to bottom */}
                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div>
                      <p className="text-xs text-gray-500">Daily rate</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{car.pricePerDay ?? '—'}
                        <span className="text-xs text-gray-400 font-normal">/day</span>
                      </p>
                    </div>
                    <Link
                      to={`/cars/${car._id}`}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        car.status === 'available'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      {car.status === 'available' ? 'View Details' : 'Unavailable'}
                    </Link>
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

export default CarsPage;
