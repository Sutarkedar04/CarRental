import React, { useState } from 'react';
import { FaPaperPlane, FaCheck, FaGift } from 'react-icons/fa';

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

  return (
    <div className="py-16 bg-linear-to-r from-premium-navy to-gray-900 text-white">
      <div className="container mx-auto section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-premium-gold/20 rounded-full mb-6">
              <FaPaperPlane className="text-premium-gold text-2xl" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Stay Updated with Premium Offers</h2>
            <p className="text-gray-300 text-lg">
              Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Join 10,000+ Premium Members</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <FaCheck className="text-premium-gold" />
                    <span>Exclusive member-only discounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCheck className="text-premium-gold" />
                    <span>Early access to new vehicle models</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCheck className="text-premium-gold" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaGift className="text-premium-gold" />
                    <span className="font-semibold text-premium-gold">Free upgrade on your first booking!</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-premium-gold"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribed}
                    className="w-full btn-primary py-3 text-lg font-bold flex items-center justify-center space-x-2"
                  >
                    {subscribed ? (
                      <>
                        <FaCheck />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>
                  <p className="text-gray-400 text-sm text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-gray-400">Verified Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-gray-400">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-gray-400">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;