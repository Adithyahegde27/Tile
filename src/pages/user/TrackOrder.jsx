import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaShippingFast, FaMapMarkerAlt, FaHome, FaChevronDown, FaChevronUp, FaCalendarAlt, FaRegClock } from "react-icons/fa";

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Helper function to get tile title safely
  const getTileTitle = (tile) => {
    if (!tile) return "Unknown Tile";
    if (typeof tile === 'string') return tile;
    if (tile.title) return tile.title;
    return "Unknown Tile";
  };

  // Helper function to get tile price safely
  const getTilePrice = (tile) => {
    if (!tile) return 0;
    if (typeof tile === 'object') return tile.price || 0;
    return 0;
  };

  // Helper function to get tile image with fallback
  const getTileImage = (tile) => {
    if (tile && typeof tile === 'object' && tile.image) {
      return tile.image;
    }
    return null;
  };

  // Auto-refresh when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchOrders();
      }
    };

    const handleFocus = () => {
      fetchOrders();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    fetchOrders();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data || []);
    } catch (error) {
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const mockOrders = [
    { 
      _id: "demo12345678", 
      status: "Pending", 
      tile: { title: "Marble Floor Tile", price: 2500, image: "https://via.placeholder.com/100?text=Marble" }, 
      user: { email: "demo@example.com" }, 
      date: "2024-01-15",
      address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deliveryTime: "9:00 AM - 12:00 PM"
    },
    { 
      _id: "demo87654321", 
      status: "Shipped", 
      tile: { title: "Ceramic Wall Tile", price: 1200, image: "https://via.placeholder.com/100?text=Ceramic" }, 
      user: { email: "demo@example.com" }, 
      date: "2024-01-14",
      address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      deliveryTime: "2:00 PM - 5:00 PM"
    },
    { 
      _id: "demo11223344", 
      status: "Delivered", 
      tile: { title: "Porcelain Tile", price: 3500, image: "https://via.placeholder.com/100?text=Porcelain" }, 
      user: { email: "demo@example.com" }, 
      date: "2024-01-10",
      address: { street: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveryTime: "10:00 AM - 1:00 PM"
    }
  ];

  const filteredOrders = orders.filter(order => filter === "all" || order.status?.toLowerCase() === filter);

  const getProgress = (status) => {
    switch (status) {
      case "Pending": return 20;
      case "Processing": return 40;
      case "Shipped": return 60;
      case "Out for Delivery": return 80;
      case "Delivered": return 100;
      default: return 0;
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending": return { color: "from-yellow-400 to-orange-500", bg: "bg-yellow-100", text: "text-yellow-600", step: 1 };
      case "Processing": return { color: "from-purple-400 to-purple-600", bg: "bg-purple-100", text: "text-purple-600", step: 2 };
      case "Shipped": return { color: "from-blue-400 to-cyan-500", bg: "bg-blue-100", text: "text-blue-600", step: 3 };
      case "Out for Delivery": return { color: "from-indigo-400 to-violet-500", bg: "bg-indigo-100", text: "text-indigo-600", step: 4 };
      case "Delivered": return { color: "from-green-400 to-emerald-500", bg: "bg-green-100", text: "text-green-600", step: 5 };
      default: return { color: "from-gray-400 to-slate-500", bg: "bg-gray-100", text: "text-gray-600", step: 0 };
    }
  };

  const getTrackingSteps = (status) => {
    const currentStep = getStatusDetails(status).step;
    return [
      { id: 1, title: "Order Placed", isCompleted: 1 < currentStep, isCurrent: 1 === currentStep },
      { id: 2, title: "Processing", isCompleted: 2 < currentStep, isCurrent: 2 === currentStep },
      { id: 3, title: "Shipped", isCompleted: 3 < currentStep, isCurrent: 3 === currentStep },
      { id: 4, title: "Out for Delivery", isCompleted: 4 < currentStep, isCurrent: 4 === currentStep },
      { id: 5, title: "Delivered", isCompleted: 5 < currentStep, isCurrent: 5 === currentStep }
    ];
  };

  const getLocationUpdates = (status) => {
    const currentStep = getStatusDetails(status).step;
    return [
      { id: 1, location: "Order Placed", detail: "Online order placed by customer", time: "Today, 10:30 AM", isCompleted: 1 < currentStep, isCurrent: 1 === currentStep },
      { id: 2, location: "Warehouse - Mumbai", detail: "Order received at fulfillment center", time: "Today, 2:15 PM", isCompleted: 2 < currentStep, isCurrent: 2 === currentStep },
      { id: 3, location: "In Transit", detail: "Package dispatched from Mumbai hub", time: "Yesterday, 6:00 PM", isCompleted: 3 < currentStep, isCurrent: 3 === currentStep },
      { id: 4, location: "Local Hub - Mumbai Central", detail: "Arrived at local delivery hub", time: "Today, 8:00 AM", isCompleted: 4 < currentStep, isCurrent: 4 === currentStep },
      { id: 5, location: "Delivered", detail: "Package delivered to customer", time: "Delivered", isCompleted: 5 < currentStep, isCurrent: 5 === currentStep }
    ];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16">
      <div className="w-full p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg">
              <FaShippingFast className="text-2xl text-slate-900" />
            </div>
            Track Orders
          </h1>
          <p className="text-slate-500 mt-2 ml-16">Track your order status and delivery progress</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-5xl text-slate-300" />
            </div>
            <p className="text-slate-500 text-xl">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusDetails = getStatusDetails(order.status);
              const trackingSteps = getTrackingSteps(order.status);
              const locationUpdates = getLocationUpdates(order.status);
              const isExpanded = expandedOrder === order._id;
              const tileTitle = getTileTitle(order.tile);
              const tilePrice = getTilePrice(order.tile);
              const tileImage = getTileImage(order.tile);
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Order Image */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center overflow-hidden">
                          <FaBox className="text-4xl text-indigo-400" />
                        </div>
                        <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${statusDetails.color} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-xs font-bold">{statusDetails.step}</span>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">{tileTitle}</h2>
                            <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm flex-wrap">
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-yellow-500" /> Order #{order._id?.slice(-8)?.toUpperCase() || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="text-green-500" /> {formatDate(order.orderDate || order.date)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-800">₹ {tilePrice.toLocaleString('en-IN')}</p>
                            <p className={`text-sm font-medium mt-1 px-3 py-1 rounded-full inline-block ${statusDetails.bg} ${statusDetails.text}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-0 right-0 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${statusDetails.color} rounded-full transition-all`}
                                style={{ width: `${getProgress(order.status)}%` }}
                              ></div>
                            </div>

                            {trackingSteps.map((step) => (
                              <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  step.isCompleted 
                                    ? `bg-gradient-to-r ${statusDetails.color} text-white shadow-lg` 
                                    : step.isCurrent
                                    ? `bg-gradient-to-r ${statusDetails.color} text-white shadow-lg animate-pulse`
                                    : "bg-slate-100 text-slate-400"
                                }`}>
                                  {step.isCompleted ? <FaCheckCircle /> : step.id === 1 ? <FaClock /> : step.id === 2 ? <FaBox /> : step.id === 3 ? <FaTruck /> : step.id === 4 ? <FaShippingFast /> : <FaCheckCircle />}
                                </div>
                                <span className={`text-xs mt-2 font-medium hidden sm:block ${step.isCurrent ? statusDetails.text : 'text-slate-400'}`}>
                                  {step.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex lg:flex-col gap-3 items-start">
                        <button 
                          onClick={() => toggleOrderExpand(order._id)}
                          className={`px-6 py-3 bg-gradient-to-r ${statusDetails.color} text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                        >
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          {isExpanded ? "Hide Details" : "Track Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Tracking Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Location/Timeline Tracking */}
                      <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <FaTruck className="text-yellow-500" /> Live Tracking
                        </h3>
                        
                        <div className="space-y-4">
                          {locationUpdates.map((update, idx) => (
                            <div key={update.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  update.isCompleted 
                                    ? 'bg-green-500 border-green-500' 
                                    : update.isCurrent 
                                    ? `bg-gradient-to-r ${statusDetails.color} border-white shadow-lg`
                                    : 'bg-slate-200 border-slate-300'
                                }`}></div>
                                {idx < locationUpdates.length - 1 && (
                                  <div className={`w-0.5 h-16 ${update.isCompleted ? 'bg-green-400' : 'bg-slate-200'}`}></div>
                                )}
                              </div>
                              
                              <div className={`flex-1 pb-4 ${update.isCurrent ? 'bg-yellow-50 -mx-2 px-2 py-1 rounded-lg' : ''}`}>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${update.isCurrent ? statusDetails.text : update.isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                                    {update.location}
                                  </span>
                                  {update.isCurrent && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full animate-pulse">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500">{update.detail}</p>
                                <p className="text-xs text-slate-400 mt-1">{update.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Order Info Cards */}
                      <div className="space-y-4">
                        {/* Delivery Info */}
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FaRegClock className="text-green-500" /> Delivery Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Expected Delivery:</span>
                              <span className="font-semibold text-green-600">{formatDate(order.deliveryDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Time Slot:</span>
                              <span className="font-semibold text-blue-600">{order.deliveryTime || "9:00 AM - 12:00 PM"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Order Date:</span>
                              <span className="font-semibold text-slate-700">{formatDate(order.orderDate || order.date)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FaHome className="text-yellow-500" /> Delivery Address
                          </h3>
                          <div className="text-slate-600">
                            <p className="font-medium">{order.address?.street || "123 Main Street"}</p>
                            <p>{order.address?.city || "Mumbai"}, {order.address?.state || "Maharashtra"}</p>
                            <p className="text-slate-500">Pincode: {order.address?.pincode || "400001"}</p>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FaBox className="text-purple-500" /> Product Details
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {tileImage ? (
                                <img src={tileImage} alt={tileTitle} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <FaBox className="text-2xl text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{tileTitle}</p>
                              <p className="text-yellow-600 font-bold">₹ {tilePrice.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
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

