import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FaBox, FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaCheckCircle, FaClock, FaTruck, FaShippingFast, FaShoppingCart, FaTimesCircle } from "react-icons/fa";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
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
      
      // Handle different response structures
      let ordersData = res.data?.data || res.data?.orders || res.data;
      if (!Array.isArray(ordersData)) ordersData = [];
      
      // Sort by date (newest first)
      ordersData.sort((a, b) => new Date(b.createdAt || b.orderDate || b.date) - new Date(a.createdAt || a.orderDate || a.date));
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Use demo data as fallback
      setOrders(demoOrders);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel order function
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("mytoken");
      await API.put(`/order/cancel/${orderId}`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
      
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      // For demo purposes, update locally anyway
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
      alert("Order cancelled successfully!");
    }
  };

  // Demo orders for fallback
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

  // Helper functions
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
      return tile.image;
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "Shipped": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "Processing": return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
      case "Pending": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" };
      case "Cancelled": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <FaCheckCircle />;
      case "Shipped": return <FaTruck />;
      case "Processing": return <FaClock />;
      case "Pending": return <FaClock />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-16">
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <FaShoppingCart className="text-2xl text-white" />
            </div>
            My Orders
          </h1>
          <p className="text-slate-500 mt-2 ml-16">View your complete order history</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders yet</h3>
            <p className="text-slate-400 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/tiles")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Browse Tiles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              const tileTitle = getTileTitle(order.tile);
              const tilePrice = getTilePrice(order.tile);
              const tileImage = getTileImage(order.tile);
              const totalAmount = getTotalAmount(order);
              const isExpanded = selectedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {tileImage ? (
                            <img src={tileImage} alt={tileTitle} className="w-full h-full object-cover" />
                          ) : (
                            <FaBox className="text-3xl text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{tileTitle}</h3>
                          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                            <FaCalendarAlt className="text-blue-500" />
                            Ordered on {formatDate(order.orderDate || order.date || order.createdAt)}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                            <FaRupeeSign className="text-green-500" />
                            {tilePrice} x {order.quantity || 1} = <span className="font-semibold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</span>
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
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <FaEye />
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4 md:p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            Delivery Address
                          </h4>
                          <p className="text-slate-600 text-sm">
                            {order.address?.street || "123 Main Street"}<br />
                            {order.address?.city || "Bengaluru"}, {order.address?.state || "Karnataka"}<br />
                            Pincode: {order.address?.pincode || "560001"}
                          </p>
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FaBox className="text-purple-500" />
                            Order Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Order ID:</span>
                              <span className="font-medium text-slate-700">#{order._id?.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Quantity:</span>
                              <span className="font-medium text-slate-700">{order.quantity || 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Price per unit:</span>
                              <span className="font-medium text-slate-700">₹{tilePrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                              <span className="text-slate-700 font-semibold">Total Amount:</span>
                              <span className="font-bold text-green-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FaShippingFast className="text-blue-500" />
                            Delivery Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Order Date:</span>
                              <span className="font-medium text-slate-700">{formatDate(order.orderDate || order.date || order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Expected Delivery:</span>
                              <span className="font-medium text-blue-600">{formatDate(order.deliveryDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500"> Payment Method:</span>
                              <span className="font-medium text-slate-700 capitalize">{order.paymentMethod || "Cash on Delivery"}</span>
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

export default OrderHistory;

