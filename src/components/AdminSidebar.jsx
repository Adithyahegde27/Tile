import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaTags, FaTh, FaShoppingCart, FaCommentAlt, FaSignOutAlt, FaTimes, FaBars, FaCog, FaUserCircle, FaChevronLeft } from "react-icons/fa";
import API from "../services/api";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const [isHovering, setIsHovering] = useState(null);
  const [animated, setAnimated] = useState(false);
  const location = useLocation();
  const [adminData, setAdminData] = useState({
    name: localStorage.getItem("adminName") || "Admin",
    profilePhoto: localStorage.getItem("adminPhoto") || ""
  });

  const adminToken = localStorage.getItem("adminToken");

  // Trigger entrance animation on mount
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  // Handle sidebar toggle and notify parent
  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isOpen);
    }
  };

  // Fetch admin profile
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (adminToken) {
        try {
          const res = await API.get("/admin/profile", {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          const name = res.data.name || "Admin";
          const photo = res.data.profilePhoto || "";
          setAdminData({ name, profilePhoto: photo });
          localStorage.setItem("adminName", name);
          localStorage.setItem("adminPhoto", photo);
        } catch (error) {
          console.log("Error fetching admin profile:", error);
        }
      }
    };
    fetchAdminProfile();
  }, [adminToken]);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/category", label: "Manage Category", icon: <FaTags /> },
    { path: "/admin/tile", label: "Manage Tile", icon: <FaTh /> },
    { path: "/admin/orders", label: "Manage Orders", icon: <FaShoppingCart /> },
    { path: "/admin/feedback", label: "View Feedback", icon: <FaCommentAlt /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminPhoto");
    window.location.href = "/admin/login";
  };

  return (
    <div 
      className={`relative z-20 transition-all duration-500 ease-out ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Main Sidebar Container */}
      <div 
        className="h-screen flex flex-col relative overflow-hidden transition-all duration-500 ease-out"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: '4px 0 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 opacity-20">
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
        </div>

        {/* Top Section with Logo & Profile */}
        <div className={`relative pt-6 pb-4 px-4 transition-all duration-500 ${!isOpen && "px-2"}`}>
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className={`absolute top-4 transition-all duration-300 ${
              isOpen ? "right-4" : "left-1/2 -translate-x-1/2"
            }`}
          >
            <div className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-180 ${
              isOpen 
                ? "bg-slate-700/50 text-cyan-400 hover:bg-cyan-500/20" 
                : "bg-cyan-500 text-slate-900"
            }`}>
              {isOpen ? (
                <FaTimes size={16} />
              ) : (
                <FaBars size={16} />
              )}
            </div>
          </button>

          {/* Profile Card */}
          <div className={`flex items-center gap-3 mt-8 ${!isOpen ? "justify-center" : ""}`}>
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-cyan-500/30 shadow-lg">
                {adminData.profilePhoto ? (
                  <img 
                    src={adminData.profilePhoto.startsWith("http") ? adminData.profilePhoto : `http://localhost:5000${adminData.profilePhoto}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={() => setAdminData({...adminData, profilePhoto: ""})}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <FaUserCircle className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            
            {/* Info - Only show when expanded */}
            <div className={`transition-all duration-500 overflow-hidden ${
              !isOpen ? "opacity-0 w-0" : "opacity-100"
            }`}>
              <h2 className="text-lg font-bold text-white">
                {adminData.name}
              </h2>
              <p className="text-xs text-cyan-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Menu Section */}
        <div className="px-3 py-2">
          <p className={`text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 transition-all duration-500 ${
            !isOpen ? "opacity-0 text-center" : "px-3"
          }`}>
            Menu
          </p>
          
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li 
                  key={item.path}
                  style={{ 
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.4s ease-out ${index * 0.1}s`
                  }}
                >
                  <Link
                    to={item.path}
                    onMouseEnter={() => setIsHovering(item.path)}
                    onMouseLeave={() => setIsHovering(null)}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400"
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-r-full" />
                    )}
                    
                    {/* Icon */}
                    <span className={`text-lg transition-all duration-300 ${
                      isActive 
                        ? "scale-110" 
                        : isHovering === item.path 
                          ? "scale-110" 
                          : "scale-100"
                    }`}>
                      {item.icon}
                    </span>
                    
                    {/* Label */}
                    <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                      !isOpen && "opacity-0 w-0 overflow-hidden"
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Arrow */}
                    <div className={`ml-auto transition-all duration-300 ${
                      isOpen ? "opacity-0 group-hover:opacity-100 group-hover:translate-x-1" : "hidden"
                    }`}>
                      <FaChevronLeft className={`text-xs ${isActive ? "text-white" : "text-cyan-400"}`} />
                    </div>
                    
                    {/* Tooltip */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl border border-slate-700 z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout Section */}
        <div className="px-3 py-4">
          <div className={`h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4 transition-all duration-500 ${
            !isOpen ? "mx-2" : "mx-4"
          }`} />
          
          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsHovering('logout')}
            onMouseLeave={() => setIsHovering(null)}
            className={`group relative flex items-center gap-3 px-3 py-3 w-full rounded-xl transition-all duration-300 ${
              isHovering === 'logout'
                ? "bg-red-500/10 text-red-400" 
                : "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            }`}
          >
            <span className={`text-lg transition-all duration-300 ${
              isHovering === 'logout' ? "scale-110" : "scale-100"
            }`}>
              <FaSignOutAlt />
            </span>
            
            <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
              !isOpen && "opacity-0 w-0 overflow-hidden"
            }`}>
              Logout
            </span>
            
            {/* Tooltip */}
            {!isOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl border border-slate-700 z-50">
                Logout
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700" />
              </div>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className={`px-4 pb-4 text-center transition-all duration-500 ${
          !isOpen ? "opacity-0" : "opacity-100"
        }`}>
          <p className="text-slate-600 text-xs">
            Tile Management
          </p>
          <p className="text-slate-700 text-[10px]">
            © 2024 All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

