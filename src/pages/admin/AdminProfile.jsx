import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePhoto: ""
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const adminToken = localStorage.getItem("adminToken");

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.get("/admin/profile", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      setProfile({
        name: res.data.name || "Admin",
        email: res.data.email || "",
        phone: res.data.phone || "",
        profilePhoto: res.data.profilePhoto || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({
        name: localStorage.getItem("adminName") || "Admin",
        email: localStorage.getItem("adminEmail") || "",
        phone: "",
        profilePhoto: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [adminToken, navigate]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handlePhotoUrlChange = (url) => {
    setProfile({ ...profile, profilePhoto: url });
    setMessage({ type: "", text: "" });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.put("/admin/profile", {
        name: profile.name,
        phone: profile.phone,
        profilePhoto: profile.profilePhoto
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        localStorage.setItem("adminName", profile.name);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    setIsSaving(true);

    try {
      const res = await API.put("/admin/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <AdminSidebar />
        <div className="ml-64 w-full flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AdminSidebar />

      <div className="ml-64 w-full p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
          <p className="text-slate-500 mt-2">Manage your profile settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-xl font-medium ${
              activeTab === "profile"
                ? "bg-yellow-400 text-slate-900"
                : "bg-white text-slate-600"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-xl font-medium ${
              activeTab === "password"
                ? "bg-yellow-400 text-slate-900"
                : "bg-white text-slate-600"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-yellow-400">
                    {profile.profilePhoto ? (
                      <img 
                        src={profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={() => setProfile({...profile, profilePhoto: ""})}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-6xl text-slate-900" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-yellow-400 text-slate-900 p-2 rounded-full cursor-pointer">
                    <FaCamera />
                    <input 
                      type="text" 
                      placeholder="Enter Photo URL"
                      value={profile.profilePhoto}
                      onChange={(e) => handlePhotoUrlChange(e.target.value)}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                </div>
                <p className="text-slate-500 text-sm mt-2">Click camera icon to add photo URL</p>
              </div>

              {/* Profile Form */}
              <div className="flex-1">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <form onSubmit={handleChangePassword} className="max-w-lg mx-auto space-y-6">
              <div>
                <label className="block text-slate-700 font-medium mb-2">Current Password</label>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">New Password</label>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Confirm New Password</label>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl disabled:opacity-50"
              >
                {isSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;

