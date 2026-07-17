// src/components/ProtectedRoute.jsx - FIXED
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps any route that requires authentication and/or a specific role.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<UserDashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRole="admin" />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 *
 * requiredRole="admin" will allow BOTH "admin" AND "super_admin" through.
 */
const ProtectedRoute = ({ requiredRole = null }) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in → redirect to sign-in
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // ✅ FIX: Role-based access
  if (requiredRole === 'admin') {
    // Allow both admin and super_admin to access admin routes
    const hasAdminAccess = isAdmin || isSuperAdmin || user.role === 'admin' || user.role === 'super_admin';
    if (!hasAdminAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  } else if (requiredRole === 'super_admin') {
    // Only super_admin can access super_admin routes
    const hasSuperAdminAccess = isSuperAdmin || user.role === 'super_admin';
    if (!hasSuperAdminAccess) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  } else if (requiredRole && user.role !== requiredRole) {
    // Any other specific role check
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
