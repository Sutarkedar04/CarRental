// src/components/Navbar.jsx - UPDATED to handle super_admin + dealer
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCrown, FaUserCircle, FaHome, FaCalendarAlt, FaUsers, FaCog, FaStore, FaClipboardList, FaUserClock } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin, isSuperAdmin, isDealer, isVerifiedDealer } = useAuth();
  const navigate = useNavigate();

  // ---- Smart scroll hide/show logic ----
  const controls = useAnimation();
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
  let ticking = false;

  const update = () => {
    const currentScrollY = window.scrollY;

    if (isMenuOpen) {
      ticking = false;
      return;
    }

    if (currentScrollY < 80) {
      setHidden(false);
    } else if (currentScrollY > lastScrollY.current) {
      setHidden(true);
    } else if (currentScrollY < lastScrollY.current) {
      setHidden(false);
    }

    lastScrollY.current = currentScrollY;
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [isMenuOpen]);

  useEffect(() => {
    controls.start(hidden ? 'hidden' : 'visible');
  }, [hidden, controls]);

  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: '-120%', opacity: 0 },
  };
  // ---------------------------------------

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const hasAdminAccess = isAdmin || isSuperAdmin || user?.role === 'admin' || user?.role === 'super_admin';

  // Admin navigation links (for both admin and super_admin)
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaCrown className="text-purple-400" /> },
    { to: '/admin/bookings', label: 'Bookings', icon: <FaCalendarAlt className="text-blue-400" /> },
    { to: '/admin/cars', label: 'Cars', icon: <FaCar className="text-green-400" /> },
    { to: '/admin/dealers', label: 'Dealer Applications', icon: <FaUserClock className="text-orange-400" /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers className="text-red-400" /> },
  ];

  // Dealer navigation links
  const dealerLinks = [
    { to: '/', label: 'Home', icon: <FaHome className="text-blue-400" /> },
    { to: '/dealer/dashboard', label: 'My Cars', icon: <FaStore className="text-blue-400" /> },
    { to: '/dealer/bookings', label: 'My Bookings', icon: <FaClipboardList className="text-blue-400" /> },
  ];

  const userLinks = [
    { to: '/', label: 'Home', icon: <FaHome className="text-blue-400" /> },
    { to: '/cars', label: 'Cars', icon: <FaCar className="text-blue-400" /> },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard', icon: <FaUser className="text-blue-400" /> }] : []),
  ];

  // Priority: admin > dealer > customer
  const navLinks = hasAdminAccess ? adminLinks : (isDealer ? dealerLinks : userLinks);

  // Role label shown in the account chip
  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : isAdmin
    ? 'Admin'
    : isDealer
    ? (isVerifiedDealer ? 'Dealer' : 'Dealer (Pending)')
    : 'Customer';

  return (
    <motion.nav
      initial="visible"
      animate={controls}
      variants={navVariants}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-4 left-4 right-4 z-50 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Left Side */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full">
                <FaCar className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">CarRental</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/80 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 hover:bg-white/10"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions - Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {isDealer && !isVerifiedDealer && (
                  <span className="text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 px-3 py-1.5 rounded-full font-medium">
                    Awaiting approval
                  </span>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        hasAdminAccess
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                          : isDealer
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700'
                      }`}>
                        {hasAdminAccess ? (
                          <FaCrown className="text-white text-sm" />
                        ) : isDealer ? (
                          <FaStore className="text-white text-sm" />
                        ) : (
                          <FaUserCircle className="text-white text-sm" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">
                          {user.name?.split(' ')[0] || 'User'}
                        </p>
                        <p className="text-xs text-white/60">{roleLabel}</p>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-48 bg-black/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to={isDealer ? '/dealer/profile' : '/profile'}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserCircle className="text-white/60" />
                      <span>My Profile</span>
                    </Link>

                    {isDealer && (
                      <Link
                        to="/dealer/dashboard"
                        className="flex items-center gap-3 px-4 py-2 mx-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaStore className="text-white/60" />
                        <span>My Cars</span>
                      </Link>
                    )}

                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-full text-red-400 hover:bg-red-500/10 w-[calc(100%-1rem)] text-left transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-white/90 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full transition-all duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/80 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-xl border border-white/10 fixed inset-x-4 top-20 bottom-4 overflow-y-auto z-40 rounded-3xl">
          <div className="px-2 pt-4 pb-3 space-y-1">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-white/90 hover:text-white block px-4 py-3 rounded-full text-base font-medium bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              {user ? (
                <>
                  <div className="px-4 py-4 mb-2 mx-3 bg-white/5 rounded-3xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        hasAdminAccess
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                          : isDealer
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700'
                      }`}>
                        {hasAdminAccess ? (
                          <FaCrown className="text-white" />
                        ) : isDealer ? (
                          <FaStore className="text-white" />
                        ) : (
                          <FaUserCircle className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/60">{roleLabel}</p>
                      </div>
                    </div>
                    {isDealer && !isVerifiedDealer && (
                      <p className="mt-3 text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 px-3 py-2 rounded-full">
                        Your dealer account is awaiting admin approval. You can't list cars yet.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 px-3">
                    <Link
                      to={hasAdminAccess ? '/admin/dashboard' : (isDealer ? '/dealer/dashboard' : '/dashboard')}
                      className="text-white/90 hover:text-white block px-4 py-3 rounded-full text-base font-medium bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <FaUser className="text-white/60" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to={isDealer ? '/dealer/profile' : '/profile'}
                      className="text-white/90 hover:text-white block px-4 py-3 rounded-full text-base font-medium bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-white/60" />
                        <span>My Profile</span>
                      </div>
                    </Link>

                    {isDealer && !hasAdminAccess && (
                      <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="text-xs text-white/50 font-semibold px-4 mb-1">DEALER PANEL</p>
                        <Link
                          to="/dealer/dashboard"
                          className="text-orange-300 hover:text-orange-200 block px-4 py-3 rounded-full text-base font-medium bg-orange-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaStore className="text-orange-400" />
                            <span>My Cars</span>
                          </div>
                        </Link>
                        <Link
                          to="/dealer/bookings"
                          className="text-orange-300 hover:text-orange-200 block px-4 py-3 rounded-full text-base font-medium bg-orange-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaClipboardList className="text-orange-400" />
                            <span>My Bookings</span>
                          </div>
                        </Link>
                      </>
                    )}

                    {hasAdminAccess && (
                      <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="text-xs text-white/50 font-semibold px-4 mb-1">ADMIN PANEL</p>
                        <Link
                          to="/admin/dashboard"
                          className="text-purple-300 hover:text-purple-200 block px-4 py-3 rounded-full text-base font-medium bg-purple-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaCrown className="text-purple-400" />
                            <span>Admin Dashboard</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="text-purple-300 hover:text-purple-200 block px-4 py-3 rounded-full text-base font-medium bg-purple-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-purple-400" />
                            <span>Manage Bookings</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/cars"
                          className="text-purple-300 hover:text-purple-200 block px-4 py-3 rounded-full text-base font-medium bg-purple-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaCar className="text-purple-400" />
                            <span>Manage Cars</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/dealers"
                          className="text-purple-300 hover:text-purple-200 block px-4 py-3 rounded-full text-base font-medium bg-purple-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaUserClock className="text-purple-400" />
                            <span>Dealer Applications</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/users"
                          className="text-purple-300 hover:text-purple-200 block px-4 py-3 rounded-full text-base font-medium bg-purple-500/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <FaUsers className="text-purple-400" />
                            <span>Manage Users</span>
                          </div>
                        </Link>
                      </>
                    )}

                    <div className="my-2 border-t border-white/10"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-400 hover:text-red-300 block px-4 py-3 rounded-full text-base font-medium bg-red-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-4">
                  <div className="space-y-3">
                    <Link
                      to="/signin"
                      className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center border-2 border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;