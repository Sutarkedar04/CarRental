import { Routes, Route, Navigate } from 'react-router-dom';
import ToastProvider from './providers/ToastProvider';

// Pages
import HomePage from './pages/Home';
import SignInPage from './pages/auth/SignInPage';
import SignUp from './pages/auth/SignUp';
import AdminSignUp from './pages/auth/AdminSignUp';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserBookings from './pages/user/UserBookings';
import AdminBookings from './pages/admin/BookingsManagement';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import AdminCars from './pages/admin/CarsManagement';
import AdminUsers from './pages/admin/UsersManagement';
import ProfilePage from './pages/ProfilePage';
import UserBookingDetails from './pages/user/UserBookingDetails';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import DealerApprovals from './pages/admin/DealerApprovals';
// Route guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import DealerDashboard from './pages/dealer/DealerDashboard';
import DealerBookings from './pages/dealer/DealerBookings';
import DealerRoute from './components/DealerRoute';

// Navbar + Footer
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute><UserDashboard /></PrivateRoute>
            } />
            <Route path="/bookings" element={
              <PrivateRoute><UserBookings /></PrivateRoute>
            } />
            <Route path="/bookings/:id" element={
              <PrivateRoute><UserBookingDetails /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
            <Route path="/dealer/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
            
            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/bookings" element={
              <AdminRoute><AdminBookings /></AdminRoute>
            } />
            <Route path="/admin/bookings/:id" element={
              <AdminRoute><AdminBookingDetail /></AdminRoute>
            } />
            <Route path="/admin/cars" element={
              <AdminRoute><AdminCars /></AdminRoute>
            } />
            <Route path="/admin/dealers" element={
  <AdminRoute>
    <DealerApprovals />
  </AdminRoute>
} />
            <Route path="/admin/cars/new" element={
              <AdminRoute><AdminCars /></AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute><AdminUsers /></AdminRoute>
            } />
            <Route path="/admin/users/:id" element={
              <AdminRoute><AdminUsers /></AdminRoute>
            } />
            <Route path="/super-admin/*" element={
              <AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>
            } />
            {/* Dealer Protected Routes */}
<Route path="/dealer/dashboard" element={
  <DealerRoute><DealerDashboard /></DealerRoute>
} />
            <Route path="/dealer/bookings" element={
              <DealerRoute><DealerBookings /></DealerRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
