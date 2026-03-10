
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSave, FaTimes, 
  FaUserCircle, FaEdit, FaKey, FaCamera, FaUpload, FaShoppingCart, 
  FaHeart, FaMapMarkerAlt, FaBell, FaShieldAlt, FaCog, FaSignOutAlt,
  FaCalendarAlt, FaBox
} from "react-icons/fa";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 1500 }) => {
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

  return <span ref={ref}>{count}</span>;
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [animated, setAnimated] = useState(false);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0 });
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userphone: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnimated(true);
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("mytoken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const res = await API.get(`/users/getUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
        setFormData({
          username: res.data.username || "",
          useremail: res.data.useremail || "",
          userphone: res.data.userphone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      // Get orders count
      const ordersRes = await API.get(`/order/myorders/${userId}`);
      const ordersCount = ordersRes.data?.length || 0;
      
      // Get wishlist count
      const wishlist = JSON.parse(localStorage.getItem("userWishlist") || "[]");
      const wishlistCount = wishlist.length;
      
      setStats({
        orders: ordersCount,
        wishlist: wishlistCount,
        reviews: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("mytoken");
      const userId = localStorage.getItem("userId");

      const res = await API.put(`/users/updateUser/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("mytoken");
      const userId = localStorage.getItem("userId");

      await API.put(`/users/changePassword/${userId}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: FaUser },
    { id: "orders", label: "My Orders", icon: FaShoppingCart },
    { id: "wishlist", label: "Wishlist", icon: FaHeart },
    { id: "address", label: "Addresses", icon: FaMapMarkerAlt },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 py-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                {user?.userimage ? (
                  <img src={user.userimage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="text-6xl text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <FaCamera className="text-yellow-500" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeInUp">
                {user?.username || "User"}
              </h1>
              <p className="text-yellow-50 text-lg animate-fadeInUp" style={{animationDelay: '100ms'}}>
                {user?.useremail || "user@example.com"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 animate-fadeInUp" style={{animationDelay: '200ms'}}>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <FaShoppingCart className="text-white" />
                  <span className="text-white font-bold"><AnimatedCounter end={stats.orders} /></span>
                  <span className="text-yellow-50">Orders</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <FaHeart className="text-white" />
                  <span className="text-white font-bold"><AnimatedCounter end={stats.wishlist} /></span>
                  <span className="text-yellow-50">Wishlist</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <FaCalendarAlt className="text-white" />
                  <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                  <span className="text-yellow-50">Member since</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-300 hover:bg-yellow-50 ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white" 
                      : "text-gray-700"
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 text-left text-red-600 hover:bg-red-50 transition-all duration-300 border-t border-gray-100"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>

                {message.text && (
                  <div className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleProfileUpdate}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="useremail"
                          value={formData.useremail}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="userphone"
                          value={formData.userphone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Account ID</label>
                      <div className="relative">
                        <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={user?._id?.slice(-8)?.toUpperCase() || "N/A"}
                          disabled
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaSave />
                        )}
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setMessage({ type: "", text: "" }); }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                <div className="text-center py-12">
                  <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">View and track your orders</p>
                  <button
                    onClick={() => navigate("/track")}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
                  >
                    Track Orders
                  </button>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your saved items</p>
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
                  >
                    View Wishlist
                  </button>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Addresses</h2>
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Manage your delivery addresses</p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
                  >
                    Add New Address
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShieldAlt className="text-yellow-500" /> Security Settings
                </h2>

                {message.text && (
                  <div className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                      <div className="relative">
                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className={`bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaCog className="text-yellow-500" /> Account Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBell className="text-yellow-500" />
                      <span className="font-medium text-gray-700">Notifications</span>
                    </div>
                    <div className="w-12 h-6 bg-yellow-400 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaShieldAlt className="text-yellow-500" />
                      <span className="font-medium text-gray-700">Two-Factor Authentication</span>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-yellow-500" />
                      <span className="font-medium text-gray-700">Email Notifications</span>
                    </div>
                    <div className="w-12 h-6 bg-yellow-400 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

