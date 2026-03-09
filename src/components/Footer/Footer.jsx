import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow, FaMobileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <div className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company details */}
          <div className="py-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-purple-500">Tile</span>
            </h1>
            <p className="text-gray-400 mt-3 text-sm">
              Your trusted destination for premium quality tiles. Transform your space with our exquisite collection.
            </p>
            {/* social links */}
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-purple-500 duration-300">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 duration-300">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 duration-300">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="py-4">
            <h1 className="text-xl font-bold mb-4">Quick Links</h1>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-500 duration-300">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-purple-500 duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-purple-500 duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-purple-500 duration-300">Our Tiles</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="py-4">
            <h1 className="text-xl font-bold mb-4">Contact Us</h1>
            <div className="flex flex-col gap-3 text-gray-400">
              <div className="flex items-center gap-3">
                <FaLocationArrow />
                <span>Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt />
                <span>+91 123456789</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="py-4">
            <h1 className="text-xl font-bold mb-4">Newsletter</h1>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
              <button className="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700 duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Tile. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicFooter;

