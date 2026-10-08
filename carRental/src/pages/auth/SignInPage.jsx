import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaCar, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaGoogle, FaFacebook, FaGithub
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: Safely get the return URL from state (handle both string and object)
  let from = '/dashboard'; // Default value
  const stateFrom = location.state?.from;
  
  if (typeof stateFrom === 'string') {
    from = stateFrom;
  } else if (stateFrom && typeof stateFrom === 'object' && stateFrom.pathname) {
    // Handle case where from might be a location object
    from = stateFrom.pathname + (stateFrom.search || '');
  }
  
  // Check if it's a car booking page with dates
  const isCarBookingPage = from.includes('/cars/') && from.includes('startDate');
  
  const redirected = useRef(false);

  useEffect(() => {
  if (authLoading || !user || redirected.current) return;

  redirected.current = true;

  if (user.role === 'admin' || user.role === 'super_admin') {
    navigate('/admin/dashboard', { replace: true });
  } else if (user.role === 'dealer') {
    navigate('/dealer/dashboard', { replace: true });
  } else {
    navigate(from, { replace: true });
  }
}, [user, authLoading, navigate, from]);

// Reset the ref when the component unmounts so a future mount can redirect again.
useEffect(() => {
  return () => {
    redirected.current = false;
  };
}, []);

  // While AuthContext rehydrates, show spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Already logged in — effect will redirect; render nothing to avoid flicker
  if (user) return null;

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setFormErrors({});

    try {
      const result = await login(formData);
      if (!result.success) {
        setFormErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({ general: 'An unexpected error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login is coming soon!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl shadow-2xl">
              <FaCar className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back to <span className="text-blue-400">CarRental</span>
          </h1>
          <p className="text-gray-400">
            {isCarBookingPage 
              ? 'Sign in to complete your booking' 
              : 'Sign in to access your dashboard and manage rentals'}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Show booking reminder if applicable */}
          {isCarBookingPage && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-xl">
              <p className="text-blue-400 text-sm text-center">
                📅 Complete your booking after signing in
              </p>
            </div>
          )}

          {/* Social Login */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Google', icon: <FaGoogle className="text-red-500 text-xl" /> },
                { label: 'Facebook', icon: <FaFacebook className="text-blue-500 text-xl" /> },
                { label: 'GitHub', icon: <FaGithub className="text-gray-300 text-xl" /> },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => handleSocialLogin(label)}
                  className="flex items-center justify-center p-3 bg-gray-900 hover:bg-gray-800 rounded-xl transition-all border border-gray-700"
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-4 text-gray-500 text-sm">Or continue with email</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>
          </div>

          {/* General Error */}
          {formErrors.general && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
              <p className="text-red-400 text-sm text-center">{formErrors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  disabled={submitting}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-sm mt-2">{formErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300 text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={submitting}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-500 ${
                    formErrors.password ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm mt-2">{formErrors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-8">
              <input type="checkbox" id="remember" disabled={submitting}
                className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500" />
              <label htmlFor="remember" className="ml-3 text-gray-300">Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing In...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Create customer account
              </Link>
            </p>
            <div className="mt-4">
              <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
