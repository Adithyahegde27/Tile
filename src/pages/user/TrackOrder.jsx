
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { 
  FaBox, FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaEye,
  FaClock, FaCheck, FaTruck, FaTimesCircle, FaChevronDown, 
  FaChevronUp, FaSearch, FaFilter, FaBell, FaExclamationCircle
} from "react-icons/fa";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}</span>;
};

const TrackOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [animated, setAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAnimated(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("mytoken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setOrders(mockOrders);
        setIsLoading(false);
        return;
      }

      const res = await API.get(`/order/myorders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (error) {
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const mockOrders = [
    { _id: "demo12345678", status: "Pending", tile: { title: "Marble Floor Tile", price: 2500, image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=200" }, address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" }, orderDate: new Date(), deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), deliveryTime: "9:00 AM - 12:00 PM" },
    { _id: "demo87654321", status: "Shipped", tile: { title: "Ceramic Wall Tile", price: 1200, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=200" }, address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" }, orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), deliveryTime: "2:00 PM - 5:00 PM" },
    { _id: "demo11223344", status: "Delivered", tile: { title: "Porcelain Tile", price: 3500, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200" }, address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" }, orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), deliveryTime: "10:00 AM - 1:00 PM" }
  ];

  const filteredOrders = orders
    .filter(order => {
      const matchesFilter = filter === "all" || order.status?.toLowerCase() === filter;
      const matchesSearch = !searchTerm || order._id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.tile?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

  const getProgress = (status) => {
    switch (status) {
      case "Pending": return 20;
      case "Shipped": return 60;
      case "Delivered": return 100;
      case "Cancelled": return 0;
      default: return 0;
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending": return { color: "from-yellow-400 to-orange-500", bg: "bg-yellow-100", text: "text-yellow-600", step: 1, icon: FaClock };
      case "Shipped": return { color: "from-blue-400 to-blue-600", bg: "bg-blue-100", text: "text-blue-600", step: 2, icon: FaTruck };
      case "Delivered": return { color: "from-green-400 to-green-600", bg: "bg-green-100", text: "text-green-600", step: 3, icon: FaCheck };
      case "Cancelled": return { color: "from-red-400 to-red-600", bg: "bg-red-100", text: "text-red-600", step: 0, icon: FaTimesCircle };
      default: return { color: "from-gray-400 to-gray-600", bg: "bg-gray-100", text: "text-gray-600", step: 0, icon: FaBox };
    }
  };

  const getTrackingSteps = (status) => {
    const currentStep = getStatusDetails(status).step;
    return [
      { id: 1, label: "Order Placed", icon: FaBox, active: currentStep >= 1 },
      { id: 2, label: "Shipped", icon: FaTruck, active: currentStep >= 2 },
      { id: 3, label: "Delivered", icon: FaCheck, active: currentStep >= 3 },
    ];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const canCancelOrder = (status) => status !== "Delivered" && status !== "Cancelled";

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const token = localStorage.getItem("mytoken");
      const res = await API.put(`/order/cancel/${orderId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Cancelled" } : order));
        alert("Order cancelled successfully!");
      }
    } catch (error) {
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getTileTitle = (tile) => tile?.title || "Unknown Tile";
  const getTilePrice = (order) => order?.totalAmount || order?.tile?.price || 0;
  const getTileImage = (tile) => tile?.image || null;

  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 py-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeInUp">
              Track Your Orders
            </h1>
            <p className="text-yellow-50 text-lg max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '100ms'}}>
              Stay updated with your order status and delivery progress
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 animate-fadeInUp" style={{animationDelay: '200ms'}}>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                <span className="text-white font-bold text-xl"><AnimatedCounter end={stats.total} /></span>
                <span className="text-yellow-50 ml-2">Total</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                <span className="text-white font-bold text-xl"><AnimatedCounter end={stats.pending} /></span>
                <span className="text-yellow-50 ml-2">Pending</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                <span className="text-white font-bold text-xl"><AnimatedCounter end={stats.shipped} /></span>
                <span className="text-yellow-50 ml-2">Shipped</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                <span className="text-white font-bold text-xl"><AnimatedCounter end={stats.delivered} /></span>
                <span className="text-yellow-50 ml-2">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 animate-fadeInUp">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by Order ID or Product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 bg-gray-50"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    filter === f.value
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                      : "bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-6">
              <FaBox className="text-4xl text-yellow-300 animate-float" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || filter !== "all"
                ? "We couldn't find any orders matching your criteria."
                : "You haven't placed any orders yet."}
            </p>
            <div className="flex justify-center gap-3">
              {(searchTerm || filter !== "all") && (
                <button 
                  onClick={() => {setSearchTerm(""); setFilter("all");}}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
                >
                  Clear Filters
                </button>
              )}
              <button 
                onClick={() => navigate("/tiles")}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Browse Tiles
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const statusDetails = getStatusDetails(order.status);
              const trackingSteps = getTrackingSteps(order.status);
              const isExpanded = expandedOrder === order._id;
              const tileTitle = getTileTitle(order.tile);
              const tilePrice = getTilePrice(order);
              const tileImage = getTileImage(order.tile);
              const isCancellable = canCancelOrder(order.status);
              const progress = getProgress(order.status);
              const StatusIcon = statusDetails.icon;

              return (
                <div 
                  key={order._id} 
                  className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} 
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left - Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {tileImage ? (
                            <img src={tileImage} alt={tileTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBox className="text-3xl text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{tileTitle}</h3>
                          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-yellow-500" /> Order #{order._id?.slice(-8)?.toUpperCase() || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-green-500" /> {formatDate(order.orderDate)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right - Status & Price */}
                      <div className="flex lg:items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">₹ {tilePrice.toLocaleString('en-IN')}</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-1 ${statusDetails.bg} ${statusDetails.text}`}>
                            <StatusIcon size={12} /> {order.status}
                          </span>
                        </div>
                        
                        <div className="flex lg:flex-col gap-3 items-start">
                          <button 
                            onClick={() => toggleOrderExpand(order._id)} 
                            className={`px-6 py-3 bg-gradient-to-r ${statusDetails.color} text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            {isExpanded ? "Hide" : "Track"}
                          </button>
                          {isCancellable && (
                            <button 
                              onClick={() => handleCancelOrder(order._id)} 
                              disabled={cancellingId === order._id} 
                              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancellingId === order._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaTimesCircle />
                              )}
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${statusDetails.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-white animate-fadeInUp">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Tracking Timeline */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaTruck className="text-yellow-500" /> Order Timeline
                          </h4>
                          <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-yellow-400 to-green-500" style={{ height: `${(trackingSteps.filter(s => s.active).length / 3) * 100}%` }}></div>
                            
                            <div className="space-y-6">
                              {trackingSteps.map((step) => (
                                <div key={step.id} className="relative z-10 flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step.active ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30' : 'bg-gray-200 text-gray-400'}`}>
                                    <step.icon size={16} />
                                  </div>
                                  <div>
                                    <p className={`font-semibold ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                                    <p className="text-xs text-gray-400">
                                      {step.id === 1 && "Order has been placed"}
                                      {step.id === 2 && order.status === "Shipped" && "Your order is on the way"}
                                      {step.id === 3 && order.status === "Delivered" && "Order delivered successfully"}
                                      {step.id < trackingSteps.filter(s => s.active).length + 1 && step.id !== trackingSteps.filter(s => s.active).length + 1 && "Completed"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-yellow-500" /> Delivery Details
                          </h4>
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expected Delivery:</span>
                              <span className="font-semibold text-green-600">{formatDate(order.deliveryDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Time Slot:</span>
                              <span className="font-semibold text-blue-600">{order.deliveryTime || "9:00 AM - 12:00 PM"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order Date:</span>
                              <span className="font-semibold text-gray-700">{formatDate(order.orderDate)}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mt-3">
                              <span className="text-gray-500 block mb-1">Delivery Address:</span>
                              <span className="font-semibold text-gray-700">
                                {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                              </span>
                            </div>
                          </div>

                          {order.status === "Pending" && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                              <div className="flex items-start gap-3">
                                <FaExclamationCircle className="text-yellow-500 mt-1" />
                                <div>
                                  <p className="font-semibold text-yellow-700">Order not yet shipped</p>
                                  <p className="text-sm text-yellow-600">Your order is being processed. We'll notify you once it's shipped.</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

