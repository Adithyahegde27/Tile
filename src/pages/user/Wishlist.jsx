import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaRupeeSign, FaStar, FaArrowRight } from "react-icons/fa";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    
    // Remove from wishlist after adding to cart
    handleRemoveFromWishlist(wishlistItems.findIndex(item => item._id === tile._id));
    
    navigate("/order");
  };

  const getTotalValue = () => {
    return wishlistItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-16">
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg shadow-red-500/20">
              <FaHeart className="text-2xl text-white" />
            </div>
            My Wishlist
          </h1>
          <p className="text-slate-500 mt-2 ml-16">Items you've saved for later</p>
        </div>

        {/* Wishlist Stats */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-slate-800">{wishlistItems.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaHeart className="text-xl text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">₹{getTotalValue().toLocaleString('en-IN')}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaRupeeSign className="text-xl text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Ready to Buy</p>
                  <button 
                    onClick={() => navigate("/tiles")}
                    className="text-lg font-bold text-purple-600 hover:text-purple-700"
                  >
                    Continue Shopping →
                  </button>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaShoppingCart className="text-xl text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-400 mb-6">Save items you like by clicking the heart icon.</p>
            <button
              onClick={() => navigate("/tiles")}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
            >
              <FaShoppingCart />
              Browse Tiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-red-600">
                    {item.category?.name || "Tile"}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(index)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    title="Remove from wishlist"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-slate-800 truncate group-hover:text-red-600 transition-colors duration-300">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                      <FaRupeeSign className="inline" /> {item.price}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      <span className="text-slate-500 text-sm">4.5</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
                  >
                    <FaShoppingCart size={16} />
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 flex justify-between items-center text-sm text-slate-500">
            <span>Showing {wishlistItems.length} items in wishlist</span>
            <button 
              onClick={() => navigate("/tiles")}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add More Items <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

