import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { FaShoppingCart, FaUser, FaTruck, FaCheckCircle, FaClock, FaBox, FaShippingFast, FaSync, FaImage } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to get tile image with fallback
  const getTileImage = (tile) => {
    if (tile && typeof tile === 'object' && tile.image) {
      return tile.image;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23e2e8f0' width='64' height='64'/%3E%3Ctext x='32' y='32' font-family='Arial' font-size='12' fill='%2394a3b8' text-anchor='middle' dy='.3em'%3ETile%3C/text%3E%3C/svg%3E";
  };

  // Helper function to get tile title
  const getTileTitle = (tile) => {
    if (!tile) return "Unknown Tile";
    if (typeof tile === 'object' && tile.title) return tile.title;
    return "Unknown Tile";
  };

  // Helper function to get tile price
  const getTilePrice = (tile) => {
    if (!tile) return 0;
    if (typeof tile === 'object') return tile.price || 0;
    return 0;
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/order/all");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/order/update/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": 
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200";
      case "Shipped": 
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200";
      case "Delivered": 
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200";
      default: 
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FaClock />;
      case "Shipped": return <FaTruck />;
      case "Delivered": return <FaCheckCircle />;
      default: return <FaBox />;
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === "all" || order.status === filter
  );

  const statusCounts = {
    all: orders.length,
    Pending: orders.filter(o => o.status === "Pending").length,
    Shipped: orders.filter(o => o.status === "Shipped").length,
    Delivered: orders.filter(o => o.status === "Delivered").length
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl animate-bounce">
                  <FaShoppingCart className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Manage Orders</h2>
                  <p className="text-white/80 text-sm">View and manage customer orders</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 disabled:opacity-70"
                >
                  <FaSync className={isRefreshing ? "animate-spin" : ""} />
                  Refresh
                </button>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-semibold">{orders.length}</span>
                  <span className="text-white/80 text-sm ml-2">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 animate-fadeInUp delay-100">
            {[
              { key: "all", label: "All Orders", icon: <FaBox /> },
              { key: "Pending", label: "Pending", icon: <FaClock /> },
              { key: "Shipped", label: "Shipped", icon: <FaShippingFast /> },
              { key: "Delivered", label: "Delivered", icon: <FaCheckCircle /> }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setFilter(status.key)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === status.key
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:scale-105 border border-slate-200"
                }`}
              >
                {status.icon}
                {status.label}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  filter === status.key ? "bg-white/20" : "bg-slate-100"
                }`}>
                  {statusCounts[status.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading State
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-xl shimmer" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3 shimmer" />
                        <div className="h-3 bg-slate-200 rounded w-1/2 shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeInUp">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-4">
                  <FaShoppingCart className="text-5xl text-indigo-300 animate-float" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders found</h3>
                <p className="text-slate-400">
                  {filter === "all" 
                    ? "There are no orders yet" 
                    : `No ${filter.toLowerCase()} orders at the moment`}
                </p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-slate-100 group animate-fadeInUp card-hover"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Order Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <img 
                          src={getTileImage(order.tile)} 
                          alt={getTileTitle(order.tile)} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FaUser className="text-indigo-400" />
                          <span className="font-medium text-slate-800">{order.user?.email || "Unknown User"}</span>
                        </div>
                        <p className="text-slate-600">
                          <span className="font-medium">Tile:</span> {getTileTitle(order.tile)}
                        </p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 font-bold text-lg mt-1">
                          ₹ {getTilePrice(order.tile).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${getStatusColor(order.status)}`}>
                        <span className="animate-pulse">{getStatusIcon(order.status)}</span>
                        <span>{order.status}</span>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(order._id, "Shipped")}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                          >
                            <FaTruck size={14} /> Ship
                          </button>
                        )}
                        
                        {order.status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order._id, "Delivered")}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
                          >
                            <FaCheckCircle size={14} /> Deliver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          {orders.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-slate-500 animate-fadeInUp delay-300">
              <span>Showing {filteredOrders.length} of {orders.length} orders</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live updates enabled
              </span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;

