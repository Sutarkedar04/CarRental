import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaCar, FaCreditCard, FaCheck, FaLock, FaPhone, FaIdCard, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { GiCarKey } from 'react-icons/gi';

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
    fullName: '',
    email: '',
    phone: '',
    driverLicense: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking data:', bookingData);
    setStep(4); // Show success step
  };

  const steps = [
    { number: 1, title: 'Location & Dates', icon: <FaCalendarAlt /> },
    { number: 2, title: 'Select Car', icon: <FaCar /> },
    { number: 3, title: 'Details & Payment', icon: <FaUser /> },
    { number: 4, title: 'Confirmation', icon: <FaCheck /> }
  ];

  const carTypes = [
    { type: 'Electric', icon: '⚡', price: '$299/day' },
    { type: 'Luxury Sedan', icon: '🚗', price: '$399/day' },
    { type: 'Premium SUV', icon: '🚙', price: '$449/day' },
    { type: 'Sports Car', icon: '🏎️', price: '$599/day' },
    { type: 'Convertible', icon: '🌅', price: '$499/day' },
    { type: 'Executive', icon: '👔', price: '$699/day' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-b from-gray-dark via-dark to-gray-dark rounded-2xl shadow-2xl shadow-primary/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-medium">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-b from-gray-dark to-dark border-b border-gray-medium z-10 p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2 border border-primary/30">
                  <span className="text-primary font-bold text-xs">PREMIUM BOOKING</span>
                </div>
                <h2 className="text-2xl font-bold text-light">Book Your Premium Car</h2>
                <p className="text-gray-medium text-sm">Complete your booking in 4 easy steps</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-dark rounded-full transition text-light/60 hover:text-light"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex justify-between mt-6 relative">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300
                    ${step >= s.number 
                      ? 'bg-gradient-to-br from-primary to-yellow-500 text-dark border-primary' 
                      : 'bg-gray-dark text-light/30 border-gray-medium'
                    }
                  `}>
                    {step > s.number ? <FaCheck /> : s.icon}
                  </div>
                  <span className={`mt-2 text-xs text-center transition-colors ${
                    step >= s.number ? 'text-light' : 'text-gray-medium'
                  }`}>
                    {s.title}
                  </span>
                </div>
              ))}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-medium -z-10"></div>
              <div 
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary to-yellow-500 -z-10 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-light">Select Location & Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Pickup Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pickupLocation"
                        value={bookingData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Enter pickup address"
                        className="w-full pl-10 pr-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                      />
                      <GiCarKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Return Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="returnLocation"
                        value={bookingData.returnLocation}
                        onChange={handleChange}
                        placeholder="Enter return address"
                        className="w-full pl-10 pr-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                      />
                      <GiCarKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Pickup Date & Time</label>
                    <input
                      type="datetime-local"
                      name="pickupDate"
                      value={bookingData.pickupDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Return Date & Time</label>
                    <input
                      type="datetime-local"
                      name="returnDate"
                      value={bookingData.returnDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-light">Select Your Car</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {carTypes.map((car) => (
                    <button
                      key={car.type}
                      onClick={() => setBookingData({...bookingData, carType: car.type})}
                      className={`group relative p-5 border-2 rounded-xl text-center transition-all ${
                        bookingData.carType === car.type 
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' 
                          : 'border-gray-medium hover:border-primary/50 hover:bg-gray-dark/50'
                      }`}
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{car.icon}</div>
                      <div className="font-bold text-light text-sm mb-1">{car.type}</div>
                      <div className="text-xs text-gray-light">{car.price}</div>
                      
                      {bookingData.carType === car.type && (
                        <div className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold px-2 py-1 rounded-full">
                          SELECTED
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Selected Car Preview */}
                {bookingData.carType && (
                  <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {carTypes.find(c => c.type === bookingData.carType)?.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-light">Selected: {bookingData.carType}</h4>
                        <p className="text-gray-light text-sm">Includes premium features & insurance</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-light">Personal Details & Payment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={bookingData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                      />
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                      />
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-light/80 mb-2 text-sm">Driver's License</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="driverLicense"
                        value={bookingData.driverLicense}
                        onChange={handleChange}
                        placeholder="License number"
                        className="w-full pl-10 pr-4 py-3 bg-dark/50 border border-gray-medium rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-light placeholder-gray-medium"
                      />
                      <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
                    </div>
                  </div>
                </div>
                
                {/* Payment Section */}
                <div className="mt-8 p-6 bg-gray-dark rounded-xl border border-gray-medium">
                  <h4 className="font-bold mb-4 text-light flex items-center gap-2">
                    <FaLock className="text-primary" />
                    Secure Payment
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-3 border-2 border-primary rounded-lg bg-primary/10 text-light">
                      <FaCreditCard className="text-primary" />
                      <span>Credit Card</span>
                    </button>
                    <button className="px-4 py-3 border border-gray-medium rounded-lg hover:border-primary/50 text-light hover:text-primary transition-colors">
                      PayPal
                    </button>
                    <button className="px-4 py-3 border border-gray-medium rounded-lg hover:border-primary/50 text-light hover:text-primary transition-colors">
                      Apple Pay
                    </button>
                    <button className="px-4 py-3 border border-gray-medium rounded-lg hover:border-primary/50 text-light hover:text-primary transition-colors">
                      Google Pay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8 md:py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <FaCheck className="text-primary text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-light">Booking Confirmed!</h3>
                <p className="text-gray-light mb-8 max-w-md mx-auto">
                  Thank you for your booking. We've sent a confirmation email with all the details. Our team will contact you shortly.
                </p>
                <div className="bg-gray-dark rounded-xl p-6 max-w-md mx-auto border border-gray-medium">
                  <div className="text-left space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-light">Booking ID:</span>
                      <span className="font-bold text-light">PR-2024-00123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Car Type:</span>
                      <span className="font-bold text-light">{bookingData.carType || 'Tesla Model S'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Pickup Date:</span>
                      <span className="font-bold text-light">{bookingData.pickupDate || 'Dec 20, 2024'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Total Amount:</span>
                      <span className="font-bold text-primary">$1,299</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-b from-dark to-gray-dark border-t border-gray-medium p-6">
            <div className="flex justify-between items-center">
              {step > 1 && step < 4 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="group flex items-center gap-2 px-6 py-3 border border-gray-medium rounded-lg hover:border-primary/50 text-light hover:text-primary transition-all"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
              )}
              
              <div className="ml-auto flex gap-3">
                {step < 4 ? (
                  <>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-medium rounded-lg hover:border-primary/50 text-light hover:text-primary transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep(step + 1)}
                      className="group bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                    >
                      <span>{step === 3 ? 'Confirm & Pay' : 'Continue'}</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Close & Return
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;