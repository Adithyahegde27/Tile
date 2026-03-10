import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaTags, FaTh, FaShoppingCart, FaCommentAlt } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mb-8">Welcome back! Here's what's happening with your store.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Categories</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">10</p>
              </div>
              <div className="p-4 rounded-2xl bg-yellow-100">
                <FaTags className="text-2xl text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Tiles</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">25</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-100">
                <FaTh className="text-2xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">15</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-100">
                <FaShoppingCart className="text-2xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Feedback</p>
                <p className="text-3xl font-bold mt-2 text-slate-800">8</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-100">
                <FaCommentAlt className="text-2xl text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">New order #1234 placed</p>
                <p className="text-slate-500 text-sm">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">Category 'Marble' was updated</p>
                <p className="text-slate-500 text-sm">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">New feedback received</p>
                <p className="text-slate-500 text-sm">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

