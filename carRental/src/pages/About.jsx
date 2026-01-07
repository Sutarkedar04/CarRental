import React from 'react';
import { FaCheck, FaStar, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaStar className="text-4xl text-yellow-500" />,
      title: "Premium Quality",
      description: "Only the finest luxury vehicles in pristine condition"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: "Fully Insured",
      description: "Comprehensive insurance coverage for peace of mind"
    },
    {
      icon: <FaHeadset className="text-4xl text-blue-500" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need it"
    },
    {
      icon: <FaCheck className="text-4xl text-purple-500" />,
      title: "Easy Process",
      description: "Simple booking and flexible cancellation policies"
    }
  ];

  return (
    <div className="pt-24 min-h-screen">
      
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Premium Rentals</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We redefine luxury car rentals by combining exceptional vehicles with 
            unparalleled service for an experience that exceeds expectations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-lg mx-auto">
            <h3 className="text-3xl font-bold mb-6">Our Commitment</h3>
            <p className="text-gray-700 mb-6">
              At Premium Rentals, we believe that luxury should be accessible, reliable, 
              and stress-free. Our carefully curated fleet of high-end vehicles is 
              maintained to the highest standards, ensuring you enjoy both performance 
              and comfort.
            </p>
            
            <h3 className="text-3xl font-bold mb-6">What Sets Us Apart</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaCheck className="text-blue-600" />
                </div>
                <span className="text-gray-700">Personalized service tailored to your needs</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaCheck className="text-blue-600" />
                </div>
                <span className="text-gray-700">Latest model luxury vehicles with premium features</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaCheck className="text-blue-600" />
                </div>
                <span className="text-gray-700">Transparent pricing with no hidden charges</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaCheck className="text-blue-600" />
                </div>
                <span className="text-gray-700">Multiple convenient pickup and drop-off locations</span>
              </li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-xl italic text-gray-800">
                "Our goal is simple: to provide you with a luxury car rental experience 
                that's as exceptional as the vehicles we offer."
              </p>
              <p className="font-bold mt-4">— Alex Johnson, Founder & CEO</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Difference</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your luxury vehicle today and discover why we're the preferred 
            choice for discerning clients.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Start Your Journey
          </button>
        </div>
      </div>

    </div>
  );
};

export default About;