import React, { useState } from "react";
import HeroCar from "../assets/Hero-car.png";
import { CalendarDays, Clock, MapPin, ArrowRight, Search } from "lucide-react";

const Hero = () => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    pickupDate: "",
    pickupTime: "",
    showCarSelection: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = () => {
    // Validate form data before proceeding
    if (formData.pickupAddress && formData.dropoffAddress && formData.pickupDate && formData.pickupTime) {
      setFormData(prev => ({
        ...prev,
        showCarSelection: true
      }));
      // Here you would typically navigate to car selection page or show a modal
      console.log("Form data submitted:", formData);
      alert("Proceeding to car selection with: " + JSON.stringify(formData, null, 2));
    } else {
      alert("Please fill in all fields before booking.");
    }
  };

  
  

  return (
    <main className="relative min-h-screen pt-20 md:pt-24">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0">
        <img 
          src={HeroCar} 
          alt="Hero car" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <section className="text-white max-w-2xl mb-6 md:mb-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight pt-15">
              Premium car <br /> rental
            </h1>

            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200 max-w-xl">
              We want you to have a stress-free rental experience, so we make
              it easy to rent the car — by providing simple search tools,
              customer reviews and plenty of pick-up locations across the city.
            </p>
          </section>

          {/* Glass Card Strip - Reduced Height */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">
              
              {/* Pick Up Address */}
              <div className="md:col-span-3 space-y-1 md:space-y-2">
                <label className="flex items-center text-white text-xs md:text-sm font-medium">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Pick Up Address
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter pick-up location"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-800 placeholder-gray-500 text-sm"
                />
              </div>

              {/* Drop Off Address */}
              <div className="md:col-span-3 space-y-1 md:space-y-2 relative">
                <label className="flex items-center text-white text-xs md:text-sm font-medium">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Drop Off Address
                </label>
                <input
                  type="text"
                  name="dropoffAddress"
                  value={formData.dropoffAddress}
                  onChange={handleChange}
                  placeholder="Enter drop-off location"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-800 placeholder-gray-500 text-sm"
                />
                
              </div>

              {/* Pick Up Date */}
              <div className="md:col-span-2 space-y-1 md:space-y-2">
                <label className="flex items-center text-white text-xs md:text-sm font-medium">
                  <CalendarDays className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Pick Up Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-800 text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Pick Up Time */}
              <div className="md:col-span-2 space-y-1 md:space-y-2">
                <label className="flex items-center text-white text-xs md:text-sm font-medium">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Pick Up Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-800 text-sm"
                />
              </div>

              {/* Book Now Button - Beside Pick Up Time */}
              <div className="md:col-span-2">
                <button
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 rounded-lg transition duration-300 text-sm md:text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Book Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;