import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaLinkedin, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-violet-600 dark:from-violet-700 dark:to-violet-700 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="text-center text-white" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Contact <span className="text-yellow-300">Us</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with us!
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="dark:fill-slate-900" d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f3f4f6"/>
          </svg>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
                  Send us a <span className="text-purple-600">Message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                        placeholder="Your Phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all resize-none"
                      placeholder="Your Message..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    <FaPaperPlane />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info & Map */}
            <div data-aos="fade-left" className="space-y-8">
              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                    <FaMapMarkerAlt className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Address</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    123 Tile Avenue<br />
                    MG Road, Bangalore<br />
                    Karnataka 560001
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center mb-4">
                    <FaPhoneAlt className="text-2xl text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Phone</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    +91 9876543210<br />
                    +91 1234567890<br />
                    Mon-Sat: 9AM-7PM
                  </p>
                </div>

                {/* Email */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                    <FaEnvelope className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Email</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    info@tile.com<br />
                    sales@tile.com<br />
                    support@tile.com
                  </p>
                </div>

                {/* Hours */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center mb-4">
                    <FaClock className="text-2xl text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Business Hours</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Monday - Saturday<br />
                    9:00 AM - 7:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.812233955553!2d77.6068673148216!3d12.93569619088948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c2a1984f61%3A0x6d1d6a1d8f0e0f0!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Location Map"
                  className="w-full"
                ></iframe>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white dark:bg-slate-800">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Frequently Asked <span className="text-purple-600">Questions</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions about our products and services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">What are your delivery options?</h3>
              <p className="text-slate-600 dark:text-slate-300">We offer free delivery within the city limits. For outstation deliveries, we work with trusted logistics partners to ensure safe and timely delivery.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Do you provide installation services?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, we have a team of experienced professionals who can handle the installation of tiles at your premises. Contact us for more details.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">What is your return policy?</h3>
              <p className="text-slate-600 dark:text-slate-300">We offer a 7-day return policy for unused tiles in their original packaging. Please refer to our terms and conditions for detailed information.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6" data-aos="fade-up" data-aos-delay="400">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Do you offer bulk discounts?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, we offer competitive pricing for bulk orders. Please contact our sales team for a customized quote based on your requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

