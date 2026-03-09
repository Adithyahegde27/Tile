import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo.jpg";
import { FaHome, FaTh, FaShoppingCart, FaTruck, FaCommentAlt, FaUser, FaSignOutAlt, FaCaretDown, FaTrash, FaHistory, FaHeart } from "react-icons/fa";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userProfilePhoto = localStorage.getItem("userProfilePhoto");

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("userCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          setCartItems([]);
        }
      }
    };
    loadCart();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = localStorage.getItem("userWishlist");
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (e) {
          setWishlistItems([]);
        }
      }
    };
    loadWishlist();
    
    // Listen for wishlist updates
    window.addEventListener('wishlistUpdated', loadWishlist);
    return () => window.removeEventListener('wishlistUpdated', loadWishlist);
  }, []);

  const getUserInitials = () => {
    if (userName) {
      const names = userName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for open cart dropdown event from other components
  useEffect(() => {
    const handleOpenCartDropdown = () => {
      setIsCartOpen(true);
    };
    window.addEventListener('openCartDropdown', handleOpenCartDropdown);
    return () => window.removeEventListener('openCartDropdown', handleOpenCartDropdown);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleOrderClick = () => {
    navigate("/order");
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <img src={Logo} alt="Logo" className="w-10 h-10 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Tile</span>
              <span className="text-xs text-gray-500">Shop</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            to="/dashboard" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/dashboard') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaHome className="transition-transform duration-300 group-hover:scale-125" />
              Home
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
          
          <Link 
            to="/tiles" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/tiles') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaTh className="transition-transform duration-300 group-hover:scale-125" />
              Tiles
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
          
          {/* <Link 
            to="/category" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/category') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10">
              Categories
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link> */}
          
          <Link 
            to="/order" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/order') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaShoppingCart className="transition-transform duration-300 group-hover:scale-125" />
              Order
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
          
          <Link 
            to="/track" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/track') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaTruck className="transition-transform duration-300 group-hover:scale-125" />
              Track
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
          
          {/* <Link 
            to="/myorders" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/myorders') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaHistory className="transition-transform duration-300 group-hover:scale-125" />
              Orders
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
          
           <Link 
            to="/feedback" 
            className={`relative px-4 py-2 text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-lg ${
              isActive('/feedback') ? 'text-blue-600' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaCommentAlt className="transition-transform duration-300 group-hover:scale-125" />
              Feedbac
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>  */}
        </div>

        {/* Right Side - Cart & User */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative" ref={cartRef}>
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-800 hover:text-blue-600 transition-colors duration-300"
            >
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500">
                  <p className="text-white font-semibold">Shopping Cart ({cartItems.length})</p>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Link 
                      to="/tiles" 
                      className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Browse Tiles
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500">₹{item.price} x {item.quantity || 1}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveFromCart(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">Total:</span>
                        <span className="text-xl font-bold text-gray-800">₹{getCartTotal()}</span>
                      </div>
                      <Link 
                        to="/order"
                        onClick={() => setIsCartOpen(false)}
                        className="block w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      >
                        Proceed to Order
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          {/* <Link 
            to="/wishlist"
            className="relative p-2 text-gray-800 hover:text-red-500 transition-colors duration-300"
          >
            <FaHeart className="text-xl" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link> */}

          {/* User Menu */}
          {userId ? (
            <div className="relative group" ref={dropdownRef}>
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300">
                {userProfilePhoto ? (
                  <img 
                    src={userProfilePhoto} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {getUserInitials()}
                  </div>
                )}
                <span className="text-gray-800 font-medium hidden lg:block">{userName || 'User'}</span>
                <FaCaretDown className="text-gray-600 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500">
                    <p className="text-white font-semibold">{userName || 'User'}</p>
                    <p className="text-white/80 text-sm">{userEmail || 'user@example.com'}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <FaUser className="text-gray-500" />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <FaHeart className="text-gray-500" />
                      <span>My Wishlist</span>
                    </Link>
                    <Link to="/myorders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <FaHistory className="text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    <Link to="/feedback" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <FaCommentAlt className="text-gray-500" />
                      <span>Feedback</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-900 hover:scale-105 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2 bg-gray-50">
          <Link to="/dashboard" className={`flex flex-col items-center text-xs ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}>
            <FaHome className="text-lg mb-1" />
            Home
          </Link>
          <Link to="/tiles" className={`flex flex-col items-center text-xs ${isActive('/tiles') ? 'text-blue-600' : 'text-gray-600'}`}>
            <FaTh className="text-lg mb-1" />
            Tiles
          </Link>
          <Link to="/order" className={`flex flex-col items-center text-xs ${isActive('/order') ? 'text-blue-600' : 'text-gray-600'}`}>
            <FaShoppingCart className="text-lg mb-1" />
            Order
          </Link>
          <Link to="/track" className={`flex flex-col items-center text-xs ${isActive('/track') ? 'text-blue-600' : 'text-gray-600'}`}>
            <FaTruck className="text-lg mb-1" />
            Track
          </Link>
          <Link to="/feedback" className={`flex flex-col items-center text-xs ${isActive('/feedback') ? 'text-blue-600' : 'text-gray-600'}`}>
            <FaCommentAlt className="text-lg mb-1" />
            Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;

