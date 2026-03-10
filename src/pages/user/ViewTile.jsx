import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { 
  FaTh, FaSearch, FaRupeeSign, FaFilter, FaShoppingCart, 
  FaHeart, FaEye, FaStar, FaSortAmountDown, FaList,
  FaTimes, FaCheck, FaMinus, FaPlus, FaWhatsapp
} from "react-icons/fa";

const ViewTile = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [apiError, setApiError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [showQuickView, setShowQuickView] = useState(null);
  const [quantities, setQuantities] = useState({});

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

  // Check for search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
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
      
      // Initialize quantities
      const initialQuantities = {};
      tilesData.forEach(tile => {
        initialQuantities[tile._id] = 1;
      });
      setQuantities(initialQuantities);
      
      setTiles(tilesData);
    } catch (error) {
      setApiError(error.message);
      setTiles(demoTiles);
      const initialQuantities = {};
      demoTiles.forEach(tile => {
        initialQuantities[tile._id] = 1;
      });
      setQuantities(initialQuantities);
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

  // Sort tiles
  const sortedTiles = [...filteredTiles].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name": return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  const updateQuantity = (tileId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [tileId]: Math.max(1, (prev[tileId] || 1) + delta)
    }));
  };

  // Buy Now - Go to order page directly
  const handleBuyNow = (tile) => {
    const quantity = quantities[tile._id] || 1;
    const directOrderItem = { ...tile, quantity };
    localStorage.setItem("directOrderItem", JSON.stringify(directOrderItem));
    navigate("/order");
  };

  // Add to Cart
  const handleAddToCart = (tile) => {
    const existingCart = JSON.parse(localStorage.getItem("userCart") || "[]");
    const quantity = quantities[tile._id] || 1;
    
    const existingIndex = existingCart.findIndex(item => item._id === tile._id);
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + quantity;
    } else {
      existingCart.push({ ...tile, quantity });
    }
    
    localStorage.setItem("userCart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('openCartDropdown'));
  };

  // Toggle Wishlist
  const toggleWishlist = (tile) => {
    const isInWishlist = wishlist.some(item => item._id === tile._id);
    let newWishlist;
    if (isInWishlist) {
      newWishlist = wishlist.filter(item => item._id !== tile._id);
    } else {
      newWishlist = [...wishlist, tile];
    }
    setWishlist(newWishlist);
    localStorage.setItem("userWishlist", JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 py-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeInUp">
              Our Tiles Collection
            </h1>
            <p className="text-yellow-50 text-lg md:text-xl max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '100ms'}}>
              Discover premium quality tiles for your home. Transform your space with our stunning collection.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 animate-fadeInUp" style={{animationDelay: '200ms'}}>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-white font-semibold">{tiles.length}+</span>
                <span className="text-yellow-50 ml-2">Tiles Available</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-white font-semibold">{categories.length}+</span>
                <span className="text-yellow-50 ml-2">Categories</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-white font-semibold">★ 4.8</span>
                <span className="text-yellow-50 ml-2">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tiles by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 bg-gray-50"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="relative min-w-[200px]">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 bg-gray-50 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative min-w-[180px]">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 bg-gray-50 appearance-none cursor-pointer"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? 'bg-yellow-500 text-white shadow-lg' : 'text-gray-500 hover:text-yellow-500'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? 'bg-yellow-500 text-white shadow-lg' : 'text-gray-500 hover:text-yellow-500'}`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp" style={{animationDelay: '100ms'}}>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                : "bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200"
            }`}
          >
            All Tiles
          </button>
          {categories.map((cat, index) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                selectedCategory === cat._id
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                  : "bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200"
              }`}
              style={{animationDelay: `${index * 50}ms`}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6 animate-fadeInUp" style={{animationDelay: '150ms'}}>
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{sortedTiles.length}</span> of <span className="font-bold text-gray-800">{tiles.length}</span> tiles
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
            >
              <FaTimes /> Clear search
            </button>
          )}
        </div>

        {isLoading ? (
          // Loading State
          <div className={`grid gap-6 ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-56 bg-gray-200 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded shimmer" />
                  <div className="h-8 bg-gray-200 rounded w-2/3 shimmer" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTiles.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full mb-6">
              <FaTh className="text-5xl text-yellow-300 animate-float" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No tiles found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "all"
                ? "We couldn't find any tiles matching your criteria. Try adjusting your filters."
                : "No tiles available at the moment. Check back soon!"}
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Clear Filters
              </button>

            </div>
          </div>
        ) : (
          // Tiles Grid/List
          <div className={`grid gap-6 ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {sortedTiles.map((tile, index) => (
              <div
                key={tile._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className={`${viewMode === "grid" ? "h-56" : "h-48"} relative`}>
                    <img
                      src={tile.image}
                      alt={tile.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-yellow-600 shadow-lg">
                      {tile.category?.name || "General"}
                    </div>

                    {/* Sale Badge */}
                    {tile.price < 150 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        SALE
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button 
                        onClick={() => setShowQuickView(tile)}
                        className="flex-1 bg-white py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-yellow-500 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-lg"
                      >
                        <FaEye size={14} /> Quick View
                      </button>
                      <button 
                        onClick={() => toggleWishlist(tile)}
                        className={`p-2 rounded-lg shadow-lg transition-all duration-300 ${
                          wishlist.some(item => item._id === tile._id) 
                            ? 'bg-red-500 text-white scale-110' 
                            : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <FaHeart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate group-hover:text-yellow-600 transition-colors duration-300">
                    {tile.title}
                  </h2>
                  {tile.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {tile.description}
                    </p>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">(4.0)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
                      <FaRupeeSign className="inline text-lg" /> {tile.price}
                    </p>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <FaCheck /> In Stock
                    </span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(tile._id, -1)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-3 font-medium text-gray-700">{quantities[tile._id] || 1}</span>
                      <button 
                        onClick={() => updateQuantity(tile._id, 1)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Total: <span className="font-bold text-gray-800">₹{tile.price * (quantities[tile._id] || 1)}</span>
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleBuyNow(tile)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-3 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-green-700 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart size={14} />
                      Buy Now
                    </button>
                    <button 
                      onClick={() => handleAddToCart(tile)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl font-semibold text-sm hover:bg-yellow-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
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
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="relative">
              <button 
                onClick={() => setShowQuickView(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
              
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={showQuickView.image}
                    alt={showQuickView.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-1 rounded-full font-semibold">
                    {showQuickView.category?.name || "General"}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{showQuickView.title}</h2>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={16} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-gray-500">(4.0)</span>
                  </div>
                  
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500 mb-4">
                    <FaRupeeSign className="inline text-2xl" /> {showQuickView.price}
                  </p>
                  
                  <p className="text-gray-600 mb-6">
                    {showQuickView.description || "Premium quality tiles perfect for your home. Durable, elegant, and easy to maintain."}
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {["Durable", "Easy Clean", "Water Resistant", "Premium Quality"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCheck className="text-green-500" /> {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(showQuickView._id, -1)}
                        className="p-3 text-gray-500 hover:text-yellow-600 transition-colors"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-5 font-semibold text-lg">{quantities[showQuickView._id] || 1}</span>
                      <button 
                        onClick={() => updateQuantity(showQuickView._id, 1)}
                        className="p-3 text-gray-500 hover:text-yellow-600 transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-gray-800">Total: ₹{showQuickView.price * (quantities[showQuickView._id] || 1)}</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { handleBuyNow(showQuickView); setShowQuickView(null); }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform shadow-lg"
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={() => { handleAddToCart(showQuickView); setShowQuickView(null); }}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTile;

