import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authService.resetPassword(token, password);
      setMessage(response.message);
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/50 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600"><FaKey className="text-2xl text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Set a new password</h1>
        </div>

        {message && <p className="mb-5 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-300">{message} <Link to="/signin" className="font-semibold underline">Sign in</Link></p>}
        {error && <p className="mb-5 rounded-lg border border-red-700 bg-red-900/20 p-3 text-sm text-red-300">{error}</p>}

        {!message && <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-gray-300" htmlFor="password">New password
            <div className="relative mt-2">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-4 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </label>
          <label className="block text-sm font-medium text-gray-300" htmlFor="confirmPassword">Confirm new password
            <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Resetting password...' : 'Reset password'}</button>
        </form>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
