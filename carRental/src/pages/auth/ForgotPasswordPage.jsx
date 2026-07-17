import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authService.forgotPassword(email.trim());
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to send a reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/50 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600"><FaKey className="text-2xl text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
          <p className="mt-2 text-sm text-gray-400">Enter your account email and we will send a reset link.</p>
        </div>

        {message && <p className="mb-5 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-300">{message}</p>}
        {error && <p className="mb-5 rounded-lg border border-red-700 bg-red-900/20 p-3 text-sm text-red-300">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">Email address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400"><Link to="/signin" className="text-blue-400 hover:text-blue-300">← Back to sign in</Link></p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
