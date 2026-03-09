import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FaTh, FaSearch, FaRupeeSign, FaFilter, FaShoppingCart, FaHeart, FaEye, FaStar } from "react-icons/fa";

const ViewTile = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [apiError, setApiError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("userWishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        setWishlist([]);
      }
    }
    
    const handleWishlistUpdate = () => {
      const updated = localStorage.getItem("userWishlist");
      if (updated) {
        setWishlist(JSON.parse(updated));
      }
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const fetchTiles = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await API.get("/tile/get");
      let tilesData = res.data?.data;
      if (!tilesData) tilesData = res.data?.tiles;
      if (!tilesData) tilesData = res.data;
      if (!Array.isArray(tilesData)) tilesData = [];
      setTiles(tilesData);
    } catch (error) {
      setApiError(error.message);
      setTiles(demoTiles);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/category/get");
      setCategories(res.data?.data || []);
    } catch (error) {
      setCategories([
        { _id: "1", name: "Floor Tiles" },
        { _id: "2", name: "Wall Tiles" },
        { _id: "3", name: "Bathroom Tiles" },
        { _id: "4", name: "Kitchen Tiles" }
      ]);
    }
  };

  // Demo tiles for fallback
  const demoTiles = [
    { _id: "1", title: "Marble Floor Tile", price: 150, image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400", category: { name: "Floor Tiles" } },
    { _id: "2", title: "Ceramic Wall Tile", price: 80, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400", category: { name: "Wall Tiles" } },
    { _id: "3", title: "Kitchen Mosaic", price: 200, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", category: { name: "Kitchen Tiles" } },
    { _id: "4", title: "Bathroom Porcelain", price: 120, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", category: { name: "Bathroom Tiles" } },
  ];

  useEffect(() => {
    fetchTiles();
    fetchCategories();
  }, []);

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch = tile.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tile.category?._id === selectedCategory || tile.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Buy Now - Go to order page directly
  const handleBuyNow = (tile) => {
    // Store single item in a separate "direct order" key (not cart)
    const directOrderItem = { ...tile, quantity: 1 };
    localStorage.setItem("directOrderItem", JSON.stringify(directOrderItem));
    
    // Navigate to order page
    navigate("/order");
  };

  // Add to Cart - Just add to cart and show dropdown (no navigation)
  const handleAddToCart = (tile) => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("userCart") || "[]");
    
    // Check if item already exists
    const existingIndex = existingCart.findIndex(item => item._id === tile._id);
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ ...tile, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem("userCart", JSON.stringify(existingCart));
    
    // Dispatch event for navbar update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Dispatch event to open cart dropdown in navbar
    window.dispatchEvent(new Event('openCartDropdown'));
    
    // Show success message
    alert(`${tile.title} added to cart! Click cart icon to view.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="w-full p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl shadow-lg shadow-purple-500/30">
              <FaTh className="text-2xl text-white" />
            </div>
            Our Tiles Collection
          </h1>
          <p className="text-slate-500 mt-2 ml-16">Browse our premium collection of tiles</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fadeInUp delay-100">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 bg-white shadow-sm"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp delay-200">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === cat._id
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          // Loading State
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-slate-200 shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-slate-200 rounded shimmer" />
                  <div className="h-8 bg-slate-200 rounded shimmer" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTiles.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-4">
              <FaTh className="text-5xl text-purple-300 animate-float" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No tiles found</h3>
            <p className="text-slate-400">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "No tiles available at the moment"}
            </p>
          </div>
        ) : (
          // Tiles Grid
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTiles.map((tile, index) => (
              <div
                key={tile._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fadeInUp card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                    {tile.category?.name || "General"}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-purple-500 hover:text-white transition-colors">
                      <FaEye size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        const isInWishlist = wishlist.some(item => item._id === tile._id);
                        if (isInWishlist) {
                          const newWishlist = wishlist.filter(item => item._id !== tile._id);
                          setWishlist(newWishlist);
                          localStorage.setItem("userWishlist", JSON.stringify(newWishlist));
                        } else {
                          const newWishlist = [...wishlist, tile];
                          setWishlist(newWishlist);
                          localStorage.setItem("userWishlist", JSON.stringify(newWishlist));
                        }
                        window.dispatchEvent(new Event('wishlistUpdated'));
                      }}
                      className={`p-2 rounded-full shadow-lg transition-colors ${
                        wishlist.some(item => item._id === tile._id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                      title={wishlist.some(item => item._id === tile._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FaHeart size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors duration-300">
                    {tile.title}
                  </h2>
                  {tile.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {tile.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      <FaRupeeSign className="inline" /> {tile.price}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      <span className="text-slate-500 text-sm">4.5</span>
                    </div>
                  </div>
                  
                  {/* Buy Now & Add to Cart Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => handleBuyNow(tile)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      <FaShoppingCart size={14} />
                      Buy at ₹{tile.price}
                    </button>
                    <button 
                      onClick={() => handleAddToCart(tile)}
                      className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-slate-200 transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      <FaShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {filteredTiles.length > 0 && (
          <div className="mt-8 flex justify-between items-center text-sm text-slate-500 animate-fadeInUp delay-300">
            <span>Showing {filteredTiles.length} of {tiles.length} tiles</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTile;

