import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaTags, FaTh, FaShoppingCart, FaCommentAlt, FaSignOutAlt, FaTimes, FaBars, FaCog, FaUser, FaUserCircle } from "react-icons/fa";
import API from "../services/api";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [adminData, setAdminData] = useState({
    name: localStorage.getItem("adminName") || "Admin",
    profilePhoto: localStorage.getItem("adminPhoto") || ""
  });

  const adminToken = localStorage.getItem("adminToken");

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
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 min-h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } relative z-20`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-3 text-yellow-400 hover:text-yellow-300 transition-colors p-2"
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Logo / Admin Profile Section */}
      <div className={`mb-6 mt-6 ${!isOpen && "text-center"}`}>
        {isOpen ? (
          <div className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center overflow-hidden shadow-lg">
              {adminData.profilePhoto ? (
                <img 
                  src={adminData.profilePhoto.startsWith("http") ? adminData.profilePhoto : `http://localhost:5000${adminData.profilePhoto}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={() => setAdminData({...adminData, profilePhoto: ""})}
                />
              ) : (
                <FaUserCircle className="text-3xl text-slate-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-yellow-400 truncate">
                {adminData.name}
              </h2>
              <p className="text-slate-400 text-xs truncate">
                Admin
              </p>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center overflow-hidden shadow-lg">
            {adminData.profilePhoto ? (
              <img 
                src={adminData.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={() => setAdminData({...adminData, profilePhoto: ""})}
              />
            ) : (
              <FaUserCircle className="text-2xl text-slate-900" />
            )}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-yellow-400 text-slate-900 font-semibold" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-yellow-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`whitespace-nowrap transition-all duration-200 ${!isOpen && "hidden"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="mt-8 pt-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200`}
        >
          <span className="text-lg">
            <FaSignOutAlt />
          </span>
          <span className={`whitespace-nowrap transition-all duration-200 ${!isOpen && "hidden"}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

