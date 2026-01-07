import React from 'react';
import { FaCar, FaShuttleVan, FaPlane, FaGlassCheers, FaCrown, FaRoad } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaCrown className="text-4xl text-blue-500" />,
      title: "Luxury Sedans",
      description: "Premium sedans for business travel and executive needs",
      features: ["Mercedes S-Class", "BMW 7 Series", "Audi A8"]
    },
    {
      icon: <FaCar className="text-4xl text-green-500" />,
      title: "SUV Rentals",
      description: "Luxury SUVs for family trips and group travel",
      features: ["Range Rover", "Mercedes G-Class", "BMW X7"]
    },
    {
      icon: <FaGlassCheers className="text-4xl text-purple-500" />,
      title: "Wedding Cars",
      description: "Elegant vehicles for your special day",
      features: ["Rolls Royce", "Bentley", "Classic Cars"]
    },
    {
      icon: <FaPlane className="text-4xl text-red-500" />,
      title: "Airport Transfers",
      description: "Reliable airport pickup and drop-off service",
      features: ["Flight Tracking", "Meet & Greet", "24/7 Service"]
    },
    {
      icon: <FaShuttleVan className="text-4xl text-orange-500" />,
      title: "Corporate Rentals",
      description: "Long-term rentals for businesses",
      features: ["Monthly Plans", "Fleet Management", "Priority Service"]
    },
    {
      icon: <FaRoad className="text-4xl text-yellow-500" />,
      title: "Road Trip Packages",
      description: "Curated packages for scenic drives",
      features: ["GPS Included", "Insurance Coverage", "Flexible Duration"]
    }
  ];

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Premium car rental services tailored to your needs
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-6 text-blue-600 font-semibold hover:text-blue-800 transition">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Choose your preferred vehicle and service package
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;