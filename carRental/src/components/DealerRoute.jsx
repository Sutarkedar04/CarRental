import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DealerRoute = ({ children }) => {
  const { user, loading, isDealer, isVerifiedDealer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in but not a dealer account
  if (!isDealer) {
    return <Navigate to="/dashboard" replace />;
  }

  // Dealer, but not yet approved — show a pending message instead of the dashboard
  if (!isVerifiedDealer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="max-w-md text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-white text-lg font-bold mb-2">
            {user.dealerStatus === 'rejected' ? 'Application Not Approved' : 'Application Under Review'}
          </h2>
          <p className="text-gray-400 text-sm">
            {user.dealerStatus === 'rejected'
              ? "Unfortunately your dealer application wasn't approved. Contact support if you think this is a mistake."
              : "Your dealer account is awaiting admin approval. You'll be able to list cars once it's verified — this usually takes 1–2 business days."}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default DealerRoute;