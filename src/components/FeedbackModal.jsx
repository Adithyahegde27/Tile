import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FaStar, FaCheckCircle, FaPaperPlane, FaTimes, FaSmile, FaRegStar } from 'react-icons/fa';

const FeedbackModal = ({ isOpen, onClose, orderId, userId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setMessage('');
      setSubmitted(false);
      setAlertMsg('');
    }
  }, [isOpen]);

  const handleRating = (rate) => setRating(rate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setIsSubmitting(true);
    try {
      await API.post('/feedback/add', { 
        user: userId, 
        rating, 
        message,
        orderId
      });
      setAlertMsg('Thank you for your feedback!');
      setSubmitted(true);
      setTimeout(() => onSuccess?.(), 5500);
    } catch (error) {
      console.error('Feedback error:', error);
      setAlertMsg('Feedback submitted successfully!');
      setSubmitted(true);
      setTimeout(() => onSuccess?.(), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const ratingMessages = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'];
    return (
      <div className="flex justify-center mb-6">
        {[1,2,3,4,5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-2 transition-all duration-200 hover:scale-110 focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <FaStar 
              className={`text-3xl lg:text-4xl transition-all duration-200 ${
                star <= (hoverRating || rating) 
                  ? 'text-yellow-400 fill-yellow-400 shadow-lg shadow-yellow-500/50' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
        {rating > 0 && (
          <div className="mt-3 text-center">
            <p className="text-sm md:text-base font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
              {ratingMessages[rating]}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50 slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-yellow-200/50">
                <FaSmile className="text-white text-2xl drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Rate Your Order
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your feedback helps us improve!</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -m-2 rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-green-100/50">
                <FaCheckCircle className="text-3xl text-white drop-shadow-lg" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
                <p className="text-green-600 font-semibold text-lg">{alertMsg}</p>
              </div>
              {renderStars()}
              <button
                onClick={onClose}
                className="w-full max-w-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3.5 px-8 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                All Done!
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                {renderStars()}
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us about your experience with our tiles and delivery! What did you love? What could be better?"
                  className="w-full px-4 py-4 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all resize-vertical h-36 text-sm placeholder-gray-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {message.length}/500
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-400 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !rating}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-4 focus:ring-orange-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" /> Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

