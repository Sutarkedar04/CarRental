// src/components/RequireRole.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Unified route guard.
 *
 * Props:
 *   role: 'admin' | 'super_admin' | 'dealer' | 'any'   (default: 'any')
 *
 * Behaviour:
 *   - Not logged in                    → redirect to /signin
 *   - role="any"                       → any logged-in user passes
 *   - role="admin"                     → admin OR super_admin passes
 *   - role="super_admin"               → super_admin only
 *   - role="dealer"                    → verified dealer only
 *                                        (unverified dealers see a pending screen)
 */
const RequireRole = ({ role = 'any', children }) => {
  const { user, loading, isAdmin, isSuperAdmin, isDealer, isVerifiedDealer } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (role === 'any') return children;

  if (role === 'admin') {
    if (!isAdmin && !isSuperAdmin) return <Navigate to="/dashboard" replace />;
    return children;
  }

  if (role === 'super_admin') {
    if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;
    return children;
  }

  if (role === 'dealer') {
    if (!isDealer) return <Navigate to="/dashboard" replace />;

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
  }

  return <Navigate to="/" replace />;
};

export default RequireRole;