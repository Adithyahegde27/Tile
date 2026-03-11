import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import API, { fixImageUrl } from "../../services/api";
import { FaShoppingCart, FaTruck, FaCheckCircle, FaClock, FaBox, FaSearch, FaFilter, FaShippingFast, FaCheck, FaTimes, FaEnvelope, FaMapMarkerAlt, FaPhone, FaExternalLinkAlt, FaUndo } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [animated, setAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    setAnimated(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/order/all");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const updateStatus = async (id, status) => {
    setIsUpdating(id);
    try {
      await API.put(`/order/update/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = !searchTerm || 
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tile?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return { 
        bg: "bg-gradient-to-r from-green-500 to-emerald-500", 
        text: "text-white",
        shadow: "shadow-green-500/30",
        icon: <FaCheckCircle />
      };
      case "Shipped": return { 
        bg: "bg-gradient-to-r from-blue-500 to-cyan-500", 
        text: "text-white",
        shadow: "shadow-blue-500/30",
        icon: <FaTruck />
      };
      default: return { 
        bg: "bg-gradient-to-r from-yellow-500 to-orange-500", 
        text: "text-white",
        shadow: "shadow-yellow-500/30",
        icon: <FaClock />
      };
    }
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      Pending: orders.filter(o => o.status === "Pending").length,
      Shipped: orders.filter(o => o.status === "Shipped").length,
      Delivered: orders.filter(o => o.status === "Delivered").length
    };
  };

  const counts = getStatusCounts();

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FaBox className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {counts.all}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Order Management</h2>
                    <p className="text-indigo-100 mt-1">Track, manage, and fulfill customer orders</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "all", label: "Total Orders", icon: <FaBox />, color: "from-indigo-500 to-purple-500" },
                  { key: "Pending", label: "Pending", icon: <FaClock />, color: "from-yellow-500 to-orange-500" },
                  { key: "Shipped", label: "Shipped", icon: <FaTruck />, color: "from-blue-500 to-cyan-500" },
                  { key: "Delivered", label: "Delivered", icon: <FaCheckCircle />, color: "from-green-500 to-emerald-500" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`relative overflow-hidden p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                      filter === item.key 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-medium ${filter === item.key ? "text-white/80" : "text-white/60"}`}>
                          {item.label}
                        </p>
                        <p className="text-2xl font-bold mt-1">{counts[item.key]}</p>
                      </div>
                      <div className={`p-2 rounded-xl ${filter === item.key ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"}`}>
                        {item.icon}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '100ms' }}>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer email, tile name, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-lg"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className={`bg-white rounded-2xl shadow-lg p-16 text-center transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '200ms' }}>
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingCart className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                  {searchTerm || filter !== "all" ? "No orders found" : "No orders yet"}
                </h3>
                <p className="text-slate-400">
                  {searchTerm || filter !== "all" ? "Try different search criteria" : "Orders will appear here"}
                </p>
              </div>
            ) : (
              filteredOrders.map((order, index) => {
                const statusStyle = getStatusColor(order.status);
                const isExpanded = expandedOrder === order._id;
                return (
                  <div
                    key={order._id}
                    className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${isExpanded ? 'ring-2 ring-cyan-500' : ''}`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    {/* Main Order Info */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left Side - Product */}
                        <div className="flex items-center gap-5">
                          <div className="relative group">
                            <img 
                              src={order.tile?.image ? fixImageUrl(order.tile.image) : ""} 
                              alt={order.tile?.title || "Tile"} 
                              className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-cyan-600 transition-colors">
                              {order.tile?.title || "Unknown Tile"}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                              <FaEnvelope className="text-xs" />
                              <span>{order.user?.email || "Unknown User"}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                                ₹ {order.tile?.price || 0}
                              </span>
                              <span className="text-slate-400 text-sm">
                                {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Status & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl ${statusStyle.bg} ${statusStyle.text} shadow-lg ${statusStyle.shadow}`}>
                            <span className="text-lg">{statusStyle.icon}</span>
                            <span className="font-bold">{order.status}</span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {order.status === "Pending" && (
                              <button
                                onClick={() => updateStatus(order._id, "Shipped")}
                                disabled={isUpdating === order._id}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100"
                              >
                                {isUpdating === order._id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <FaShippingFast /> Ship
                                  </>
                                )}
                              </button>
                            )}
                            {order.status === "Shipped" && (
                              <>
                                <button
                                  onClick={() => updateStatus(order._id, "Delivered")}
                                  disabled={isUpdating === order._id}
                                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                  {isUpdating === order._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <FaCheck /> Deliver
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => updateStatus(order._id, "Pending")}
                                  disabled={isUpdating === order._id}
                                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                  <FaUndo /> Back
                                </button>
                              </>
                            )}
                          </div>

                          {/* Expand Button */}
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-cyan-100 rounded-xl transition-all duration-300 hover:scale-110"
                          >
                            <FaExternalLinkAlt className={`text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Customer Info */}
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <FaEnvelope className="text-cyan-500" /> Customer Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-600"><span className="font-medium">Email:</span> {order.user?.email || "N/A"}</p>
                              <p className="text-slate-600"><span className="font-medium">Phone:</span> {order.user?.phone || "N/A"}</p>
                              <p className="text-slate-600"><span className="font-medium">Name:</span> {order.user?.name || "N/A"}</p>
                            </div>
                          </div>

                          {/* Order Info */}
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <FaBox className="text-indigo-500" /> Order Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-600"><span className="font-medium">Order ID:</span> #{order._id?.substring(0, 8) || "N/A"}</p>
                              <p className="text-slate-600"><span className="font-medium">Tile:</span> {order.tile?.title || "N/A"}</p>
                              <p className="text-slate-600"><span className="font-medium">Category:</span> {order.tile?.category?.name || "N/A"}</p>
                              <p className="text-slate-600"><span className="font-medium">Price:</span> ₹ {order.tile?.price || 0}</p>
                            </div>
                          </div>

                          {/* Shipping Info */}
                          <div className="bg-white rounded-2xl p-4 shadow-md">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-green-500" /> Shipping Info
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-600"><span className="font-medium">Status:</span> {order.status}</p>
                              <p className="text-slate-600"><span className="font-medium">Ordered:</span> {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</p>
                              <p className="text-slate-600">
                                <span className="font-medium">Address:</span><br />
                                {order.address?.street || "N/A"},<br />
                                {order.address?.city || "N/A"}, {order.address?.state || "N/A"} - {order.address?.pincode || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;

