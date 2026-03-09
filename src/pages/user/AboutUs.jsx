import React from "react";
import { FaTrophy, FaShieldAlt, FaStar, FaClock, FaQuoteLeft, FaUsers, FaCheckCircle } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-violet-600 to-violet-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="text-center text-white" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              About <span className="text-yellow-300">Tile</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Your trusted destination for premium quality tiles
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f3f4f6"/>
          </svg>
        </div>
      </div>

      {/* Company Story Section */}
      <div className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600" 
                alt="Our Showroom" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Our <span className="text-purple-600">Story</span>
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Founded with a vision to transform spaces into beautiful havens, Tile has been a pioneer in the tile industry for over 15 years. We started as a small family business and have grown into one of the most trusted tile suppliers in the region.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our commitment to quality, design excellence, and customer satisfaction has made us the preferred choice for homeowners, architects, and interior designers seeking premium tiling solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <FaCheckCircle />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <FaCheckCircle />
                  <span className="font-medium">Expert Installation</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <FaCheckCircle />
                  <span className="font-medium">Lifetime Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Mission & <span className="text-purple-600">Vision</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We strive to bring your dream spaces to life with our exquisite tile collections
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FaTrophy className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To provide our customers with the highest quality tiles that combine aesthetic appeal with durability and functionality. We are committed to offering an exceptional shopping experience, professional guidance, and reliable after-sales support to ensure complete satisfaction.
              </p>
            </div>
            
            {/* Vision */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-violet-600 rounded-xl flex items-center justify-center mb-6">
                <FaStar className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To become the leading tile provider in the region, known for our diverse collection, innovative designs, and unwavering commitment to customer excellence. We envision creating beautiful spaces in every home and commercial establishment we serve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Why Choose <span className="text-purple-600">Tile</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience the difference of working with a truly dedicated tile partner
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FaTrophy className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Premium Quality</h3>
              <p className="text-slate-600 text-sm">
                Every tile is carefully selected and tested for durability, ensuring long-lasting beauty in your space.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <FaShieldAlt className="text-2xl text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Expert Guidance</h3>
              <p className="text-slate-600 text-sm">
                Our experienced team provides professional advice to help you choose the perfect tiles for your project.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FaClock className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Fast Delivery</h3>
              <p className="text-slate-600 text-sm">
                Quick and reliable delivery ensures your project stays on schedule without delays.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="400">
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <FaUsers className="text-2xl text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Happy Customers</h3>
              <p className="text-slate-600 text-sm">
                Thousands of satisfied customers trust us for their tiling needs, and we're proud of every project.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-violet-600">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Years Experience</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Tile Designs</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Expert Team</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              What Our <span className="text-purple-600">Customers Say</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <FaQuoteLeft className="text-3xl text-purple-300 mb-4" />
              <p className="text-slate-600 mb-6 italic">
                "Absolutely love the quality of tiles I got from Tile. The staff was incredibly helpful in helping me choose the perfect design for my bathroom renovation."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  RS
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Rahul Sharma</h4>
                  <p className="text-sm text-slate-500">Homeowner</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <FaQuoteLeft className="text-3xl text-purple-300 mb-4" />
              <p className="text-slate-600 mb-6 italic">
                "As an interior designer, I always recommend Tile to my clients. Their collection is unmatched and the quality is consistently excellent."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                  SP
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Sarah Patel</h4>
                  <p className="text-sm text-slate-500">Interior Designer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="300">
              <FaQuoteLeft className="text-3xl text-purple-300 mb-4" />
              <p className="text-slate-600 mb-6 italic">
                "The best tile shop in the city! Great variety, competitive prices, and excellent customer service. My kitchen looks stunning now."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  AK
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Anil Kumar</h4>
                  <p className="text-sm text-slate-500">Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white" data-aos="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Visit our showroom or browse our collection online to find the perfect tiles for your dream project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/login" 
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                View Our Tiles
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

