import React from 'react';
import { FaArrowRight, FaShieldAlt, FaCog, FaStar, FaCheckCircle, FaCarSide, FaRoad } from 'react-icons/fa';
import { GiCarKey, GiPriceTag, GiMechanicGarage } from 'react-icons/gi';

// Import brand logos - you'll need to add these PNG files to your assets
import MercedesLogo from '../assets/brand-logos/Mercedes.png';
import BMWLogo from '../assets/brand-logos/bmw.png';
import AudiLogo from '../assets/brand-logos/audi.png';
import PorscheLogo from '../assets/brand-logos/porsche.png';
import TeslaLogo from '../assets/brand-logos/tesla.png';
import RangeRoverLogo from '../assets/brand-logos/Tata.png';
import LamborghiniLogo from '../assets/brand-logos/lamborghini.png';
import FerrariLogo from '../assets/brand-logos/ferrari.png';
import McLarenLogo from '../assets/brand-logos/McLaren.png';
import BentleyLogo from '../assets/brand-logos/bentley.png';
import RollsRoyceLogo from '../assets/brand-logos/Rolls-Royce.png';
import LexusLogo from '../assets/brand-logos/Lexus.png';

const CarCategory = () => {
  // Define car categories with brand logos
  const carCategories = [
    { id: 1, name: 'Mercedes', count: 24, logo: MercedesLogo, bgColor: 'from-gray-900 to-gray-800' },
    { id: 2, name: 'BMW', count: 18, logo: BMWLogo, bgColor: 'from-blue-900 to-gray-800' },
    { id: 3, name: 'Audi', count: 22, logo: AudiLogo, bgColor: 'from-red-900 to-gray-800' },
    { id: 4, name: 'Porsche', count: 15, logo: PorscheLogo, bgColor: 'from-red-800 to-gray-800' },
    { id: 5, name: 'Tesla', count: 20, logo: TeslaLogo, bgColor: 'from-gray-900 to-red-600/20' },
    { id: 6, name: 'Range Rover', count: 12, logo: RangeRoverLogo, bgColor: 'from-green-900 to-gray-800' },
    { id: 7, name: 'Lamborghini', count: 8, logo: LamborghiniLogo, bgColor: 'from-yellow-900 to-gray-800' },
    { id: 8, name: 'Ferrari', count: 10, logo: FerrariLogo, bgColor: 'from-red-900 to-yellow-600/20' },
    { id: 9, name: 'McLaren', count: 6, logo: McLarenLogo, bgColor: 'from-orange-900 to-gray-800' },
    { id: 10, name: 'Bentley', count: 9, logo: BentleyLogo, bgColor: 'from-gray-900 to-gray-700' },
    { id: 11, name: 'Rolls Royce', count: 7, logo: RollsRoyceLogo, bgColor: 'from-gray-800 to-gray-600' },
    { id: 12, name: 'Lexus', count: 14, logo: LexusLogo, bgColor: 'from-gray-900 to-gray-800' }
  ];

  const premiumFeatures = [
    { icon: <FaShieldAlt />, title: 'Full Warranty', desc: 'Manufacturer coverage' },
    { icon: <GiMechanicGarage />, title: 'Certified Maintenance', desc: 'Dealership service' },
    { icon: <FaStar />, title: 'Latest Models', desc: 'Current year models' },
    { icon: <GiCarKey />, title: 'Keyless Access', desc: 'Digital key system' },
    { icon: <FaRoad />, title: 'Roadside Assistance', desc: '24/7 support' },
    { icon: <FaCog />, title: 'Premium Features', desc: 'All options included' }
  ];

  const topBrands = [
    { name: 'Mercedes', icon: '🌟', bg: 'from-gray-dark to-dark', logo: MercedesLogo },
    { name: 'BMW', icon: '⚡', bg: 'from-gray-dark/90 to-dark/90', logo: BMWLogo },
    { name: 'Audi', icon: '🔰', bg: 'from-gray-dark to-dark', logo: AudiLogo },
    { name: 'Porsche', icon: '🏎️', bg: 'from-gray-dark/90 to-dark/90', logo: PorscheLogo },
    { name: 'Tesla', icon: '⚡', bg: 'from-gray-dark to-dark', logo: TeslaLogo },
    { name: 'Range Rover', icon: '🚙', bg: 'from-gray-dark/90 to-dark/90', logo: RangeRoverLogo }
  ];

  return (
    <div className="relative py-16 bg-linear-to-b from-dark via-gray-dark to-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full translate-x-32 translate-y-32"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/30">
            <span className="text-primary font-bold text-sm tracking-wider">PREMIUM COLLECTION</span>
            <span className="text-light/70 text-xs">Exclusive Brands</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-light">
            Luxury Car Brands
          </h2>
          
          <p className="text-gray-medium text-lg max-w-2xl mx-auto">
            Experience excellence with our curated collection of world-renowned luxury automotive brands
          </p>
        </div>

        {/* Categories Grid with Brand Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16">
          {carCategories.map((category) => (
            <div 
              key={category.id}
              className="group relative bg-linear-to-br from-gray-dark to-dark rounded-xl p-5 text-center cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border border-gray-medium/30 hover:border-primary/30"
            >
              {/* Background Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${category.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Brand Logo Container */}
                <div className="w-16 h-16 mx-auto mb-4 p-3 bg-dark/50 rounded-xl border border-gray-medium/30 group-hover:border-primary/30 transition-colors flex items-center justify-center">
                  <img 
                    src={category.logo} 
                    alt={`${category.name} logo`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                  />
                </div>
                
                <h3 className="font-bold text-base md:text-lg mb-2 text-light group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 text-gray-light group-hover:text-primary/80 text-sm">
                  <span>{category.count} vehicles</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Premium Features Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-light">Premium Benefits</h3>
            <p className="text-gray-medium max-w-2xl mx-auto">
              Experience unmatched quality and service with our premium rental program
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-dark rounded-lg p-4 text-center border border-gray-medium hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-primary text-xl mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-light text-sm mb-1">{feature.title}</h4>
                <p className="text-gray-light text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Brands Section */}
        <div className="bg-linear-to-br from-gray-dark via-dark to-gray-dark rounded-2xl p-6 md:p-8 text-light overflow-hidden border border-gray-medium">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary rounded-full translate-x-16 translate-y-16"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/30">
                <FaCheckCircle className="text-primary" />
                <span className="text-primary font-bold text-sm">OFFICIAL PARTNERS</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-light">
                Brand Partnerships
              </h3>
              
              <p className="text-gray-light mb-6 leading-relaxed">
                We work directly with luxury manufacturers to provide you with the latest models, 
                full warranty coverage, and dealership-level maintenance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-primary mt-1">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-light">Certified Vehicles</h4>
                    <p className="text-gray-medium text-sm">150-point inspection certified</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-primary mt-1">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-light">Latest Technology</h4>
                    <p className="text-gray-medium text-sm">Always up-to-date with newest features</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-primary mt-1">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-light">Priority Support</h4>
                    <p className="text-gray-medium text-sm">Dedicated brand-specific assistance</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Brands Grid with Logos */}
            <div className="lg:w-1/2">
              <div className="grid grid-cols-3 gap-4">
                {topBrands.map((brand) => (
                  <div 
                    key={brand.name}
                    className="group relative bg-linear-to-br from-gray-dark to-dark rounded-xl p-5 text-center hover:from-primary/10 hover:to-primary/5 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-medium hover:border-primary/30"
                  >
                    <div className="relative z-10">
                      {/* Brand Logo */}
                      <div className="w-12 h-12 mx-auto mb-3 p-2 bg-dark/50 rounded-lg border border-gray-medium/30 group-hover:border-primary/30 transition-colors flex items-center justify-center">
                        <img 
                          src={brand.logo} 
                          alt={`${brand.name} logo`}
                          className="w-full h-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                        />
                      </div>
                      
                      <span className="font-semibold text-sm md:text-base text-light">{brand.name}</span>
                      
                      <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-primary text-dark text-xs font-bold px-2 py-1 rounded-lg border border-primary">
                          <GiPriceTag className="inline mr-1" />
                          OFFICIAL
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stats Bar */}
              <div className="mt-8 pt-6 border-t border-gray-medium">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-gray-light text-sm">Models</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-gray-light text-sm">Certified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-gray-light text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCategory;