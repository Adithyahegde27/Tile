import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../services/api";
import { FaStar, FaTrashAlt, FaCommentAlt, FaSearch, FaFilter, FaEnvelope, FaUser, FaCalendar, FaQuoteLeft, FaQuoteRight, FaRegStar } from "react-icons/fa";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    setAnimated(true);
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/feedback/all");
      setFeedbacks(res.data || []);
    } catch (error) {
      console.log(error);
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await API.delete(`/feedback/delete/${id}`);
      fetchFeedback();
    } catch (error) {
      console.log(error);
    }
  };

  const getRatingStars = (rating, size = "text-sm") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
      } else {
        stars.push(<FaRegStar key={i} className={`${size} text-slate-300`} />);
      }
    }
    return stars;
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = !searchTerm || 
      feedback.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "all" || feedback.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const getRatingCounts = () => {
    return {
      all: feedbacks.length,
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length,
    };
  };

  const counts = getRatingCounts();

  const getRatingColor = (rating) => {
    switch(rating) {
      case 5: return { bg: "bg-gradient-to-r from-green-500 to-emerald-500", shadow: "shadow-green-500/30", text: "text-green-600" };
      case 4: return { bg: "bg-gradient-to-r from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30", text: "text-blue-600" };
      case 3: return { bg: "bg-gradient-to-r from-yellow-500 to-orange-500", shadow: "shadow-yellow-500/30", text: "text-yellow-600" };
      case 2: return { bg: "bg-gradient-to-r from-orange-500 to-red-500", shadow: "shadow-orange-500/30", text: "text-orange-600" };
      case 1: return { bg: "bg-gradient-to-r from-red-500 to-rose-500", shadow: "shadow-red-500/30", text: "text-red-600" };
      default: return { bg: "bg-slate-500", shadow: "shadow-slate-500/30", text: "text-slate-600" };
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FaCommentAlt className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold border-2 border-white">
                      {counts.all}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Customer Feedback</h2>
                    <p className="text-teal-100 mt-1">View and manage customer reviews</p>
                  </div>
                </div>
              </div>

              {/* Rating Stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { key: "all", label: "All", icon: <FaCommentAlt /> },
                  { key: "5", label: "5 Star", icon: <FaStar /> },
                  { key: "4", label: "4 Star", icon: <FaStar /> },
                  { key: "3", label: "3 Star", icon: <FaStar /> },
                  { key: "2", label: "2 Star", icon: <FaStar /> },
                  { key: "1", label: "1 Star", icon: <FaStar /> }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setRatingFilter(item.key.toString())}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      ratingFilter === item.key.toString()
                        ? "bg-white text-teal-600 shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">
                      {item.key === "all" ? counts.all : counts[item.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '100ms' }}>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, email or feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-base"
              />
            </div>
          </div>

          {/* Feedback Grid */}
          {isLoading ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 mt-4 text-lg">Loading feedback...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className={`bg-white rounded-3xl shadow-lg p-16 text-center transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCommentAlt className="text-slate-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                {searchTerm || ratingFilter !== "all" ? "No feedback found" : "No feedback yet"}
              </h3>
              <p className="text-slate-400">
                {searchTerm || ratingFilter !== "all" ? "Try different search criteria" : "Customer feedback will appear here"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeedbacks.map((item, index) => {
                const ratingStyle = getRatingColor(item.rating);
                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${selectedFeedback === item._id ? 'ring-2 ring-teal-500' : ''}`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                    onClick={() => setSelectedFeedback(selectedFeedback === item._id ? null : item._id)}
                  >
                    {/* Rating Badge */}
                    <div className={`p-4 ${ratingStyle.bg} text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {getRatingStars(item.rating, "text-lg")}
                        </div>
                        <span className="font-bold text-lg">{item.rating}/5</span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* User Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {item.user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{item.user?.name || "Anonymous"}</h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            {item.user?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="relative mb-4">
                        <FaQuoteLeft className="text-teal-200 text-2xl absolute -top-1 left-0" />
                        <p className="text-slate-600 pl-8 pr-4 leading-relaxed line-clamp-3">
                          {item.message}
                        </p>
                        <FaQuoteRight className="text-teal-200 text-2xl absolute -bottom-2 right-0" />
                      </div>

                      {/* Date & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                          className="flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-500 hover:text-white text-red-500 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {selectedFeedback === item._id && (
                      <div className="px-6 pb-6 animate-fadeIn">
                        <div className="p-4 bg-teal-50 rounded-xl">
                          <h4 className="font-bold text-teal-600 mb-2">Full Feedback</h4>
                          <p className="text-slate-600 text-sm">{item.message}</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                            <FaUser className="text-teal-500" />
                            <span>{item.user?.name || "Anonymous"}</span>
                            <span>•</span>
                            <span>{item.user?.email || "No email"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewFeedback;

