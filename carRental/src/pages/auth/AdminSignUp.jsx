// pages/auth/AdminSignUp.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaShieldAlt, FaKey, FaBuilding, FaIdCard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    adminCode: '',
    department: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.adminCode.trim()) {
      errors.adminCode = 'Admin code is required';
    } else if (formData.adminCode !== 'ADMIN2024') { // Change this to your actual admin code
      errors.adminCode = 'Invalid admin code';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFormErrors({});
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setFormErrors({ general: result.message });
      }
    } catch (error) {
      setFormErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const departments = [
    'Operations',
    'Management',
    'Customer Service',
    'Fleet Management',
    'Finance',
    'IT Support',
    'Marketing'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-2xl shadow-2xl">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-purple-400">Admin</span> Registration Portal
          </h1>
          <p className="text-gray-400">Create admin account to manage the CarRental system</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Admin Features */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-purple-400" />
              Admin Privileges
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Full System Access</h3>
                  <p className="text-gray-400 text-sm">Manage vehicles, users, and all bookings</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics Dashboard</h3>
                  <p className="text-gray-400 text-sm">Access detailed reports and insights</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">User Management</h3>
                  <p className="text-gray-400 text-sm">Add, edit, and manage all user accounts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">System Controls</h3>
                  <p className="text-gray-400 text-sm">Configure system settings and parameters</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-900/20 border border-purple-700 rounded-xl">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <FaKey className="text-purple-400" />
                Security Notice
              </h3>
              <p className="text-gray-400 text-sm">
                Admin accounts have elevated privileges. Only authorized personnel should create admin accounts.
                Keep your admin credentials secure.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/admin/signin" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Admin Sign In
                </Link>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Need a customer account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Register as Customer
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Admin Registration</h2>

            {/* Error Message */}
            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
                <p className="text-red-400 text-sm">{formErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500`}
                    disabled={loading}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Email *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="admin@carrental.com"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500`}
                    disabled={loading}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(123) 456-7890"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500`}
                    disabled={loading}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.phone}</p>
                )}
              </div>

              {/* Department Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Department *
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.department ? 'border-red-500' : 'border-gray-700'
                    } text-white appearance-none`}
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-gray-800">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.department && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.department}</p>
                )}
              </div>

              {/* Admin Code Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Admin Authorization Code *
                </label>
                <div className="relative">
                  <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                    placeholder="Enter admin authorization code"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.adminCode ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500`}
                    disabled={loading}
                  />
                </div>
                {formErrors.adminCode && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.adminCode}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Contact system administrator for the authorization code
                </p>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Admin Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      formErrors.password ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder-gray-500`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={`${
                        passwordStrength < 50 ? 'text-red-400' :
                        passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Fair' : 'Strong'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Minimum 8 characters with uppercase, number, and special character</p>
                  </div>
                )}
                
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.password}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
                    required
                    disabled={loading}
                  />
                  <span className="ml-3 text-gray-300 text-sm">
                    I acknowledge that I have authorization to create an admin account and will follow all{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300">
                      Security Policies
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Admin Account...
                  </div>
                ) : (
                  'Create Admin Account'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-2"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;