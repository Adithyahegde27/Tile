import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import API, { fixImageUrl } from "../../services/api";
import { Link } from "react-router-dom";
import { 
  FaTags, FaTh, FaShoppingCart, FaCommentAlt, FaUsers, FaRupeeSign, 
  FaChartLine, FaBox, FaClock, FaCheckCircle, FaShippingFast, FaHourglassHalf, 
  FaPlus, FaCog, FaBell, FaCalendarAlt, FaTrash, FaEdit, FaEye,
  FaArrowUp, FaArrowDown, FaExclamationCircle, FaCheck, FaTimes,
  FaLayerGroup, FaMoneyBillWave, FaChartBar, FaListAlt, FaCalendarCheck
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
  <div className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
        <div className="h-8 w-16 bg-slate-200 rounded"></div>
      </div>
      <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
    </div>
  </div>
);

// Progress Bar Component
const AnimatedProgressBar = ({ value, color, label }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ icon, text, time, color }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-800 font-medium">{text}</p>
      <p className="text-xs text-slate-500">{time}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [animated, setAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ 
    categories: 0, tiles: 0, orders: 0, feedback: 0, revenue: 0, users: 0,
    todayOrders: 0, pendingPayments: 0, totalTilesSold: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({ pending: 0, shipped: 0, delivered: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setAnimated(true);
    fetchDashboardData();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, tilesRes, ordersRes, feedbackRes] = await Promise.all([
        API.get("/category/get"), 
        API.get("/tile/get"), 
        API.get("/order/all"), 
        API.get("/feedback/all")
      ]);
      
      const categories = categoriesRes.data?.data || [];
      const tiles = tilesRes.data?.tiles || tilesRes.data?.data || [];
      const orders = ordersRes.data || [];
      const feedback = feedbackRes.data || [];
      
      // Calculate stats
      const pending = orders.filter(o => o.status === "Pending").length;
      const shipped = orders.filter(o => o.status === "Shipped").length;
      const delivered = orders.filter(o => o.status === "Delivered").length;
const revenue = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + parseFloat(o.totalAmount || (o.tile?.price * (o.quantity || 1)) || 0), 0);
      
      // Today's orders
      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.orderDate || o.createdAt).toDateString() === today).length;
      
      // Pending payments (orders that are not delivered but have payment pending)
      const pendingPayments = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
      
      // Total tiles sold
      const totalTilesSold = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);

      setStats({ 
        categories: categories.length, 
        tiles: tiles.length, 
        orders: orders.length, 
        feedback: feedback.length, 
        revenue: revenue, 
        users: [...new Set(orders.map(o => o.user?._id))].length,
        todayOrders,
        pendingPayments,
        totalTilesSold
      });
      
      setOrderStats({ pending, shipped, delivered });
      setRecentOrders(orders.slice(0, 6));
      
      // Generate activities from orders
      const recentActivities = orders.slice(0, 5).map((order, index) => ({
        icon: order.status === "Delivered" ? <FaCheck className="text-white text-xs" /> : 
              order.status === "Shipped" ? <FaShippingFast className="text-white text-xs" /> :
              <FaClock className="text-white text-xs" />,
        color: order.status === "Delivered" ? "bg-green-500" : 
               order.status === "Shipped" ? "bg-blue-500" : "bg-yellow-500",
        text: `Order ${order.status.toLowerCase()} for ${order.tile?.title || "Unknown"}`,
        time: new Date(order.orderDate || order.createdAt).toLocaleTimeString()
      }));
      setActivities(recentActivities);
      
      setTimeout(() => setIsLoading(false), 800);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Delivered": return <FaCheckCircle className="text-green-500" />;
      case "Shipped": return <FaShippingFast className="text-blue-500" />;
      case "Pending": return <FaHourglassHalf className="text-yellow-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-600";
      case "Shipped": return "bg-blue-100 text-blue-600";
      case "Pending": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
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

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Enhanced Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-8 right-20 w-4 h-4 bg-cyan-400/30 rounded-full animate-float"></div>
          <div className="absolute bottom-10 left-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white animate-fadeInUp">{getGreeting()}! 👋</h2>
                <p className="text-slate-300 mt-2 text-lg animate-fadeInUp" style={{animationDelay: '100ms'}}>
                  Welcome to your admin dashboard
                </p>
