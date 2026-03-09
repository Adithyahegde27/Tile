import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaTags, FaTh, FaShoppingCart, FaCommentAlt, FaArrowUp, FaArrowDown, FaChartLine, FaUsers, FaBox, FaStar } from "react-icons/fa";

const StatCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-800">{value}</p>
        <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          <span>{Math.abs(change)}% from last month</span>
        </div>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mb-8">Welcome back! Here's what's happening with your store.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Categories" 
            value="10" 
            icon={<FaTags className="text-2xl text-yellow-500" />}
            color="bg-yellow-100"
            change={12}
          />
          <StatCard 
            title="Total Tiles" 
            value="25" 
            icon={<FaTh className="text-2xl text-blue-500" />}
            color="bg-blue-100"
            change={8}
          />
          <StatCard 
            title="Total Orders" 
            value="15" 
            icon={<FaShoppingCart className="text-2xl text-green-500" />}
            color="bg-green-100"
            change={-5}
          />
          <StatCard 
            title="Total Feedback" 
            value="8" 
            icon={<FaCommentAlt className="text-2xl text-purple-500" />}
            color="bg-purple-100"
            change={25}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { text: "New order #1234 placed", time: "2 minutes ago", type: "order" },
              { text: "Category 'Marble' was updated", time: "1 hour ago", type: "category" },
              { text: "New feedback received", time: "3 hours ago", type: "feedback" },
              { text: "Tile 'Ceramic Floor' added", time: "5 hours ago", type: "tile" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === "order" ? "bg-green-500" :
                  activity.type === "category" ? "bg-yellow-500" :
                  activity.type === "feedback" ? "bg-purple-500" : "bg-blue-500"
                }`}></div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">{activity.text}</p>
                  <p className="text-slate-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

