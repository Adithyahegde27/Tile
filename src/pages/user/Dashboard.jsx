import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FaUsers, FaTags, FaShoppingCart, FaMapMarkerAlt, FaCommentAlt, FaChartLine, FaTrophy, FaStar, FaClock, FaThLarge, FaArrowRight, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaHourglass } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    categories: 0,
    myOrders: 0,
    myFeedbacks: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("mytoken");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch categories count
      const categoriesRes = await API.get("/category/get");
      const categoriesCount = categoriesRes.data?.data?.length || 0;

      // Fetch user's orders
      const ordersRes = await API.get(`/order/myorders/${userId}`);
      const orders = ordersRes.data || [];
      const myOrdersCount = orders.length;
      const completedOrders = orders.filter(o => o.status === "Delivered" || o.status === "Completed").length;
      const pendingOrders = orders.filter(o => o.status === "Pending").length;
      const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

      // Fetch all feedback count
      const feedbackRes = await API.get("/feedback/all");
      const feedbackCount = feedbackRes.data?.length || 0;

      // Fetch total users count
      const usersRes = await API.get("/users/getUser");
      const totalUsers = usersRes.data?.data?.length || 0;

      setStats({
        totalUsers: totalUsers,
        categories: categoriesCount,
        myOrders: myOrdersCount,
        myFeedbacks: feedbackCount,
        completedOrders,
        pendingOrders,
        cancelledOrders
      });

      // Set recent orders (last 4)
      setRecentOrders(orders.slice(0, 4));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        totalUsers: 0,
        categories: 0,
        myOrders: 0,
        myFeedbacks: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId, token, navigate]);

  const overviewCards = [
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, desc: "Registered users", color: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30" },
    { title: "Categories", value: stats.categories, icon: <FaTags />, desc: "Tile categories", color: "from-purple-400 to-purple-600", shadow: "shadow-purple-400/30" },
    { title: "My Orders", value: stats.myOrders, icon: <FaShoppingCart />, desc: "Total orders", color: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-400/30" },
    { title: "Feedback", value: stats.myFeedbacks, icon: <FaStar />, desc: "Feedback given", color: "from-green-400 to-green-600", shadow: "shadow-green-400/30" },
  ];

  const quickActions = [
    { title: "Browse Categories", icon: <FaTags />, link: "/category", color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/30" },
    { title: "My Orders", icon: <FaShoppingCart />, link: "/order", color: "from-yellow-500 to-yellow-600", shadow: "shadow-yellow-500/30" },
    { title: "Track Orders", icon: <FaMapMarkerAlt />, link: "/track", color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
    { title: "Give Feedback", icon: <FaCommentAlt />, link: "/feedback", color: "from-green-500 to-green-600", shadow: "shadow-green-500/30" },
  ];

  const getStatusIcon = (status) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("delivered") || lowerStatus.includes("completed")) {
      return <FaCheckCircle />;
    } else if (lowerStatus.includes("cancel")) {
      return <FaTimesCircle />;
    } else if (lowerStatus.includes("ship")) {
      return <FaTruck />;
    } else {
      return <FaHourglass />;
    }
  };

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("delivered") || lowerStatus.includes("completed")) {
      return "bg-green-100 text-green-600";
    } else if (lowerStatus.includes("cancel")) {
      return "bg-red-100 text-red-600";
    } else if (lowerStatus.includes("ship")) {
      return "bg-blue-100 text-blue-600";
    } else {
      return "bg-yellow-100 text-yellow-600";
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const orderDate = new Date(date);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return orderDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen transition-colors duration-300">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pt-16">
      <div className="w-full p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg shadow-yellow-400/30">
                <FaThLarge className="text-2xl text-slate-900" />
              </div>
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 ml-16">Welcome back! Here's your overview</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <span className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </span>
              </div>
              <h3 className="text-slate-800 dark:text-white font-bold text-lg">{card.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 animate-slideIn">
            <FaChartLine className="text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-r ${action.color} ${action.shadow} text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-between group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">{action.icon}</span>
                  <span className="font-bold">{action.title}</span>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 animate-slideUp" style={{ animationDelay: "400ms" }}>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FaShoppingCart className="text-yellow-500" />
              Recent Orders
            </h2>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer group"
                  >
                    <div className={`w-12 h-12 ${getStatusColor(order.status)} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 dark:text-white font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{getTimeAgo(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaShoppingCart className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400">No orders yet</p>
                <Link to="/order" className="text-yellow-500 hover:text-yellow-600 text-sm font-medium mt-2 inline-block">
                  Place your first order
                </Link>
              </div>
            )}
          </div>

          {/* Order Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 animate-slideUp" style={{ animationDelay: "500ms" }}>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              My Order Stats
            </h2>
            <div className="space-y-6">
              {[
                { label: "Total Orders", value: stats.myOrders, color: "bg-yellow-400" },
                { label: "Completed", value: stats.completedOrders, color: "bg-green-400" },
                { label: "Pending", value: stats.pendingOrders, color: "bg-blue-400" },
                { label: "Cancelled", value: stats.cancelledOrders, color: "bg-red-400" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</span>
                    <span className="text-slate-800 dark:text-white font-bold">{stat.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${stats.myOrders > 0 ? (stat.value / stats.myOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease forwards; }
        .animate-slideUp { animation: slideUp 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;

