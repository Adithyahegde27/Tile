
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaRupeeSign, FaStar, FaArrowRight, FaThLarge } from "react-icons/fa";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    setIsLoading(true);
    const savedWishlist = localStorage.getItem("userWishlist");
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        setWishlistItems([]);
      }
    }
    setIsLoading(false);
  };

  const handleRemoveFromWishlist = (index) => {
    const newWishlist = [...wishlistItems];
    newWishlist.splice(index, 1);
    setWishlistItems(newWishlist);
    localStorage.setItem("userWishlist", JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleAddToCart = (tile) => {
    const existingCart = JSON.parse(localStorage.getItem("userCart") || "[]");
    const existingIndex = existingCart.findIndex(item => item._id === tile._id);
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ ...tile, quantity: 1 });
    }
    localStorage.setItem("userCart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    handleRemoveFromWishlist(wishlistItems.findIndex(item => item._id === tile._id));
    navigate("/order");
  };

  const getTotalValue = () => {
    return wishlistItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            My Wishlist
          </h1>
          <p className={`text-white/80 text-lg ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            Items you've saved for later
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Wishlist Stats */}
        {wishlistItems.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Items</p>
                  <p className="text-3xl font-bold text-gray-800">{wishlistItems.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaHeart className="text-2xl text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Value</p>
                  <p className="text-3xl font-bold text-green-600">₹{getTotalValue().toLocaleString('en-IN')}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaRupeeSign className="text-2xl text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <button onClick={() => navigate("/tiles")} className="text-lg font-bold text-purple-600 hover:text-purple-700 transition-colors">
                    Continue Shopping →
                  </button>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaThLarge className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className={`bg-white rounded-3xl shadow-lg p-16 text-center ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-28 h-28 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-6xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Save items you love by clicking the heart icon on any product</p>
            <button onClick={() => navigate("/tiles")} className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-2 mx-auto">
              <FaThLarge /> Browse Tiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <div key={item._id || index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-red-600">
                    {item.category?.name || "Tile"}
                  </div>
                  <button onClick={() => handleRemoveFromWishlist(index)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:scale-110">
                    <FaTrash size={14} />
                  </button>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 truncate group-hover:text-red-600 transition-colors duration-300">
                    {item.title}
                  </h2>
                  {item.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                      <FaRupeeSign className="inline text-lg" /> {item.price}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar /><span className="text-gray-500 text-sm">4.5</span>
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(item)}
                    className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl shadow-red-500/30">
                    <FaShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className={`mt-10 flex justify-between items-center text-sm text-gray-500 ${animated ? "opacity-100" : "opacity-0"}`}>
            <span>Showing {wishlistItems.length} items in wishlist</span>
            <button onClick={() => navigate("/tiles")} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
              Add More <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

