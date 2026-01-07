import React, { useState } from 'react';
import { FaPaperPlane, FaCheck, FaGift, FaShieldAlt, FaStar, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { GiPriceTag } from 'react-icons/gi';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In real app, make API call here
      console.log('Subscribing:', email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const benefits = [
    { icon: <GiPriceTag />, text: 'Exclusive member-only discounts' },
    { icon: <FaStar />, text: 'Early access to new vehicle models' },
    { icon: <FaCheck />, text: 'Personalized recommendations' },
    { icon: <FaGift />, text: 'Free upgrade on first booking' }
  ];

  const stats = [
    { value: '100%', label: 'Verified Vehicles', icon: <FaShieldAlt /> },
    { value: '4.9★', label: 'Customer Rating', icon: <FaStar /> },
    { value: '10K+', label: 'Happy Customers', icon: <FaUsers /> },
    { value: '50+', label: 'Cities Covered', icon: <FaMapMarkerAlt /> }
  ];

  return (
    <div className="relative py-16 bg-gradient-to-b from-dark via-gray-dark to-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
              <FaPaperPlane className="text-primary text-2xl" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-primary/20">
              <span className="text-primary font-bold text-sm">EXCLUSIVE OFFERS</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-light">
              Premium Member Benefits
            </h2>
            
            <p className="text-gray-medium text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions.
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-gray-dark/80 to-dark/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-gray-medium shadow-xl shadow-primary/5 overflow-hidden">
            {/* Card Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-16 translate-y-16"></div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
              {/* Left Content - Benefits */}
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-light">
                    Join 10,000+ Premium Members
                  </h3>
                  
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 bg-gradient-to-r from-transparent to-dark/30 p-3 rounded-lg border border-gray-medium/50"
                      >
                        <div className="text-primary">
                          {benefit.icon}
                        </div>
                        <span className="text-light/90 text-sm md:text-base">
                          {benefit.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Form */}
              <div className="lg:w-1/2">
                <div className="bg-dark/50 backdrop-blur-sm rounded-xl p-6 border border-gray-medium">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-light/80 text-sm mb-2">Your Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter@email.com"
                        className="w-full px-4 py-3 bg-gray-dark/50 border border-gray-medium rounded-lg text-light placeholder-gray-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={subscribed}
                      className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                        subscribed
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-dark hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]'
                      }`}
                    >
                      {subscribed ? (
                        <>
                          <FaCheck />
                          <span>Subscribed Successfully!</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>Subscribe Now</span>
                        </>
                      )}
                    </button>
                    
                    <p className="text-gray-medium text-xs text-center">
                      We respect your privacy. No spam, unsubscribe anytime.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators - Compact */}
          <div className="mt-8 pt-6 border-t border-gray-medium">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-gray-dark/30 rounded-lg border border-gray-medium/30 hover:border-primary/30 transition-colors"
                >
                  <div className="text-primary mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-light mb-1">{stat.value}</div>
                  <div className="text-gray-light text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;