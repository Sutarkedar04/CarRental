import React from 'react';
import { FaRoad, FaStar, FaUserTie, FaPlane, FaShieldAlt, FaHeadset, FaBuilding, FaCalendarAlt, FaCar } from 'react-icons/fa';
import { GiCommercialAirplane } from 'react-icons/gi';
import { popularRoutes, services } from '../data';

const ServicesSection = () => {
  const premiumServices = [
    {
      icon: <FaRoad />,
      title: "Intercity Rides",
      description: "Comfortable long-distance travel between major cities",
      features: ["WiFi onboard", "Refreshments", "Comfort stops"]
    },
    {
      icon: <FaStar />,
      title: "Premium Service",
      description: "White-glove luxury experience with personal concierge",
      features: ["Personal assistant", "Priority booking", "VIP treatment"]
    },
    {
      icon: <FaUserTie />,
      title: "Chauffeur Service",
      description: "Professional licensed drivers at your service",
      features: ["Multi-lingual drivers", "Corporate accounts", "24/7 availability"]
    },
    {
      icon: <GiCommercialAirplane />,
      title: "Airport Transfer",
      description: "Timely airport pickups and drop-offs",
      features: ["Flight tracking", "Meet & greet", "Luggage assistance"]
    },
    {
      icon: <FaShieldAlt />,
      title: "Insurance Coverage",
      description: "Comprehensive insurance for complete peace of mind",
      features: ["Full coverage", "Zero deductible", "24/7 support"]
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
      features: ["Instant response", "Multi-channel", "Emergency assistance"]
    }
  ];

  const additionalServices = [
    {
      icon: <FaBuilding />,
      title: "Corporate Programs",
      description: "Special rates and services for corporate clients with dedicated account management.",
      gradient: "from-primary/10 to-primary/5"
    },
    {
      icon: <FaCar />,
      title: "Long Term Rentals",
      description: "Special monthly rates for extended rentals with flexible terms and conditions.",
      gradient: "from-gray-dark/10 to-dark/10"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Special Events",
      description: "Luxury vehicles for weddings, business events, and special occasions.",
      gradient: "from-gray-medium/10 to-gray-dark/10"
    }
  ];

  return (
    <div className="relative py-16 bg-linear-to-b from-dark via-gray-dark to-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Services Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/30">
            <span className="text-primary font-bold text-sm">PREMIUM SERVICES</span>
            <span className="text-light/70 text-xs">Beyond Rental</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-light">
            Our Premium Services
          </h2>
          
          <p className="text-gray-medium text-lg max-w-2xl mx-auto">
            Beyond just car rental - we provide a complete luxury mobility experience tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {premiumServices.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-gray-dark rounded-xl p-6 hover:-translate-y-1 transition-all duration-300 border border-gray-medium hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-5">
                <div className="text-primary text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-light">{service.title}</h3>
                <p className="text-gray-light text-sm mb-5 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-light text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Hover Line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-primary to-yellow-500 transition-all duration-300 group-hover:w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Popular Routes Section */}
        <div className="bg-linear-to-br from-gray-dark via-dark to-gray-dark rounded-2xl p-6 md:p-8 border border-gray-medium mb-12">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Content */}
            <div className="lg:w-2/5">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 border border-primary/30">
                  <span className="text-primary font-bold text-xs">POPULAR ROUTES</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-light">Most Requested Routes</h3>
                <p className="text-gray-light mb-6 leading-relaxed">
                  Most requested routes by our premium clients. Book these routes for special discounts.
                </p>
                
                <button className="group bg-linear-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-dark font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 text-sm">
                  <span className="group-hover:scale-105 transition-transform">View All Routes</span>
                </button>
              </div>
            </div>
            
            {/* Right Content - Routes Grid */}
            <div className="lg:w-3/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.map((route, index) => (
                  <div 
                    key={index}
                    className="group bg-dark/50 backdrop-blur-sm rounded-xl p-4 border border-gray-medium hover:border-primary/30 hover:bg-dark/70 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-light text-sm">{route}</span>
                      <span className="text-primary text-sm group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div className="text-gray-light text-xs">
                      Starting from <span className="font-bold text-primary">$299</span>
                    </div>
                    
                    {/* Route Indicator */}
                    <div className="mt-3 flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1 h-0.5 bg-gray-medium"></div>
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalServices.map((service, index) => (
            <div 
              key={index}
              className={`group relative bg-linear-to-br ${service.gradient} rounded-xl p-6 border border-gray-medium hover:border-primary/30 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="mb-4">
                <div className="text-primary text-xl mb-4">
                  {service.icon}
                </div>
                
                <h4 className="text-lg font-bold mb-3 text-light">{service.title}</h4>
                <p className="text-gray-light text-sm mb-5 leading-relaxed">{service.description}</p>
                
                <button className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 rounded-tr-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;