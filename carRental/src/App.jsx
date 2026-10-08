import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import SignInPage from './pages/auth/SignInPage';
import SignUp from './pages/auth/SignUp';
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
import RequireRole from './components/RequireRole';
import DealerDashboard from './pages/dealer/DealerDashboard';
import DealerBookings from './pages/dealer/DealerBookings';


// Navbar + Footer
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mt-16">
         <Routes>
  {/* Public */}
  <Route path="/" element={<HomePage />} />
  <Route path="/signin" element={<SignInPage />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
  <Route path="/cars" element={<CarsPage />} />
  <Route path="/cars/:id" element={<CarDetailsPage />} />

  {/* User (any logged-in) */}
  <Route path="/dashboard" element={<RequireRole><UserDashboard /></RequireRole>} />
  <Route path="/bookings" element={<RequireRole><UserBookings /></RequireRole>} />
  <Route path="/bookings/:id" element={<RequireRole><UserBookingDetails /></RequireRole>} />
  <Route path="/profile" element={<RequireRole><ProfilePage /></RequireRole>} />
  <Route path="/dealer/profile" element={<RequireRole><ProfilePage /></RequireRole>} />

  {/* Admin / Super Admin */}
  <Route path="/admin/dashboard" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
  <Route path="/admin/bookings" element={<RequireRole role="admin"><AdminBookings /></RequireRole>} />
  <Route path="/admin/bookings/:id" element={<RequireRole role="admin"><AdminBookingDetail /></RequireRole>} />
  <Route path="/admin/cars" element={<RequireRole role="admin"><AdminCars /></RequireRole>} />
  <Route path="/admin/cars/new" element={<RequireRole role="admin"><AdminCars /></RequireRole>} />
  <Route path="/admin/dealers" element={<RequireRole role="admin"><DealerApprovals /></RequireRole>} />
  <Route path="/admin/users" element={<RequireRole role="admin"><AdminUsers /></RequireRole>} />
  <Route path="/admin/users/:id" element={<RequireRole role="admin"><AdminUsers /></RequireRole>} />
  <Route path="/super-admin/*" element={<RequireRole role="admin"><Navigate to="/admin/dashboard" replace /></RequireRole>} />

  {/* Dealer */}
  <Route path="/dealer/dashboard" element={<RequireRole role="dealer"><DealerDashboard /></RequireRole>} />
  <Route path="/dealer/bookings" element={<RequireRole role="dealer"><DealerBookings /></RequireRole>} />

  <Route path="*" element={<Navigate to="/" />} />
</Routes>
        </main>
        <Footer />
      </div>
    
  );
}

export default App;
