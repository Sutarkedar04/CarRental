import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaBolt } from 'react-icons/fa';
import { GiPriceTag } from 'react-icons/gi';
import BookingModal from './BookingModal';

const BookEv = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDate: '',
    returnDate: '',
    carType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pickupLocation && formData.pickupDate && formData.returnDate) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center bg-linear-to-br from-gray-900 to-gray-950 text-light overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content - Compact */}
            <div className="lg:w-5/12">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <FaBolt className="text-secondary" />
                  <span className="text-secondary font-bold text-sm">FLASH DEAL</span>
                  <span className="text-light/80 text-xs">50% OFF</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-blue-400">Ev</span> Rental
                  <br />
                  <span className="text-light text-3xl">with Big Discount</span>
                </h1>
                
                <p className="text-light/70 mb-8 leading-relaxed">
                  Experience premium electric driving. Book now and get 50% off your first Ev rental.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-light/60 text-sm">Rentals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-light/60 text-sm">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-light/60 text-sm">Support</div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group bg-linear-to-r from-secondary to-blue-300 hover:from-blue-300 hover:to-secondary text-dark font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 w-full lg:w-auto"
              >
                <FaCar />
                <span>Book Ev Now</span>
              </button>
            </div>

            {/* Right Content - Compact Form */}
            <div className="lg:w-6/12">
              <div className="bg-gray-dark/50 backdrop-blur-lg rounded-xl p-6 border border-gray-medium/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Quick Booking</h2>
                  <div className="flex items-center gap-2">
                    <GiPriceTag className="text-primary" />
                    <span className="text-primary font-bold">50% OFF</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-light/80 text-sm mb-2">Pickup Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        placeholder="Enter location"
                        className="w-full pl-10 pr-4 py-3 bg-light/5 border border-gray-medium/50 rounded-lg text-light placeholder-light/40 text-sm focus:outline-none focus:border-secondary"
                        required
                      />
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light/50 text-sm" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-light/80 text-sm mb-2">Pickup Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-light/5 border border-gray-medium/50 rounded-lg text-light text-sm focus:outline-none focus:border-secondary"
                          required
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light/50 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-light/80 text-sm mb-2">Return Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-light/5 border border-gray-medium/50 rounded-lg text-light text-sm focus:outline-none focus:border-secondary"
                          required
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light/50 text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-light/80 text-sm mb-2">Ev Model</label>
                    <select 
                      name="carType"
                      value={formData.carType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-light/5 border border-gray-medium/50 rounded-lg text-light text-sm focus:outline-none focus:border-secondary"
                    >
                      <option value="" className="bg-gray-dark">Select Model</option>
                      <option value="Mahindra BE6" className="bg-gray-dark">Mahindra BE6</option>
                      <option value="Mahindra XEV 9e/9s" className="bg-gray-dark">Mahindra XEV 9e/9s</option>
                      <option value="Tata Nexon EV" className="bg-gray-dark">Tata Nexon EV</option>
                      <option value="Tata Punch EV" className="bg-gray-dark">Tata Punch EV</option>
                      <option value="Tata Harrier EV" className="bg-gray-dark">Tata Harrier EV</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-linear-to-r from-secondary to-blue-300 hover:from-blue-300 hover:to-secondary text-dark font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] text-sm"
                  >
                    Find Available Cars
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default BookEv;