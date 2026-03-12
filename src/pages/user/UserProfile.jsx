import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import { FaUser, FaCamera, FaSave, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaPhone, FaCheck, FaTimes, FaSignOutAlt } from "react-icons/fa";

const UserProfile = () => {
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

  const token = localStorage.getItem("mytoken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!token || !userId) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.get(`/auth/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = res.data.user || res.data;
      setProfile({
        name: userData.name || "User",
        email: userData.email || "",
        phone: userData.phone || "",
        profilePhoto: userData.profilePhoto || ""
      });
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userProfilePhoto", userData.profilePhoto);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "",
        phone: "",
        profilePhoto: localStorage.getItem("userProfilePhoto") || ""
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
      const res = await API.post(`/auth/profile-photo/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      const newPhoto = res.data.profilePhoto || res.data;
      setProfile({ ...profile, profilePhoto: newPhoto });
      localStorage.setItem("userProfilePhoto", newPhoto);
      setMessage({ type: "success", text: "Profile photo updated successfully!" });
      fetchUserProfile();
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
      const res = await API.put(`/auth/profile/${userId}`, {
        name: profile.name,
        phone: profile.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem("userName", profile.name);
      localStorage.setItem("userEmail", profile.email);
      localStorage.setItem("userProfilePhoto", profile.profilePhoto);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      fetchUserProfile();
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
      const res = await API.put(`/auth/password/${userId}`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6 pt-16">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 pt-16">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Profile Photo */}
        <div className="p-8 text-center border-b border-slate-100">
          <div className="relative inline-block mx-auto">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-yellow-100 shadow-2xl mx-auto">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto.startsWith('http') ? profile.profilePhoto : ('http://localhost:5000' + profile.profilePhoto)} 
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
              className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center text-white shadow-lg -mr-3 -mb-3 transition-all duration-300 hover:scale-110"
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
          <p className="text-slate-500 mt-3 text-sm">Click camera to upload photo</p>
        </div>

        {/* Profile Form */}
        <div className="p-8 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {message.type === "success" ? <FaCheck className="text-xl" /> : <FaTimes className="text-xl" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaUser className="text-yellow-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaEnvelope className="text-yellow-500" /> Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaPhone className="text-yellow-500" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Profile
                </>
              )}
            </button>
          </form>

          {/* Password Change */}
          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FaLock className="text-yellow-500" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-4 pr-14 border border-slate-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className="w-full p-4 pr-14 border border-slate-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-4 pr-14 border border-slate-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaLock /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.clear();
                  window.location.href = "/login";
                }
              }}
              className="flex items-center gap-2 px-8 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors mx-auto"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
