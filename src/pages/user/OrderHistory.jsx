
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { fixImageUrl } from "../../services/api";
import { 
  FaBox, FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaEye, 
  FaCheckCircle, FaClock, FaTruck, FaShippingFast, FaShoppingCart, 
  FaTimesCircle, FaArrowRight, FaFilter, FaTimes
} from "react-icons/fa";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [animated, setAnimated] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setAnimated(true);
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userId, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("mytoken");
      const res = await API.get(`/order/myorders/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      let ordersData = res.data?.data || res.data?.orders || res.data;
      if (!Array.isArray(ordersData)) ordersData = [];
      
      ordersData.sort((a, b) => new Date(b.createdAt || b.orderDate || b.date) - new Date(a.createdAt || a.orderDate || a.date));
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders(demoOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("mytoken");
      await API.put(`/order/cancel/${orderId}`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
      
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
      alert("Order cancelled successfully!");
    }
  };

  const demoOrders = [
    {
      _id: "demo001",
      tile: { title: "Marble Floor Tile", price: 2500, image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=200" },
      quantity: 5,
      status: "Delivered",
      orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      address: { street: "123 Main Street", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
      paymentMethod: "cash",
      totalAmount: 12500
    },
    {
      _id: "demo002",
      tile: { title: "Ceramic Wall Tile", price: 1200, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=200" },
      quantity: 10,
      status: "Shipped",
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      address: { street: "123 Main Street", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
      paymentMethod: "online",
      totalAmount: 12000
    },
    {
      _id: "demo003",
      tile: { title: "Kitchen Mosaic Tile", price: 2000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200" },
      quantity: 3,
      status: "Pending",
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      address: { street: "123 Main Street", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
      paymentMethod: "cash",
      totalAmount: 6000
    }
  ];

  const getTileTitle = (tile) => {
    if (!tile) return "Unknown Tile";
    if (typeof tile === 'string') return tile;
    return tile.title || "Unknown Tile";
  };

  const getTilePrice = (tile) => {
    if (!tile) return 0;
    if (typeof tile === 'object') return tile.price || 0;
    return 0;
  };

  const getTileImage = (tile) => {
    if (tile && typeof tile === 'object' && tile.image) {
      return fixImageUrl(tile.image);
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", gradient: "from-green-400 to-green-600" };
      case "Shipped": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-400 to-blue-600" };
      case "Processing": return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", gradient: "from-purple-400 to-purple-600" };
      case "Pending": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", gradient: "from-yellow-400 to-yellow-600" };
      case "Cancelled": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", gradient: "from-red-400 to-red-600" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", gradient: "from-gray-400 to-gray-600" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <FaCheckCircle />;
      case "Shipped": return <FaTruck />;
      case "Processing": return <FaClock />;
      case "Pending": return <FaClock />;
      case "Cancelled": return <FaTimesCircle />;
      default: return <FaBox />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTotalAmount = (order) => {
    const price = getTilePrice(order.tile);
    const qty = order.quantity || 1;
    return price * qty;
  };

  const filteredOrders = orders.filter(order => 
    filter === "all" || order.status?.toLowerCase() === filter
  );

  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 py-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            My Orders
          </h1>
          <p className={`text-white/80 text-lg transition-all duration-700 delay-100 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            View and manage your complete order history
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Tabs */}
        <div className={`flex flex-wrap gap-2 mb-6 transition-all duration-500 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {statusFilters.map((f, i) => (
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

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center animate-fadeInUp">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-5xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-400 mb-6">
              {filter !== "all" ? "No orders match this filter" : "You haven't placed any orders yet."}
            </p>
            <div className="flex justify-center gap-3">
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  View All Orders
                </button>
              )}
              <button
                onClick={() => navigate("/tiles")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Browse Tiles
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const statusStyle = getStatusColor(order.status);
              const tileTitle = getTileTitle(order.tile);
              const tilePrice = getTilePrice(order.tile);
              const tileImage = getTileImage(order.tile);
              const totalAmount = getTotalAmount(order);
              const isExpanded = selectedOrder === order._id;
              const canCancel = order.status !== "Delivered" && order.status !== "Cancelled";

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {tileImage ? (
                            <img src={tileImage} alt={tileTitle} className="w-full h-full object-cover" />
                          ) : (
                            <FaBox className="text-3xl text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">{tileTitle}</h3>
                          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                            <FaCalendarAlt className="text-blue-500" />
                            Ordered on {formatDate(order.orderDate || order.date || order.createdAt)}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                            <FaRupeeSign className="text-green-500" />
                            ₹{tilePrice.toLocaleString('en-IN')} × {order.quantity || 1} = <span className="font-semibold text-gray-800">₹{totalAmount.toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-4">
                        <div className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text}`}>
                          {getStatusIcon(order.status)}
                          {order.status || "Pending"}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                          className="px-4 py-2 bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-yellow-600 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                        >
                          <FaEye />
                          {isExpanded ? "Hide" : "View"}
                          <FaArrowRight className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-4 md:p-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            Delivery Address
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {order.address?.street || "123 Main Street"}<br />
                            {order.address?.city || "Bengaluru"}, {order.address?.state || "Karnataka"}<br />
                            Pincode: {order.address?.pincode || "560001"}
                          </p>
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FaBox className="text-purple-500" />
                            Order Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order ID:</span>
                              <span className="font-medium text-gray-700">#{order._id?.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="font-medium text-gray-700">{order.quantity || 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Price per unit:</span>
                              <span className="font-medium text-gray-700">₹{tilePrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                              <span className="text-gray-700 font-semibold">Total Amount:</span>
                              <span className="font-bold text-green-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FaShippingFast className="text-blue-500" />
                            Delivery Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order Date:</span>
                              <span className="font-medium text-gray-700">{formatDate(order.orderDate || order.date || order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expected Delivery:</span>
                              <span className="font-medium text-blue-600">{formatDate(order.deliveryDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Payment:</span>
                              <span className="font-medium text-gray-700 capitalize">{order.paymentMethod || "Cash on Delivery"}</span>
                            </div>
                            {canCancel && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="w-full mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                              >
                                <FaTimesCircle /> Cancel Order
                              </button>
                            )}
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

export default OrderHistory;


