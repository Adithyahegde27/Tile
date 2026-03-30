import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo.jpg";
import { 
  FaHome, FaTh, FaShoppingCart, FaTruck, FaCommentAlt, FaUser, 
  FaSignOutAlt, FaCaretDown, FaTrash, FaHistory, FaHeart, 
  FaSearch, FaBell, FaTimes, FaBars, FaSearchPlus
} from "react-icons/fa";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const searchRef = useRef(null);
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tiles?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white'
      }`}
    >

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-2 lg:py-3 max-w-screen-2xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <img 
                src={Logo} 
                alt="Logo" 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 rounded-xl bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl lg:text-2xl text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                Tile
              </span>
              <span className="text-xs text-gray-500 -mt-1">Shop</span>
            </div>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-full group">
            <input
              type="text"
              placeholder="Search for tiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:border-yellow-400 focus:bg-white transition-all duration-300"
            />
            <button 
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition-colors"
            >
              <FaSearch className="text-lg" />
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:block">
              <FaSearchPlus className="text-yellow-500 animate-pulse" />
            </div>
          </form>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { path: '/dashboard', label: 'Home', icon: <FaHome /> },
            { path: '/tiles', label: 'Tiles', icon: <FaTh /> },
            { path: '/order', label: 'Order', icon: <FaShoppingCart /> },
            { path: '/track', label: 'Track', icon: <FaTruck /> },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`relative px-4 py-2 text-gray-800 font-medium hover:text-yellow-600 transition-all duration-300 group overflow-hidden rounded-lg ${
                isActive(item.path) ? 'text-yellow-600' : ''
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                  {item.icon}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
              </span>
              {/* Animated underline */}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-500 transition-all duration-300 ${isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              {/* Active indicator dot */}
              {isActive(item.path) && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side - Icons & User */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Icon - Mobile */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-yellow-600 transition-colors"
          >
            <FaSearch className="text-xl" />
          </button>

          {/* Cart Icon */}
          <div className="relative" ref={cartRef}>
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-800 hover:text-yellow-600 transition-colors duration-300 group"
            >
              <div className="relative">
                <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform duration-300" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </button>
            
            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slideDown">
                <div className="px-4 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex justify-between items-center">
                  <p className="text-white font-semibold flex items-center gap-2">
                    <FaShoppingCart /> Shopping Cart ({cartItems.length})
                  </p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <FaShoppingCart className="text-3xl text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm">Add some beautiful tiles!</p>
                    <Link 
                      to="/tiles" 
                      className="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white font-medium rounded-full hover:bg-yellow-600 hover:scale-105 transition-all duration-300"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Browse Tiles
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 lg:max-h-80 overflow-y-auto">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-yellow-50/50 transition-colors group">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-14 h-14 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-yellow-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">₹{item.price} × {item.quantity || 1}</p>
                            <p className="text-xs font-medium text-yellow-600">₹{item.price * (item.quantity || 1)}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveFromCart(index)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">Subtotal:</span>
                        <span className="text-xl font-bold text-gray-800">₹{getCartTotal()}</span>
                      </div>
                      <Link 
                        to="/order"
                        onClick={() => setIsCartOpen(false)}
                        className="block w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-yellow-500/30"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          {userId ? (
            <div className="relative group" ref={dropdownRef}>
              <button className="flex items-center gap-2 px-2 py-1.5 lg:px-3 lg:py-2 bg-gray-100 hover:bg-yellow-100 rounded-full transition-all duration-300 group-hover:shadow-md">
                {userProfilePhoto ? (
                  <img 
                    src={userProfilePhoto.startsWith("http") ? userProfilePhoto : `http://localhost:5000${userProfilePhoto}`}
                    alt="Profile" 
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-yellow-400/50 group-hover:ring-yellow-500 transition-all duration-300"
                  />
                ) : (
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-yellow-400/50 group-hover:ring-yellow-500 transition-all duration-300">
                    {getUserInitials()}
                  </div>
                )}
                <span className="text-gray-800 font-medium hidden lg:block text-sm">{userName || 'User'}</span>
                <FaCaretDown className="text-gray-600 transition-transform duration-300 group-hover:rotate-180 hidden lg:block" />
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                    <p className="text-white font-semibold text-lg">{userName || 'User'}</p>
                    <p className="text-white/80 text-sm truncate">{userEmail || 'user@example.com'}</p>
                  </div>
                  <div className="py-2">
                    {[
                      { path: '/profile', icon: FaUser, label: 'My Profile' },
                      { path: '/wishlist', icon: FaHeart, label: 'My Wishlist' },
                      { path: '/myorders', icon: FaHistory, label: 'My Orders' },
                    ].map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
                      >
                        <item.icon className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 lg:px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-yellow-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-slideDown">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white transition-all duration-300"
            />
            <button 
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FaSearch className="text-lg" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-white px-4 py-3 space-y-2">
          {[
            { path: '/dashboard', label: 'Home', icon: <FaHome /> },
            { path: '/tiles', label: 'Tiles', icon: <FaTh /> },
            { path: '/order', label: 'Order', icon: <FaShoppingCart /> },
            { path: '/track', label: 'Track', icon: <FaTruck /> },
            { path: '/wishlist', label: 'Wishlist', icon: <FaHeart /> },
            { path: '/myorders', label: 'Orders', icon: <FaHistory /> },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-yellow-50 text-yellow-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={isActive(item.path) ? 'text-yellow-600' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;

