// pages/auth/SignUp.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCar, FaShieldAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    dealerProfile: {
      businessName: '',
      city: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect an already-logged-in user based on their role, not just to /dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'dealer') {
        navigate('/dealer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const isDealer = formData.role === 'dealer';

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    // ✅ Dealer-specific validation
    if (isDealer) {
      if (!formData.dealerProfile.businessName.trim()) {
        errors.businessName = 'Business name is required for dealer accounts';
      }
      if (!formData.dealerProfile.city.trim()) {
        errors.city = 'Operating city is required so customers can find your cars';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
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

  const handleDealerFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      dealerProfile: { ...prev.dealerProfile, [field]: value }
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    // Clear dealer-specific errors when switching back to customer
    if (role === 'customer') {
      setFormErrors(prev => {
        const { businessName, city, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFormErrors({});

    try {
      // Only send dealerProfile when actually registering as a dealer
      const payload = isDealer
        ? formData
        : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, role: 'customer' };

      const result = await register(payload);

      if (result.success) {
        // ✅ Send dealers to their own dashboard, not the customer dashboard.
        // If your backend puts new dealer accounts into a "pending approval"
        // state before they can use the dealer dashboard, swap this back to
        // '/dealer/pending' — but if approval already happened (or isn't
        // required), '/dealer/dashboard' is correct.
        navigate(isDealer ? '/dealer/dashboard' : '/dashboard');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl shadow-2xl">
              <FaCar className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join <span className="text-blue-400">CarRental</span>
          </h1>
          <p className="text-gray-400">
            {isDealer ? 'List your fleet and start earning' : 'Create your account and start renting in minutes'}
          </p>
        </div>

        {/* ✅ Role Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-1 inline-flex">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isDealer ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              I want to rent a car
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('dealer')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isDealer ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              I want to list my cars
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Benefits */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-blue-400" />
              {isDealer ? 'Dealer Benefits' : 'Customer Benefits'}
            </h2>

            <div className="space-y-6">
              {isDealer ? (
                <>
                  <Benefit color="blue" title="Reach More Renters" desc="Your cars get listed to customers across every city we operate in" />
                  <Benefit color="green" title="You Set the Terms" desc="Control your own pricing, availability, and fleet" />
                  <Benefit color="purple" title="Simple Dashboard" desc="Manage your cars and bookings in one place" />
                  <Benefit color="yellow" title="Verified Badge" desc="Once approved, your listings carry a verified-dealer badge" />
                </>
              ) : (
                <>
                  <Benefit color="blue" title="Exclusive Deals" desc="Get access to members-only discounts and promotions" />
                  <Benefit color="green" title="Easy Booking" desc="Quick and seamless car rental process" />
                  <Benefit color="purple" title="24/7 Support" desc="Round-the-clock customer service" />
                  <Benefit color="yellow" title="Flexible Options" desc="Wide range of vehicles to choose from" />
                </>
              )}
            </div>

            {isDealer && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
                <p className="text-blue-300 text-sm">
                  ℹ️ Dealer accounts are reviewed by our team before you can list cars. This usually takes 1–2 business days.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">
              {isDealer ? 'Create Dealer Account' : 'Create Customer Account'}
            </h2>

            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
                <p className="text-red-400 text-sm">{formErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Field
                label="Full Name *"
                icon={FaUser}
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                placeholder="John Doe"
                error={formErrors.name}
                disabled={loading}
              />

              <Field
                label="Email Address *"
                icon={FaEnvelope}
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                placeholder="you@example.com"
                error={formErrors.email}
                disabled={loading}
              />

              <Field
                label="Phone Number *"
                icon={FaPhone}
                type="tel"
                value={formData.phone}
                onChange={() => {}}
                onInputChange={handlePhoneChange}
                placeholder="(123) 456-7890"
                error={formErrors.phone}
                disabled={loading}
              />

              {/* ✅ Dealer-only fields */}
              {isDealer && (
                <>
                  <Field
                    label="Business Name *"
                    icon={FaBuilding}
                    value={formData.dealerProfile.businessName}
                    onChange={(v) => handleDealerFieldChange('businessName', v)}
                    placeholder="e.g. Sharma Car Rentals"
                    error={formErrors.businessName}
                    disabled={loading}
                  />

                  <Field
                    label="Operating City *"
                    icon={FaMapMarkerAlt}
                    value={formData.dealerProfile.city}
                    onChange={(v) => handleDealerFieldChange('city', v)}
                    placeholder="e.g. Delhi"
                    error={formErrors.city}
                    disabled={loading}
                  />
                </>
              )}

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
                      <div className={`h-full ${getStrengthColor()} transition-all duration-300`} style={{ width: `${passwordStrength}%` }}></div>
                    </div>
                  </div>
                )}

                {formErrors.password && <p className="text-red-500 text-sm mt-2">{formErrors.password}</p>}
              </div>

              <div className="mb-6">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500" required disabled={loading} />
                  <span className="ml-3 text-gray-300 text-sm">
                    I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </div>
                ) : isDealer ? 'Apply as Dealer' : 'Create Customer Account'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-2">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

const BENEFIT_STYLES = {
  blue:   { bg: 'bg-blue-500/20',   dot: 'bg-blue-400'   },
  green:  { bg: 'bg-green-500/20',  dot: 'bg-green-400'  },
  purple: { bg: 'bg-purple-500/20', dot: 'bg-purple-400' },
  yellow: { bg: 'bg-yellow-500/20', dot: 'bg-yellow-400' },
};
// Small reusable bits kept in the same file to avoid extra imports
const Benefit = ({ color, title, desc }) => {
  const styles = BENEFIT_STYLES[color] ?? BENEFIT_STYLES.blue;
  return (
    <div className="flex items-start gap-3">
      <div className={`${styles.bg} p-2 rounded-lg`}>
        <div className={`w-2 h-2 ${styles.dot} rounded-full`}></div>
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
};

const Field = ({ label, icon: Icon, type = 'text', value, onChange, onInputChange, placeholder, error, disabled }) => (
  <div className="mb-6">
    <label className="block text-gray-300 text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type={type}
        value={value}
        onChange={onInputChange ? onInputChange : (e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? 'border-red-500' : 'border-gray-700'
        } text-white placeholder-gray-500`}
        disabled={disabled}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

export default SignUp;