// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaCar className="text-xl" />
              </div>
              <span className="text-xl font-bold">CarRental</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for premium car rentals. Experience luxury, comfort, and reliability with every journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-white transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/daily" className="text-gray-400 hover:text-white transition-colors">
                  Daily Rentals
                </Link>
              </li>
              <li>
                <Link to="/services/weekly" className="text-gray-400 hover:text-white transition-colors">
                  Weekly Rentals
                </Link>
              </li>
              <li>
                <Link to="/services/monthly" className="text-gray-400 hover:text-white transition-colors">
                  Monthly Rentals
                </Link>
              </li>
              <li>
                <Link to="/services/luxury" className="text-gray-400 hover:text-white transition-colors">
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link to="/services/business" className="text-gray-400 hover:text-white transition-colors">
                  Business Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-gray-400">123 Street, City, Country</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-400">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-400">info@carrental.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCreditCard className="text-blue-400" />
                <span className="text-gray-400">24/7 Booking Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-center">We Accept</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="font-bold">VISA</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="font-bold">MasterCard</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="font-bold">PayPal</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="font-bold">Apple Pay</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="font-bold">Google Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} CarRental. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;