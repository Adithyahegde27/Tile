import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../services/api";
import { FaUser, FaCamera, FaSave, FaEye, FaEyeSlash, FaUserShield, FaLock, FaEnvelope, FaPhone, FaCheck, FaTimes, FaCog, FaShieldAlt } from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [animated, setAnimated] = useState(false);
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

  useEffect(() => {
    setAnimated(true);
    fetchAdminProfile();
  }, []);

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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" />
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FaCog className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Account Settings</h2>
                <p className="text-violet-100 mt-1">Manage your profile and security settings</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-4 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '100ms' }}>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white text-slate-600 hover:bg-violet-50"
              }`}
            >
              <FaUser />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                activeTab === "password"
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white text-slate-600 hover:bg-violet-50"
              }`}
            >
              <FaShieldAlt />
              Security
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl transition-all duration-500 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`} style={{ transitionDelay: '150ms' }}>
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {message.type === "success" ? <FaCheck className="text-xl" /> : <FaTimes className="text-xl" />}
                {message.text}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '200ms' }}>
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-violet-500 to-purple-500">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUser /> Profile Information
                </h3>
              </div>
              <div className="p-8">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-600 ring-4 ring-violet-100 shadow-2xl">
                      {profile.profilePhoto ? (
                        <img 
                          src={profile.profilePhoto.startsWith("http") ? profile.profilePhoto : `http://localhost:5000${profile.profilePhoto}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-white text-5xl" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-12 h-12 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                  <p className="text-slate-500 mt-3 text-sm">Click the camera icon to upload a new photo</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                        <FaUser className="text-violet-500" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                        <FaEnvelope className="text-violet-500" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500 text-lg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                        <FaPhone className="text-violet-500" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="Enter your phone number"
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 hover:scale-[1.02] text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '200ms' }}>
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-violet-500 to-purple-500">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaShieldAlt /> Security Settings
                </h3>
              </div>
              <div className="p-8">
                <form onSubmit={handleChangePassword} className="max-w-xl mx-auto space-y-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                      <FaLock className="text-violet-500" /> Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter current password"
                        className="w-full p-4 pr-14 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                      >
                        {showPasswords.current ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                      <FaLock className="text-violet-500" /> New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter new password"
                        className="w-full p-4 pr-14 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                      >
                        {showPasswords.new ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                      <FaLock className="text-violet-500" /> Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Confirm new password"
                        className="w-full p-4 pr-14 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                      >
                        {showPasswords.confirm ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 hover:scale-[1.02] text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <FaShieldAlt /> Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

