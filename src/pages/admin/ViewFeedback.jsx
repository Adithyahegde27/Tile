import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaCommentAlt, FaUser, FaStar, FaTrashAlt, FaQuoteLeft, FaStarHalfAlt } from "react-icons/fa";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    fetchFeedback();
  }, []);

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-slate-300" />);
      }
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "from-emerald-500 to-teal-500";
    if (rating >= 3) return "from-amber-500 to-yellow-500";
    return "from-red-500 to-orange-500";
  };

  const getRatingBg = (rating) => {
    if (rating >= 4) return "bg-emerald-50";
    if (rating >= 3) return "bg-amber-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl animate-bounce">
                <FaCommentAlt className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">View Feedback</h2>
                <p className="text-white/80 text-sm">Customer feedback and ratings</p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">{feedbacks.length}</span>
              <span className="text-white/80 text-sm ml-2">Total Feedbacks</span>
            </div>
          </div>
        </div>

        {/* Feedback Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-2/3 shimmer" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 shimmer" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-200 rounded shimmer" />
                  <div className="h-4 bg-slate-200 rounded shimmer" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-full mb-4">
              <FaCommentAlt className="text-5xl text-teal-300 animate-float" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No feedback yet</h3>
            <p className="text-slate-400">Customer feedback will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden animate-fadeInUp card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 text-teal-100 group-hover:text-teal-200 transition-colors">
                  <FaQuoteLeft size={32} />
                </div>

                {/* Rating Badge */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRatingBg(item.rating)}`}>
                  <div className="flex items-center gap-1">
                    {getRatingStars(item.rating)}
                  </div>
                  <span className="ml-1 text-slate-600">/5</span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRatingColor(item.rating)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                    {item.user?.name ? item.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-teal-600 transition-colors">
                      {item.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4 relative">
                  <p className="text-slate-600 leading-relaxed line-clamp-4">
                    {item.message}
                  </p>
                </div>

                {/* Rating Display & Delete */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className={`flex items-center gap-1 font-bold bg-gradient-to-r ${getRatingColor(item.rating)} bg-clip-text text-transparent`}>
                    {item.rating}/5
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-red-400/30"
                  >
                    <FaTrashAlt size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {feedbacks.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-slate-500 animate-fadeInUp delay-300">
            <span>Showing {feedbacks.length} feedbacks</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live updates enabled
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;

