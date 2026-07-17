// src/pages/admin/CarsManagement.jsx - COMPLETE WORKING VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaCheckCircle, FaTimesCircle, FaExclamationCircle,
  FaCalendarAlt, FaGasPump, FaCog, FaUsers, FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CarsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // New car form state
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 15,
    dailyRate: 50,
    securityDeposit: 100,
    isAvailable: true,
    description: '',
    condition: 'Good',
    features: [],
    location: {
      pickupAddress: '',
      city: '',
      state: ''
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Features options
  const featureOptions = [
    'AC', 'GPS', 'Bluetooth', 'Sunroof', 'Heated Seats', 
    'Backup Camera', 'Parking Sensors', 'Leather Seats'
  ];

  useEffect(() => {
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    navigate('/signin');
    return;
  }
  fetchCars();
}, [user, navigate]);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching cars...');
      
      const response = await api.get('/cars/admin/all');
      console.log('Cars response:', response.data);
      
      const carsData = response.data?.data || response.data || [];
      
      if (!Array.isArray(carsData)) {
        console.error('Cars data is not an array:', carsData);
        setCars([]);
        setError('Invalid data format received from server');
        return;
      }
      
      console.log(`Loaded ${carsData.length} cars`);
      setCars(carsData);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError(`Failed to load cars: ${error.response?.data?.message || error.message}`);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Validate car form
  const validateForm = (carData) => {
    const errors = {};
    
    if (!carData.make?.trim()) errors.make = 'Make is required';
    if (!carData.model?.trim()) errors.model = 'Model is required';
    if (!carData.year || carData.year < 2000 || carData.year > new Date().getFullYear() + 1) {
      errors.year = 'Invalid year (2000-present)';
    }
    if (!carData.type?.trim()) errors.type = 'Type is required';
    if (!carData.dailyRate || carData.dailyRate <= 0) {
      errors.dailyRate = 'Daily rate must be greater than 0';
    }
    if (!carData.securityDeposit || carData.securityDeposit < 0) {
      errors.securityDeposit = 'Security deposit cannot be negative';
    }
    if (!carData.seatingCapacity || carData.seatingCapacity < 1) {
      errors.seatingCapacity = 'Invalid seating capacity';
    }
    if (!carData.mileage || carData.mileage <= 0) {
      errors.mileage = 'Invalid mileage';
    }
    if (!carData.location?.pickupAddress?.trim()) errors.pickupAddress = 'Pickup address is required';
    if (!carData.location?.city?.trim()) errors.city = 'City is required';
    if (!carData.location?.state?.trim()) errors.state = 'State is required';
    
    return errors;
  };

  // Handle delete car
  const handleDelete = async (carId) => {
    try {
      setActionLoading(true);
      const response = await api.delete(`/cars/${carId}`);
      
      if (response.data.success) {
        setSuccessMessage('Car deleted successfully');
        setDeleteConfirm(null);
        fetchCars();
      } else {
        setError(response.data.message || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      setError(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Handle add car
  const handleAddCar = async () => {
    const errors = validateForm(newCar);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      setFormErrors({});
      
      // Prepare car data for backend
      const carData = {
        make: newCar.make.trim(),
        model: newCar.model.trim(),
        year: parseInt(newCar.year),
        type: newCar.type,
        fuelType: newCar.fuelType,
        transmission: newCar.transmission,
        seatingCapacity: parseInt(newCar.seatingCapacity),
        mileage: parseFloat(newCar.mileage),
        dailyRate: parseFloat(newCar.dailyRate),
        securityDeposit: parseFloat(newCar.securityDeposit),
        condition: newCar.condition,
        description: newCar.description || '',
        isAvailable: newCar.isAvailable,
        features: newCar.features || [],
        location: {
          pickupAddress: newCar.location.pickupAddress.trim(),
          city: newCar.location.city.trim(),
          state: newCar.location.state.trim()
        }
      };

      console.log('Creating car with data:', carData);

      const response = await api.post('/cars', carData);
      
      if (response.data.success) {
        setSuccessMessage('Car added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchCars();
      } else {
        setError(response.data.message || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      setError(error.response?.data?.message || 'Failed to add car. Please check all fields.');
    } finally {
      setActionLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  // Handle update car
  const handleUpdateCar = async () => {
    if (!editingCar) return;

    const errors = validateForm(editingCar);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      setFormErrors({});
      
      // Prepare update data
      const updateData = {
        make: editingCar.make.trim(),
        model: editingCar.model.trim(),
        year: parseInt(editingCar.year),
        type: editingCar.type,
        dailyRate: parseFloat(editingCar.dailyRate),
        isAvailable: editingCar.isAvailable
      };

      console.log('Updating car with data:', updateData);

      const response = await api.put(`/cars/${editingCar._id}`, updateData);
      
      if (response.data.success) {
        setSuccessMessage('Car updated successfully!');
        setEditingCar(null);
        fetchCars();
      } else {
        setError(response.data.message || 'Failed to update car');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      setError(error.response?.data?.message || 'Failed to update car');
    } finally {
      setActionLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCar({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Sedan',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seatingCapacity: 5,
      mileage: 15,
      dailyRate: 50,
      securityDeposit: 100,
      isAvailable: true,
      description: '',
      condition: 'Good',
      features: [],
      location: {
        pickupAddress: '',
        city: '',
        state: ''
      }
    });
    setFormErrors({});
  };

  // Handle feature toggle
  const toggleFeature = (feature) => {
    setNewCar(prev => {
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: newFeatures };
    });
  };

  // Filter cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = searchTerm === '' || 
      (car.make && car.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.type && car.type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'available' && car.isAvailable) ||
      (statusFilter === 'unavailable' && !car.isAvailable);
    
    return matchesSearch && matchesStatus;
  });

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  // Render form field helper
  const renderField = (label, name, children, error = null) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Cars Management</h1>
              <p className="text-gray-600 mt-1">Manage your fleet of vehicles</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={actionLoading}
            >
              <FaPlus />
              Add New Car
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-3" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <div className="text-gray-600">
                <span className="font-semibold">{filteredCars.length}</span> of <span className="font-semibold">{cars.length}</span> cars
              </div>
            </div>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cars Found</h3>
              <p className="text-gray-500">
                {cars.length === 0 
                  ? "Your fleet is empty. Add your first car to get started!"
                  : "No cars match your search criteria. Try different filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <FaCar className="text-blue-600 text-lg" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />
                              {car.year} • {car.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FaGasPump className="text-gray-400" />
                            {car.fuelType} • {car.transmission}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <FaUsers className="text-gray-400" />
                            {car.seatingCapacity || 5} seats • {car.mileage || 0} kmpl
                          </div>
                          {car.location && (
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {car.location.city}, {car.location.state}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(car.dailyRate)}/day
                          </div>
                          <div className="text-sm text-gray-500">
                            Deposit: {formatPrice(car.securityDeposit)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          car.isAvailable 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.isAvailable ? (
                            <>
                              <FaCheckCircle />
                              Available
                            </>
                          ) : (
                            <>
                              <FaTimesCircle />
                              Unavailable
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setEditingCar(car)}
                            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                            title="Edit car"
                            disabled={actionLoading}
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(car._id)}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            title="Delete car"
                            disabled={actionLoading}
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Car</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                disabled={actionLoading}
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              {renderField(
                "Make *",
                "make",
                <input
                  type="text"
                  value={newCar.make}
                  onChange={(e) => setNewCar({...newCar, make: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  placeholder="e.g., Toyota"
                />,
                formErrors.make
              )}

              {/* Model */}
              {renderField(
                "Model *",
                "model",
                <input
                  type="text"
                  value={newCar.model}
                  onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  placeholder="e.g., Camry"
                />,
                formErrors.model
              )}

              {/* Year */}
              {renderField(
                "Year *",
                "year",
                <input
                  type="number"
                  value={newCar.year}
                  onChange={(e) => setNewCar({...newCar, year: e.target.value})}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.year
              )}

              {/* Type */}
              {renderField(
                "Type *",
                "type",
                <select
                  value={newCar.type}
                  onChange={(e) => setNewCar({...newCar, type: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Truck">Truck</option>
                </select>,
                formErrors.type
              )}

              {/* Fuel Type */}
              {renderField(
                "Fuel Type *",
                "fuelType",
                <select
                  value={newCar.fuelType}
                  onChange={(e) => setNewCar({...newCar, fuelType: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              )}

              {/* Transmission */}
              {renderField(
                "Transmission *",
                "transmission",
                <select
                  value={newCar.transmission}
                  onChange={(e) => setNewCar({...newCar, transmission: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              )}

              {/* Seating Capacity */}
              {renderField(
                "Seats *",
                "seatingCapacity",
                <input
                  type="number"
                  value={newCar.seatingCapacity}
                  onChange={(e) => setNewCar({...newCar, seatingCapacity: e.target.value})}
                  min="2"
                  max="12"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.seatingCapacity
              )}

              {/* Mileage */}
              {renderField(
                "Mileage (kmpl) *",
                "mileage",
                <input
                  type="number"
                  value={newCar.mileage}
                  onChange={(e) => setNewCar({...newCar, mileage: e.target.value})}
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.mileage
              )}

              {/* Daily Rate */}
              {renderField(
                "Pickup Address *",
                "pickupAddress",
                <input
                  type="text"
                  value={newCar.location.pickupAddress}
                  onChange={(e) => setNewCar({ ...newCar, location: { ...newCar.location, pickupAddress: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  placeholder="e.g., Terminal 3, IGI Airport"
                />,
                formErrors.pickupAddress
              )}

              {renderField(
                "City *",
                "city",
                <input
                  type="text"
                  value={newCar.location.city}
                  onChange={(e) => setNewCar({ ...newCar, location: { ...newCar.location, city: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  placeholder="e.g., Delhi"
                />,
                formErrors.city
              )}

              {renderField(
                "State *",
                "state",
                <input
                  type="text"
                  value={newCar.location.state}
                  onChange={(e) => setNewCar({ ...newCar, location: { ...newCar.location, state: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  placeholder="e.g., Delhi"
                />,
                formErrors.state
              )}

              {/* Daily Rate */}
              {renderField(
                "Daily Rate (₹) *",
                "dailyRate",
                <input
                  type="number"
                  value={newCar.dailyRate}
                  onChange={(e) => setNewCar({...newCar, dailyRate: e.target.value})}
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.dailyRate
              )}

              {/* Security Deposit */}
              {renderField(
                "Security Deposit (₹) *",
                "securityDeposit",
                <input
                  type="number"
                  value={newCar.securityDeposit}
                  onChange={(e) => setNewCar({...newCar, securityDeposit: e.target.value})}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.securityDeposit
              )}

              {/* Condition */}
              {renderField(
                "Condition",
                "condition",
                <select
                  value={newCar.condition}
                  onChange={(e) => setNewCar({...newCar, condition: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Maintenance">Needs Maintenance</option>
                </select>
              )}

              {/* Availability */}
              {renderField(
                "Availability",
                "isAvailable",
                <select
                  value={newCar.isAvailable ? 'available' : 'unavailable'}
                  onChange={(e) => setNewCar({...newCar, isAvailable: e.target.value === 'available'})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              )}

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {featureOptions.map(feature => (
                    <label
                      key={feature}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        newCar.features.includes(feature)
                          ? 'bg-purple-50 border-purple-200 text-purple-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newCar.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                {renderField(
                  "Description",
                  "description",
                  <textarea
                    value={newCar.description}
                    onChange={(e) => setNewCar({...newCar, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    placeholder="Describe the car's features, condition, and any special notes..."
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCar}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  'Add Car'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Car</h3>
              <button
                onClick={() => {
                  setEditingCar(null);
                  setFormErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                disabled={actionLoading}
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              {renderField(
                "Make *",
                "make",
                <input
                  type="text"
                  value={editingCar.make || ''}
                  onChange={(e) => setEditingCar({...editingCar, make: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.make
              )}

              {/* Model */}
              {renderField(
                "Model *",
                "model",
                <input
                  type="text"
                  value={editingCar.model || ''}
                  onChange={(e) => setEditingCar({...editingCar, model: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.model
              )}

              {/* Year */}
              {renderField(
                "Year *",
                "year",
                <input
                  type="number"
                  value={editingCar.year || ''}
                  onChange={(e) => setEditingCar({...editingCar, year: e.target.value})}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.year
              )}

              {/* Type */}
              {renderField(
                "Type *",
                "type",
                <select
                  value={editingCar.type || 'Sedan'}
                  onChange={(e) => setEditingCar({...editingCar, type: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Truck">Truck</option>
                </select>,
                formErrors.type
              )}

              {/* Daily Rate */}
              {renderField(
                "Daily Rate (₹) *",
                "dailyRate",
                <input
                  type="number"
                  value={editingCar.dailyRate || ''}
                  onChange={(e) => setEditingCar({...editingCar, dailyRate: e.target.value})}
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />,
                formErrors.dailyRate
              )}

              {/* Availability */}
              {renderField(
                "Availability",
                "isAvailable",
                <select
                  value={editingCar.isAvailable ? 'available' : 'unavailable'}
                  onChange={(e) => setEditingCar({
                    ...editingCar, 
                    isAvailable: e.target.value === 'available'
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  setEditingCar(null);
                  setFormErrors({});
                }}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCar}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  'Update Car'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarsManagement;