<div className="flex items-center gap-4 mt-3 animate-fadeInUp" style={{animationDelay: '200ms'}}>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCalendarAlt className="text-cyan-400" />
                    <span className="text-sm">{formatDate(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaClock className="text-purple-400 animate-pulse" />
                    <span className="text-sm font-mono">{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center gap-4">
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <Link to="/admin/category" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '100ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Categories</p><p className="text-2xl font-bold text-slate-800 mt-1"><AnimatedCounter end={stats.categories} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-yellow-500/30"><FaTags className="text-white text-xl"></FaTags></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600"><FaArrowUp className="text-xs" /> +12%</div>
                </div>
              </Link>
              
              <Link to="/admin/tile" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '150ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Total Tiles</p><p className="text-2xl font-bold text-slate-800 mt-1"><AnimatedCounter end={stats.tiles} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/30"><FaTh className="text-white text-xl"></FaTh></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600"><FaArrowUp className="text-xs" /> +8%</div>
                </div>
              </Link>
              
              <Link to="/admin/orders" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '200ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Total Orders</p><p className="text-2xl font-bold text-slate-800 mt-1"><AnimatedCounter end={stats.orders} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-500/30"><FaShoppingCart className="text-white text-xl"></FaShoppingCart></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600"><FaArrowUp className="text-xs" /> +15%</div>
                </div>
              </Link>
              
              <Link to="/admin/orders" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '250ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Revenue</p><p className="text-2xl font-bold text-slate-800 mt-1">₹<AnimatedCounter end={stats.revenue} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-purple-500/30"><FaRupeeSign className="text-white text-xl"></FaRupeeSign></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600"><FaArrowUp className="text-xs" /> +22%</div>
                </div>
              </Link>
              
              <Link to="/admin/orders" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '300ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Today Orders</p><p className="text-2xl font-bold text-slate-800 mt-1"><AnimatedCounter end={stats.todayOrders} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-cyan-500/30"><FaCalendarCheck className="text-white text-xl"></FaCalendarCheck></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">Today's</div>
                </div>
              </Link>
              
              <Link to="/admin/feedback" className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '350ms'}}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-slate-500 text-xs">Feedback</p><p className="text-2xl font-bold text-slate-800 mt-1"><AnimatedCounter end={stats.feedback} /></p></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-pink-500/30"><FaCommentAlt className="text-white text-xl"></FaCommentAlt></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600"><FaArrowUp className="text-xs" /> +5%</div>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Status Cards */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '400ms'}}>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FaChartBar className="text-cyan-500"></FaChartBar> 
                  Order Status Overview
                </h3>
                <Link to="/admin/orders" className="text-cyan-500 hover:text-cyan-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View All <FaArrowUp className="rotate-45 text-xs" />
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaHourglassHalf className="text-white text-xl"></FaHourglassHalf>
                      </div>
                      <span className="text-3xl font-bold text-slate-800"><AnimatedCounter end={orderStats.pending} /></span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Pending Orders</p>
                    <div className="mt-3">
                      <AnimatedProgressBar 
                        value={stats.orders > 0 ? Math.round((orderStats.pending / stats.orders) * 100) : 0} 
                        color="bg-yellow-500"
                        label="Of total orders"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaShippingFast className="text-white text-xl"></FaShippingFast>
                      </div>
                      <span className="text-3xl font-bold text-slate-800"><AnimatedCounter end={orderStats.shipped} /></span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Shipped Orders</p>
                    <div className="mt-3">
                      <AnimatedProgressBar 
                        value={stats.orders > 0 ? Math.round((orderStats.shipped / stats.orders) * 100) : 0} 
                        color="bg-blue-500"
                        label="Of total orders"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaCheckCircle className="text-white text-xl"></FaCheckCircle>
                      </div>
                      <span className="text-3xl font-bold text-slate-800"><AnimatedCounter end={orderStats.delivered} /></span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Delivered Orders</p>
                    <div className="mt-3">
                      <AnimatedProgressBar 
                        value={stats.orders > 0 ? Math.round((orderStats.delivered / stats.orders) * 100) : 0} 
                        color="bg-green-500"
                        label="Of total orders"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '450ms'}}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaLayerGroup className="text-purple-500"></FaLayerGroup> 
                Quick Stats
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-transparent rounded-2xl hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaUsers className="text-white"></FaUsers>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Total Customers</p>
                    <p className="text-lg font-bold text-slate-800"><AnimatedCounter end={stats.users} /></p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-2xl hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaMoneyBillWave className="text-white"></FaMoneyBillWave>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Pending Payments</p>
                    <p className="text-lg font-bold text-slate-800"><AnimatedCounter end={stats.pendingPayments} /></p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-2xl hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaBox className="text-white"></FaBox>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Tiles Sold</p>
                    <p className="text-lg font-bold text-slate-800"><AnimatedCounter end={stats.totalTilesSold} /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '500ms'}}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaShoppingCart className="text-cyan-500"></FaShoppingCart> 
                Recent Orders
              </h3>
              <Link to="/admin/orders" className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <FaBox className="text-3xl text-slate-300"></FaBox>
                  </div>
                  <p className="text-slate-500">No orders yet</p>
                  <p className="text-slate-400 text-sm">Orders will appear here</p>
                </div>
              ) : recentOrders.map((order, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 relative">
                      <img 
                        src={order.tile?.image ? fixImageUrl(order.tile.image) : "https://via.placeholder.com/56"} 
                        alt="Tile" 
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                      ></img>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate group-hover:text-cyan-600 transition-colors">
                        {order.tile?.title || "Unknown"}
                      </p>
                      <p className="text-slate-500 text-sm truncate">{order.user?.email || "Unknown"}</p>
                      <p className="text-slate-400 text-xs">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{order.totalAmount || (order.tile?.price * (order.quantity || 1)) || 0}</p>
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

          {/* Activity Timeline */}
          <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '550ms'}}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaChartLine className="text-purple-500"></FaChartLine> 
                Recent Activity
              </h3>
            </div>
            <div className="p-4">
              {activities.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaClock className="text-3xl text-slate-300"></FaClock>
                  </div>
                  <p className="text-slate-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
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
        </div>

        {/* Quick Actions */}
        <div className={`bg-white rounded-3xl shadow-lg overflow-hidden mb-8 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: '600ms'}}>
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FaPlus className="text-purple-500"></FaPlus> 
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link to="/admin/tile" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <FaTh className="text-white text-xl"></FaTh>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">Add New Tile</span>
              </Link>
              
              <Link to="/admin/category" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-yellow-500/20">
                  <FaTags className="text-white text-xl"></FaTags>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">Manage Categories</span>
              </Link>
              
              <Link to="/admin/orders" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-green-500/20">
                  <FaShoppingCart className="text-white text-xl"></FaShoppingCart>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">View Orders</span>
              </Link>
              
              <Link to="/admin/feedback" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-purple-500/20">
                  <FaCommentAlt className="text-white text-xl"></FaCommentAlt>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">Check Feedback</span>
              </Link>
              
              <Link to="/admin/settings" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-slate-500/20">
                  <FaCog className="text-white text-xl"></FaCog>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center pb-8 ${animated ? "opacity-100" : "opacity-0"}`} style={{transitionDelay: '700ms'}}>
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Tile Management System • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

