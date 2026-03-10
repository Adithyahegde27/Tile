import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        localStorage.setItem("adminPhoto", profile.profilePhoto);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
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
          <h1 className="text-3xl font-bold text-slate-800">Admin Settings</h1>
          <p className="text-slate-500 mt-2">Manage your profile and settings</p>
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
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-yellow-400">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto.startsWith("http") ? profile.profilePhoto : `http://localhost:5000${profile.profilePhoto}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-6xl text-slate-900" />
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCamera />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

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
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <form onSubmit={handleChangePassword} className="max-w-lg mx-auto space-y-6">
              <div>
                <label className="block text-slate-700 font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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

export default AdminSettings;

