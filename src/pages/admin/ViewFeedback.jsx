import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaStar, FaTrashAlt } from "react-icons/fa";

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
      } else {
        stars.push(<FaStar key={i} className="text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white">View Feedback</h2>
          <p className="text-white/80 text-sm">Customer feedback and ratings</p>
        </div>

        {/* Feedback Grid */}
        {isLoading ? (
          <div className="text-center p-12">Loading...</div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No feedback yet</h3>
            <p className="text-slate-400">Customer feedback will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {getRatingStars(item.rating)}
                  <span className="ml-2 text-slate-600">/5</span>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-slate-800">
                    {item.user?.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {item.user?.email || "No email"}
                  </p>
                </div>

                {/* Message */}
                <p className="text-slate-600 mb-4">{item.message}</p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;

