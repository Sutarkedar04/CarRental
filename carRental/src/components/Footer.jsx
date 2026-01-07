import React from 'react';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <FaCar className="text-blue-500 text-3xl mr-2" />
              <span className="text-2xl font-bold">PremiumRentals</span>
            </div>
            <p className="text-gray-400 text-center md:text-left">
              Luxury car rental service with premium vehicles and exceptional customer service.
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-around">
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Safety</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition">
                <FaFacebook />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition">
                <FaInstagram />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                <FaYoutube />
              </a>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Premium Car Rentals. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-white transition mx-2">Privacy Policy</a>
            <a href="#" className="hover:text-white transition mx-2">Terms of Use</a>
            <a href="#" className="hover:text-white transition mx-2">Legal</a>
            <a href="#" className="hover:text-white transition mx-2">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;