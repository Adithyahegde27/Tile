import React, { useState } from "react";
import API from "../../services/api";
import { FaCommentAlt, FaStar, FaPaperPlane, FaCheck, FaEnvelope, FaThumbsUp } from "react-icons/fa";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await API.post("/feedback/add", {
        user: userId,
        message,
        rating,
      });

      setAlertMsg(res.data.message || "Thank you for your feedback!");
      setIsSubmitted(true);
      setMessage("");
      setRating(0);
    } catch (error) {
      setAlertMsg("Thank you for your feedback!");
      setIsSubmitted(true);
      setMessage("");
      setRating(0);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setAlertMsg("");
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className="transform transition-all duration-200 hover:scale-125"
      >
        <FaStar 
          className={`text-4xl transition-all duration-200 ${
            star <= (hoverRating || rating) 
              ? "text-yellow-400 scale-110 drop-shadow-lg" 
              : "text-gray-300"
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16">
      <div className="w-full p-8 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl shadow-lg shadow-yellow-400/30 mb-4 animate-bounce">
              <FaCommentAlt className="text-4xl text-slate-900" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800">Write Feedback</h2>
            <p className="text-slate-500 mt-2">We'd love to hear your thoughts</p>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-scaleIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/30 animate-pulse">
                <FaCheck className="text-5xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
              <p className="text-slate-500 mb-6">{alertMsg}</p>
              <button 
                onClick={resetForm}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-400/30"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-slideUp">
                {/* Rating */}
                <div className="text-center mb-8">
                  <label className="block mb-4 font-semibold text-slate-700">
                    How would you rate us?
                  </label>
                  <div className="flex justify-center gap-2">
                    {renderStars()}
                  </div>
                  <p className="mt-3 text-slate-500">
                    {rating === 0 && "Click to rate"}
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent!"}
                  </p>
                </div>

                {/* Message */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">
                      Your Feedback
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        placeholder="Tell us what you think..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white transition-all resize-none h-32"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || rating === 0}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaPaperPlane /> Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Tips */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: <FaThumbsUp />, tip: "Be honest", color: "from-blue-400 to-blue-500" },
                  { icon: <FaStar />, tip: "Rate fairly", color: "from-yellow-400 to-orange-500" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/80 backdrop-blur rounded-2xl p-4 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white`}>
                      {item.icon}
                    </div>
                    <span className="text-slate-700 font-medium">{item.tip}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
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
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideUp { animation: slideUp 0.5s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default Feedback;

