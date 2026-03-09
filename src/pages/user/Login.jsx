import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    useremail: "",
    userpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.useremail.trim()) {
      newErrors.useremail = "Email is required";
    } else if (!emailRegex.test(form.useremail)) {
      newErrors.useremail = "Please enter a valid email address";
    }

    // Password validation
    if (!form.userpassword) {
      newErrors.userpassword = "Password is required";
    } else if (form.userpassword.length < 6) {
      newErrors.userpassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        form
      );

      if (res.data.success) {
        alert(res.data.message);
        localStorage.setItem("mytoken", res.data.token);
        // Store user data in localStorage
        if (res.data.user) {
          localStorage.setItem("userId", res.data.user._id);
          localStorage.setItem("userName", res.data.user.name);
          localStorage.setItem("userEmail", res.data.user.email);
        }
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
            <FaSignInAlt className="text-4xl text-slate-900" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="useremail"
              placeholder="Enter Email"
              value={form.useremail}
              onChange={handleChange}
              required
              className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.useremail ? 'border-red-500' : 'border-white/20'}`}
            />
          </div>
          {errors.useremail && <p className="text-red-400 text-sm mt-1">{errors.useremail}</p>}

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="userpassword"
              placeholder="Enter Password"
              value={form.userpassword}
              onChange={handleChange}
              required
              className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.userpassword ? 'border-red-500' : 'border-white/20'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.userpassword && <p className="text-red-400 text-sm mt-1">{errors.userpassword}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

