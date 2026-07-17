import { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaMapMarkerAlt, FaRupeeSign, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const CAR_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Minivan', 'Truck'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const FEATURES = ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Parking Sensors', 'Leather Seats'];

const EMPTY_FORM = {
  make: '', model: '', year: new Date().getFullYear(),
  type: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol',
  seatingCapacity: 5, mileage: 0,
  dailyRate: '', securityDeposit: '',
  location: { pickupAddress: '', city: '', state: '' },
  features: [],
  isAvailable: true
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});

const DealerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null); // null = adding new
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchMyCars = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/cars/mine`, {
        credentials: 'include',
        headers: authHeaders()
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to load your cars');
        setCars([]);
        return;
      }
      setCars(data.data);
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCars();
  }, []);

  const openAddForm = () => {
    setEditingCar(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (car) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      type: car.type,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seatingCapacity: car.seatingCapacity,
      mileage: car.mileage,
      dailyRate: car.dailyRate,
      securityDeposit: car.securityDeposit,
      location: {
        pickupAddress: car.location?.pickupAddress || '',
        city: car.location?.city || '',
        state: car.location?.state || ''
      },
      features: car.features || [],
      isAvailable: car.isAvailable
    });
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCar(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.make.trim()) errors.make = 'Required';
    if (!formData.model.trim()) errors.model = 'Required';
    if (!formData.year || formData.year < 2000) errors.year = 'Enter a valid year';
    if (!formData.dailyRate || Number(formData.dailyRate) <= 0) errors.dailyRate = 'Enter a valid daily rate';
    if (!formData.securityDeposit || Number(formData.securityDeposit) < 0) errors.securityDeposit = 'Enter a valid deposit amount';
    if (!formData.location.city.trim()) errors.city = 'City is required so customers can find this car';
    if (!formData.location.pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      year: Number(formData.year),
      seatingCapacity: Number(formData.seatingCapacity),
      mileage: Number(formData.mileage),
      dailyRate: Number(formData.dailyRate),
      securityDeposit: Number(formData.securityDeposit)
    };

    try {
      const url = editingCar ? `${API_BASE}/cars/${editingCar._id}` : `${API_BASE}/cars`;
      const method = editingCar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || `Failed to ${editingCar ? 'update' : 'add'} car`);
        return;
      }

      if (editingCar) {
        setCars(prev => prev.map(c => c._id === editingCar._id ? data.data : c));
      } else {
        setCars(prev => [data.data, ...prev]);
      }
      closeForm();
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (carId) => {
    setDeletingId(carId);
    try {
      const res = await fetch(`${API_BASE}/cars/${carId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders()
      });
      const data = await res.json();

      if (data.success) {
        setCars(prev => prev.filter(c => c._id !== carId));
      } else {
        setError(data.message || 'Failed to delete car');
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaCar className="text-orange-400" />
              My Cars
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage the vehicles you've listed for rent</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
          >
            <FaPlus /> Add Car
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl flex items-start gap-3">
            <FaExclamationTriangle className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FaSpinner className="animate-spin text-3xl mb-3" />
            <p>Loading your cars…</p>
          </div>
        )}

        {!loading && cars.length === 0 && !error && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
            <FaCar className="text-gray-600 text-4xl mx-auto mb-4" />
            <p className="text-gray-300 font-medium">No cars listed yet</p>
            <p className="text-gray-500 text-sm mt-1 mb-5">Add your first car to start receiving bookings.</p>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <FaPlus /> Add Your First Car
            </button>
          </div>
        )}

        {/* Car grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <div key={car._id} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{car.make} {car.model}</h3>
                  <p className="text-gray-500 text-xs">{car.year} · {car.type} · {car.transmission}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  car.isAvailable && car.isActive !== false
                    ? 'bg-green-900/30 text-green-400 border border-green-800'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {car.isActive === false ? 'Removed' : car.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <FaMapMarkerAlt className="text-gray-500 flex-shrink-0" />
                <span className="truncate">{car.location?.city || 'No city set'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                <FaRupeeSign className="text-gray-500 flex-shrink-0" />
                <span className="font-semibold">₹{car.dailyRate}</span>
                <span className="text-gray-500">/ day</span>
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => openEditForm(car)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaEdit /> Edit
                </button>

                {confirmDeleteId === car._id ? (
                  <div className="flex-1 flex gap-1">
                    <button
                      onClick={() => handleDelete(car._id)}
                      disabled={deletingId === car._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === car._id ? <FaSpinner className="animate-spin mx-auto" /> : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(car._id)}
                    className="flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </h2>
                <button onClick={closeForm} className="text-gray-500 hover:text-gray-300">
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Make / Model / Year */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Make *" value={formData.make} error={formErrors.make}
                    onChange={(v) => setFormData({ ...formData, make: v })} placeholder="Toyota" />
                  <FormField label="Model *" value={formData.model} error={formErrors.model}
                    onChange={(v) => setFormData({ ...formData, model: v })} placeholder="Innova" />
                  <FormField label="Year *" type="number" value={formData.year} error={formErrors.year}
                    onChange={(v) => setFormData({ ...formData, year: v })} />
                </div>

                {/* Type / Transmission / Fuel */}
                <div className="grid grid-cols-3 gap-4">
                  <FormSelect label="Type" value={formData.type} options={CAR_TYPES}
                    onChange={(v) => setFormData({ ...formData, type: v })} />
                  <FormSelect label="Transmission" value={formData.transmission} options={TRANSMISSIONS}
                    onChange={(v) => setFormData({ ...formData, transmission: v })} />
                  <FormSelect label="Fuel Type" value={formData.fuelType} options={FUEL_TYPES}
                    onChange={(v) => setFormData({ ...formData, fuelType: v })} />
                </div>

                {/* Seats / Mileage */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Seating Capacity" type="number" value={formData.seatingCapacity}
                    onChange={(v) => setFormData({ ...formData, seatingCapacity: v })} />
                  <FormField label="Mileage (km/l)" type="number" value={formData.mileage}
                    onChange={(v) => setFormData({ ...formData, mileage: v })} />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Daily Rate (₹) *" type="number" value={formData.dailyRate} error={formErrors.dailyRate}
                    onChange={(v) => setFormData({ ...formData, dailyRate: v })} placeholder="1500" />
                  <FormField label="Security Deposit (₹) *" type="number" value={formData.securityDeposit} error={formErrors.securityDeposit}
                    onChange={(v) => setFormData({ ...formData, securityDeposit: v })} placeholder="5000" />
                </div>

                {/* Location */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-300 text-sm font-medium mb-3">Pickup Location</p>
                  <div className="space-y-4">
                    <FormField label="Pickup Address *" value={formData.location.pickupAddress} error={formErrors.pickupAddress}
                      onChange={(v) => setFormData({ ...formData, location: { ...formData.location, pickupAddress: v } })}
                      placeholder="123 MG Road" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="City *" value={formData.location.city} error={formErrors.city}
                        onChange={(v) => setFormData({ ...formData, location: { ...formData.location, city: v } })}
                        placeholder="Delhi" />
                      <FormField label="State" value={formData.location.state}
                        onChange={(v) => setFormData({ ...formData, location: { ...formData.location, state: v } })}
                        placeholder="Delhi" />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-300 text-sm font-medium mb-3">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {FEATURES.map((feature) => (
                      <button
                        type="button"
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability toggle */}
                <div className="flex items-center gap-3 border-t border-gray-700 pt-4">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-orange-600 bg-gray-900 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isAvailable" className="text-gray-300 text-sm">
                    Car is currently available for booking
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" /> Saving…
                      </span>
                    ) : editingCar ? 'Save Changes' : 'Add Car'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormField = ({ label, type = 'text', value, onChange, placeholder, error }) => (
  <div>
    <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 bg-gray-900 border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        error ? 'border-red-500' : 'border-gray-700'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default DealerDashboard;