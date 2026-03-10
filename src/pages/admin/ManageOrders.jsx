import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { FaShoppingCart, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await API.get("/order/all");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
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

  const filteredOrders = orders.filter(order => 
    filter === "all" || order.status === filter
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white">Manage Orders</h2>
            <p className="text-white/80 text-sm">View and manage customer orders</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "Pending", "Shipped", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium ${
                  filter === status
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-slate-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders found</h3>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={order.tile?.image || ""} 
                        alt={order.tile?.title || "Tile"} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{order.user?.email || "Unknown User"}</p>
                        <p className="text-slate-600">Tile: {order.tile?.title || "Unknown"}</p>
                        <p className="text-indigo-600 font-bold">₹ {order.tile?.price || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateStatus(order._id, "Shipped")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
                        >
                          <FaTruck /> Ship
                        </button>
                      )}
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => updateStatus(order._id, "Delivered")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
                        >
                          <FaCheckCircle /> Deliver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;

