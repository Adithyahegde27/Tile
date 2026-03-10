
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { FaCommentAlt, FaStar, FaPaperPlane, FaCheck, FaEnvelope, FaSmile, FaHeart, FaBell } from "react-icons/fa";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await API.post("/feedback/add", { user: userId, message, rating });
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
      <button key={star} type="button" onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
        className="transform transition-all duration-200 hover:scale-125">
        <FaStar className={`text-4xl transition-all duration-200 ${star <= (hoverRating || rating) ? "text-yellow-400 scale-110 drop-shadow-lg" : "text-gray-300"}`} />
      </button>
    ));
  };

  const ratingMessages = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="relative bg-gradient-to-r from-green-500 via-teal-500 to-yellow-500 py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            We'd Love Your Feedback
          </h1>
          <p className={`text-white/80 text-lg ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            Help us improve by sharing your experience
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {isSubmitted ? (
          <div className={`bg-white rounded-3xl shadow-2xl p-12 text-center ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <FaCheck className="text-6xl text-white" />
            </div>
            <h3 className="text-3xl font-bold text-green-600 mb-3">Thank You!</h3>
            <p className="text-gray-500 mb-8 text-lg">{alertMsg}</p>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8">
              <p className="text-gray-600 mb-3">Your Rating:</p>
              <div className="flex justify-center gap-1 mb-2">
                {[1,2,3,4,5].map((star) => <FaStar key={star} className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`} />)}
              </div>
              <p className="font-semibold text-green-600">{ratingMessages[rating]}</p>
            </div>
            <button onClick={resetForm} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto">
              <FaPaperPlane /> Submit Another
            </button>
          </div>
        ) : (
          <>
            <div className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="text-center mb-10">
                <label className="block mb-6 font-bold text-gray-700 text-lg">How would you rate your experience?</label>
                <div className="flex justify-center gap-3 mb-4">{renderStars()}</div>
                <p className="text-lg font-medium">{rating === 0 ? <span className="text-gray-400">Click to rate</span> : <span className="text-yellow-600">{ratingMessages[rating]}</span>}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block mb-3 font-semibold text-gray-700">Your Feedback</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                    <textarea placeholder="Tell us what you loved or what we can improve..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/20 transition-all resize-none h-40"
                      value={message} onChange={(e) => setMessage(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || rating === 0}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3 text-lg">
                  {isLoading ? <div className="w-7 h-7 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : <><FaPaperPlane /> Submit Feedback</>}
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[{icon:<FaSmile/>,tip:"Be Honest",color:"from-yellow-400 to-orange-500"},{icon:<FaHeart/>,tip:"Share Love",color:"from-red-400 to-pink-500"},{icon:<FaBell/>,tip:"Be Specific",color:"from-blue-400 to-cyan-500"}].map((item,i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white text-xl`}>{item.icon}</div>
                  <span className="text-gray-700 font-semibold">{item.tip}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;

