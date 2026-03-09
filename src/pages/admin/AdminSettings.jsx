import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaSave, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  
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
      window.location.href = "/admin/login";
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
      // Use stored data as fallback
      setProfile({
        name: localStorage.getItem("adminName") || "Admin",
        email: localStorage.getItem("adminEmail") || "",
        phone: "",
        profilePhoto: localStorage.getItem("adminPhoto") || ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [adminToken]);

  // Handle profile input change
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPEG, PNG, GIF, WebP)" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    setIsUploading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await API.post("/admin/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (res.data.success) {
        setProfile({ ...profile, profilePhoto: res.data.profilePhoto });
        localStorage.setItem("adminPhoto", res.data.profilePhoto);
        setMessage({ type: "success", text: "Profile photo updated successfully!" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to upload photo" });
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile
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
        // Update localStorage
        localStorage.setItem("adminName", profile.name);
        localStorage.setItem("adminPhoto", profile.profilePhoto);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
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
      <div className="flex bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 min-h-screen">
        <AdminSidebar />
        <div className="ml-64 w-full flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 min-h-screen">
      <AdminSidebar />

      <div className="ml-64 w-full p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg shadow-yellow-400/30">
              <FaShieldAlt className="text-2xl text-slate-900" />
            </div>
            Admin Settings
          </h1>
          <p className="text-slate-500 mt-2 ml-16">Manage your profile and settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaUser className="inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "password"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaLock className="inline mr-2" />
            Change Password
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === "success" 
              ? "bg-green-100 text-green-600 border border-green-200" 
              : "bg-red-100 text-red-600 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-lg p-8 animate-slideUp">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto.startsWith("http") ? profile.profilePhoto : `http://localhost:5000${profile.profilePhoto}`} 
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
                {/* Upload Button Overlay */}
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:scale-110 transition-transform"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCamera />
                  )}
                </button>
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {isUploading ? "Uploading..." : "Click the camera icon to change photo"}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Form */}
              <div className="flex-1">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-slate-400 text-sm mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-3xl shadow-lg p-8 animate-slideUp">
            <form onSubmit={handleChangePassword} className="max-w-lg mx-auto space-y-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Change Password</h2>

              {/* Current Password */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">Current Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaLock />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideUp { animation: slideUp 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default AdminSettings;

