import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSave, FaTimes, FaUserCircle, FaEdit, FaKey, FaCamera, FaUpload } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("mytoken");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePhoto: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user profile
  const fetchProfile = async () => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.get(`/auth/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProfile(res.data.user);
        setEditForm({
          name: res.data.user.name || "",
          phone: res.data.user.phone || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Use localStorage data as fallback
      setProfile({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        phone: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, token, navigate]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.put(`/auth/profile/${userId}`, {
        name: editForm.name,
        phone: editForm.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setProfile(res.data.user);
        localStorage.setItem("userName", res.data.user.name);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditMode(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setIsSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      setIsSaving(false);
      return;
    }

    try {
      const res = await API.put(`/auth/password/${userId}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({
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
      const res = await API.post(`/auth/profile-photo/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setProfile({ ...profile, profilePhoto: res.data.profilePhoto });
        localStorage.setItem("userProfilePhoto", res.data.profilePhoto);
        setMessage({ type: "success", text: "Profile photo updated successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to upload photo" });
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16">
      <div className="w-full p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg shadow-yellow-400/30">
              <FaUserCircle className="text-2xl text-slate-900" />
            </div>
            My Profile
          </h1>
          <p className="text-slate-500 mt-2 ml-16">Manage your account settings</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl animate-fadeIn ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 animate-slideIn">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaUser /> Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "password"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaKey /> Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-lg p-8 animate-fadeIn">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUserCircle className="text-6xl text-slate-300" />
                    </div>
                  )}
                </div>
                {/* Upload Button Overlay */}
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:scale-110 transition-transform"
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

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaSave />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditForm({ name: profile.name, phone: profile.phone });
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-slate-800">{profile.name || "Not set"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-slate-800">{profile.email || "Not set"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-slate-800">{profile.phone || "Not set"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Account Type</p>
                    <p className="text-lg font-semibold text-slate-800 capitalize">{profile.role || "User"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-3xl shadow-lg p-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
              <div>
                <label className="block mb-2 font-medium text-slate-700">Current Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaKey />
                )}
                Change Password
              </button>
            </form>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 animate-fadeIn">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <FaUserCircle /> Logout
          </button>
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
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default UserProfile;

