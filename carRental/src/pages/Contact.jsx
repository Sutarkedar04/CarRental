import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-blue-500" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtext: "Mon-Fri, 8AM-8PM"
    },
    {
      icon: <FaEnvelope className="text-2xl text-blue-500" />,
      title: "Email",
      details: "info@premiumrentals.com",
      subtext: "Response within 24 hours"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-blue-500" />,
      title: "Office",
      details: "123 Luxury Street, LA",
      subtext: "Visit by appointment"
    },
    {
      icon: <FaClock className="text-2xl text-blue-500" />,
      title: "Hours",
      details: "24/7 Service",
      subtext: "Emergency support available"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team for any inquiries
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our services? Need help with your booking?
              Our team is here to assist you.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{info.title}</h3>
                    <p className="text-gray-800">{info.details}</p>
                    <p className="text-gray-500 text-sm">{info.subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Frequently Asked</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-bold mb-2">What's the minimum rental period?</h4>
                  <p className="text-gray-600">Minimum 24-hour rental period applies.</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-bold mb-2">Do you offer delivery service?</h4>
                  <p className="text-gray-600">Yes, we deliver within city limits for a fee.</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-bold mb-2">What documents are required?</h4>
                  <p className="text-gray-600">Valid driver's license and credit card are required.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Send Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="corporate">Corporate Rental</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Location</h2>
          <div className="bg-white rounded-xl shadow-lg p-4">
            {/* Replace with actual map component */}
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-4xl text-red-500 mx-auto mb-2" />
                <p className="text-gray-600">Map would be displayed here</p>
                <p className="text-sm text-gray-500">123 Luxury Street, Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;