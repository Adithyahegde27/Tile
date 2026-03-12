import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { fixImageUrl } from "../../services/api";
import { 
  FaUsers, FaTags, FaShoppingCart, FaMapMarkerAlt, FaCommentAlt, 
  FaChartLine, FaTrophy, FaStar, FaClock, FaThLarge, FaArrowRight, 
  FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaHourglass, FaHeart,
  FaHome, FaBell, FaCalendarAlt, FaRupeeSign, FaPlus
} from "react-icons/fa";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 1500, prefix = "", suffix = "" }) => {
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

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Loading Skeleton Component
const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
    </div>
  </div>
);

// Progress Bar Component
const AnimatedProgressBar = ({ value, color, label }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}%</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ icon, text, time, color }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-800 dark:text-white font-medium">{text}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    categories: 0,
    myOrders: 0,
    myFeedbacks: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [activities, setActivities] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("mytoken");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    setAnimated(true);
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
      
      // Calculate total spent
const totalSpent = orders
        .filter(o => o.status === "Delivered" || o.status === "Completed")
        .reduce((sum, o) => sum + parseFloat(o.totalAmount || (o.tile?.price * (o.quantity || 1)) || 0), 0);

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
        cancelledOrders,
        totalSpent
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
      // Generate activities from orders
      const recentActivities = orders.slice(0, 5).map((order, index) => ({
        icon: order.status === "Delivered" ? <FaCheckCircle className="text-white text-xs" /> : 
              order.status === "Shipped" ? <FaTruck className="text-white text-xs" /> :
              order.status === "Cancelled" ? <FaTimesCircle className="text-white text-xs" /> :
              <FaClock className="text-white text-xs" />,
        color: order.status === "Delivered" ? "bg-green-500" : 
               order.status === "Shipped" ? "bg-blue-500" : 
               order.status === "Cancelled" ? "bg-red-500" : "bg-yellow-500",
        text: `Order ${order.status?.toLowerCase() || "pending"} - ${order.tile?.title || "Item"}`,
        time: new Date(order.createdAt || order.orderDate).toLocaleTimeString()
      }));
      setActivities(recentActivities);

      setTimeout(() => setIsLoading(false), 800);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId, token, navigate]);

  const overviewCards = [
    { title: "Total Orders", value: stats.myOrders, icon: <FaShoppingCart />, desc: "Your orders", color: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-400/30", link: "/myorders" },
    { title: "Pending", value: stats.pendingOrders, icon: <FaHourglass />, desc: "In progress", color: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30", link: "/myorders" },
    { title: "Completed", value: stats.completedOrders, icon: <FaCheckCircle />, desc: "Delivered", color: "from-green-400 to-green-600", shadow: "shadow-green-400/30", link: "/myorders" },
    { title: "Total Spent", value: stats.totalSpent, icon: <FaRupeeSign />, desc: "Amount spent", color: "from-purple-400 to-purple-600", shadow: "shadow-purple-400/30", prefix: "₹", link: "/myorders" },
  ];

  const quickActions = [
    { title: "Browse Tiles", icon: <FaThLarge />, link: "/tiles", color: "from-yellow-500 to-yellow-600", shadow: "shadow-yellow-500/30" },
    { title: "My Orders", icon: <FaShoppingCart />, link: "/myorders", color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
    { title: "Track Orders", icon: <FaMapMarkerAlt />, link: "/track", color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/30" },
    { title: "Wishlist", icon: <FaHeart />, link: "/wishlist", color: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/30" },
    { title: "Give Feedback", icon: <FaCommentAlt />, link: "/feedback", color: "from-green-500 to-green-600", shadow: "shadow-green-500/30" },
    { title: "My Profile", icon: <FaUsers />, link: "/profile", color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/30" },
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
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    } else if (lowerStatus.includes("cancel")) {
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    } else if (lowerStatus.includes("ship")) {
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    } else {
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getTimeAgo = (date) => {
    const orderDate = date ? new Date(date) : new Date();
    const now = new Date();
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return orderDate.toLocaleDateString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserName = () => {
    const name = localStorage.getItem("userName");
    return name || "User";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pt-16">
        <div className="w-full p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pt-16">
      <div className="w-full p-4 md:p-8">
        
        {/* Enhanced Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl p-6 md:p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-6 right-16 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
          <div className="absolute bottom-8 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white animate-fadeInUp">
                  {getGreeting()}! 👋
                </h2>
                <p className="text-yellow-50 mt-2 text-lg animate-fadeInUp" style={{animationDelay: '100ms'}}>
                  Welcome back, {getUserName()}!
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 animate-fadeInUp" style={{animationDelay: '200ms'}}>
                  <div className="flex items-center gap-2 text-yellow-50">
                    <FaCalendarAlt className="text-white" />
                    <span className="text-sm">{formatDate(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-50">
                    <FaClock className="text-white animate-pulse" />
                    <span className="text-sm font-mono">{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <Link 
                  to="/tiles" 
                  className="flex items-center gap-2 bg-white text-yellow-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <FaPlus />
                  <span>New Order</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card, index) => (
            <Link
              to={card.link}
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      {card.prefix && <AnimatedCounter end={card.value} prefix={card.prefix} />}
                      {!card.prefix && <AnimatedCounter end={card.value} />}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg ${card.shadow}`}>
                    <span className="text-white text-xl">{card.icon}</span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 animate-fadeInUp" style={{animationDelay: '300ms'}}>
            <FaPlus className="text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-r ${action.color} ${action.shadow} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ animationDelay: `${350 + index * 50}ms` }}
              >
                <span className="text-2xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                <span className="font-bold text-sm text-center">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders */}
          <div className={`lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '450ms'}}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FaShoppingCart className="text-yellow-500"></FaShoppingCart> 
                Recent Orders
              </h3>
              <Link to="/myorders" className="text-yellow-500 hover:text-yellow-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View All <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <FaBox className="text-3xl text-slate-300 dark:text-slate-500"></FaBox>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">No orders yet</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">Your orders will appear here</p>
                  <Link to="/tiles" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors">
                    <FaShoppingCart /> Browse Tiles
                  </Link>
                </div>
              ) : recentOrders.map((order, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                      {order.tile?.image ? (
                        <img 
                          src={fixImageUrl(order.tile?.image)} 
                          alt={order.tile?.title || "Tile"} 
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaThLarge className="text-slate-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate group-hover:text-yellow-600 transition-colors">
                        {order.tile?.title || "Tile"}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Order #{order._id?.slice(-6)}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{getTimeAgo(order.createdAt || order.orderDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-white">₹{order.totalAmount || (order.tile?.price * (order.quantity || 1)) || 0}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} 
                        <span className="text-[10px]">{order.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Stats */}
          <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '500ms'}}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FaChartLine className="text-yellow-500"></FaChartLine> 
                Order Statistics
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {[
                  { label: "Completed", value: stats.completedOrders, color: "bg-green-500", percentage: stats.myOrders > 0 ? Math.round((stats.completedOrders / stats.myOrders) * 100) : 0 },
                  { label: "Pending", value: stats.pendingOrders, color: "bg-blue-500", percentage: stats.myOrders > 0 ? Math.round((stats.pendingOrders / stats.myOrders) * 100) : 0 },
                  { label: "Cancelled", value: stats.cancelledOrders, color: "bg-red-500", percentage: stats.myOrders > 0 ? Math.round((stats.cancelledOrders / stats.myOrders) * 100) : 0 }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 dark:text-white font-bold">{stat.value}</span>
                        <span className="text-xs text-slate-400">({stat.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Card */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Total Amount Spent</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">₹<AnimatedCounter end={stats.totalSpent} /></p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <FaRupeeSign className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden mb-8 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '550ms'}}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaClock className="text-yellow-500"></FaClock> 
              Recent Activity
            </h3>
          </div>
          <div className="p-4">
            {activities.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-3xl text-slate-300 dark:text-slate-500"></FaClock>
                </div>
                <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity, i) => (
                  <ActivityItem 
                    key={i}
                    icon={activity.icon}
                    text={activity.text}
                    time={activity.time}
                    color={activity.color}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center pb-8 ${animated ? "opacity-100" : "opacity-0"}`} style={{transitionDelay: '600ms'}}>
          <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Tile Shop • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

