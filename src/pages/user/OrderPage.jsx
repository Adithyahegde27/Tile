import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FaShoppingCart, FaTruck, FaCheck, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaCalendarAlt, FaClock, FaUndo, FaHome } from "react-icons/fa";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  let userId = localStorage.getItem("userId");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cash"
  });

  // Order details from backend
  const [orderDetails, setOrderDetails] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    if (!userId) {
      alert("Please login first");
      navigate("/login");
    }
  }, [userId, navigate]);

  // Load cart or direct order item from localStorage
  useEffect(() => {
    // First check if there's a direct order item (from Buy Now button)
    const directOrderItem = localStorage.getItem("directOrderItem");
    if (directOrderItem) {
      try {
        const item = JSON.parse(directOrderItem);
        setCartItems([item]);
        // Clear the direct order item after loading
        localStorage.removeItem("directOrderItem");
      } catch (e) {
        setCartItems([]);
      }
    } else {
      // Fall back to cart items (from Add to Cart button)
      const savedCart = localStorage.getItem("userCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          setCartItems([]);
        }
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (index, change) => {
    const newCart = [...cartItems];
    const newQty = (newCart[index].quantity || 1) + change;
    if (newQty >= 1 && newQty <= 10) {
      newCart[index].quantity = newQty;
      setCartItems(newCart);
      localStorage.setItem("userCart", JSON.stringify(newCart));
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Validate pincode
  const validatePincode = (pin) => {
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const metroPincodes = ['110001', '400001', '600001', '560001', '700001', '500001', '750001', '160001'];
      return metroPincodes.includes(pin) ? 'metro' : 'normal';
    }
    return null;
  };

  const pincodeStatus = validatePincode(formData.pincode);

  // Calculate delivery date based on pincode
  const getDeliveryDays = () => {
    if (!formData.pincode) return 7;
    return pincodeStatus === 'metro' ? 3 : 7;
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + getDeliveryDays());
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getOrderDate = () => {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Place order from cart items (Flipkart style)
  const handleOrderFromCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      // Create orders for each cart item
      const orderIds = [];
      for (const item of cartItems) {
        const res = await API.post("/order/create", {
          userId,
          tileId: item._id,
          paymentMethod: formData.paymentMethod,
          address: address,
          pincode: formData.pincode,
          quantity: item.quantity || 1
        });
        
        if (res.data.order) {
          orderIds.push(res.data.order._id);
        }
      }

      // Clear cart after successful order
      setCartItems([]);
      localStorage.setItem("userCart", JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      // Store order details for display
      setOrderDetails({
        orderId: orderIds[0] || 'N/A',
        orderCount: orderIds.length,
        orderDate: new Date(),
        deliveryDate: getDeliveryDate(),
        totalAmount: calculateCartTotal()
      });

      setMessage("Order placed successfully!");
      setSuccess(true);
      setStep(3);
    } catch (error) {
      setMessage("Order Failed. Please try again.");
      setSuccess(false);
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setMessage("");
    setSuccess(false);
    setFormData({
      street: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cash"
    });
    setOrderDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-16">
      <div className="w-full p-8 flex items-start justify-center">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl shadow-lg shadow-yellow-400/30 mb-4">
              <FaShoppingCart className="text-4xl text-slate-900" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800">Place Order</h2>
            <p className="text-slate-500 mt-2">Complete your order with delivery details</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-slideIn">
            {[
              { num: 1, label: 'Cart' },
              { num: 2, label: 'Order' },
              { num: 3, label: 'Confirm' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s.num ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30 scale-110" : "bg-slate-200 text-slate-400"}`}>
                    {step > s.num ? <FaCheck className="text-xl" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${step >= s.num ? "text-yellow-600" : "text-slate-400"}`}>{s.label}</span>
                </div>
                {s.num < 3 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all duration-500 ${step > s.num ? "bg-yellow-400" : "bg-slate-200"}`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 animate-slideUp overflow-hidden">
            {step === 3 ? (
              // Order Confirmation Screen (Flipkart-style)
              <div className="p-8">
                {success && orderDetails ? (
                  <div className="text-center py-8">
                    {/* Success Animation */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                      <FaCheck className="text-5xl text-green-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h3>
                    <p className="text-slate-500 mb-8">Thank you for your order</p>

                    {/* Order Details Card */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto border border-yellow-100">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaTruck className="text-yellow-500" /> Order Details
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Order ID:</span>
                          <span className="font-mono text-slate-700">{orderDetails.orderId?.slice(-8).toUpperCase()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-2">
                            <FaCalendarAlt className="text-yellow-500" /> Order Date:
                          </span>
                          <span className="font-medium text-slate-700">{getOrderDate()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-2">
                            <FaTruck className="text-green-500" /> Expected Delivery:
                          </span>
                          <span className="font-medium text-green-600">{getDeliveryDate()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-2">
                            <FaClock className="text-blue-500" /> Delivery Time Slot:
                          </span>
                          <span className="font-medium text-blue-600 text-sm">
                            {pincodeStatus === 'metro' ? '9:00 AM - 12:00 PM' : '10:00 AM - 2:00 PM'}
                          </span>
                        </div>
                        
                        <div className="border-t border-yellow-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Total Amount:</span>
                            <span className="text-xl font-bold text-slate-800">₹{calculateCartTotal().toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left max-w-md mx-auto border border-slate-200">
                      <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <FaHome className="text-yellow-500" /> Delivery Address
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {formData.street}, {formData.city}, {formData.state} - {formData.pincode}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left max-w-md mx-auto border border-slate-200">
                      <h4 className="font-bold text-slate-700 mb-2">Payment Method</h4>
                      <p className="text-slate-600 flex items-center gap-2">
                        {formData.paymentMethod === 'cash' ? (
                          <> <FaMoneyBillWave className="text-green-500" /> Cash on Delivery</>
                        ) : (
                          <> <FaCreditCard className="text-blue-500" /> Online Payment</>
                        )}
                      </p>
                    </div>

                    <button 
                      onClick={resetForm}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-400/30 flex items-center gap-2 mx-auto"
                    >
                      <FaUndo /> Order More
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTruck className="text-5xl text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Order Failed</h3>
                    <p className="text-slate-500 mb-6">{message}</p>
                    <button 
                      onClick={resetForm}
                      className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Order Form
              <form onSubmit={handleOrderFromCart} className="p-8">
                {isLoading && step === 2 && (
                  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-700 font-medium">Processing your order...</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Product & Address */}
                  <div className="space-y-6">
                    {/* Product Card - Flipkart Style */}
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaShoppingCart className="text-yellow-500" /> Product Details
                      </h3>
                      
                      {/* If cart has items, show them directly */}
                      {cartItems.length > 0 ? (
                        <div className="space-y-3">
                          {cartItems.map((item, index) => (
                            <div key={index} className="bg-slate-50 rounded-xl p-3 flex gap-3 border border-slate-200">
                              <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <FaTruck className="text-xl text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">
                                  {item.category?.name || typeof item.category === 'object' ? item.category?.name : item.category}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="font-bold text-yellow-600 text-sm">₹{item.price?.toLocaleString('en-IN')}</p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(index, -1)}
                                      className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="w-6 text-center font-bold text-xs">{item.quantity || 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(index, 1)}
                                      className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(index)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Remove item"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <FaShoppingCart className="text-4xl mx-auto mb-3 text-slate-300" />
                          <p>Your cart is empty</p>
                          <p className="text-sm">Add items from wishlist to order</p>
                        </div>
                      )}
                    </div>

                    {/* Address Card - Flipkart Style */}
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-yellow-500" /> Delivery Address
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Street Address</label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="House No., Building Name, Street"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">State</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="State"
                              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit PIN code"
                            maxLength={6}
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                            required
                          />
                          {formData.pincode && (
                            <p className={`text-sm mt-1 flex items-center gap-1 ${pincodeStatus ? 'text-green-600' : 'text-red-500'}`}>
                              {pincodeStatus ? (
                                <>✓ {pincodeStatus === 'metro' ? 'Metro City - Express Delivery (3 days)' : 'Standard Delivery (5-7 days)'}</>
                              ) : (
                                <>✗ Invalid Pincode</>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Payment & Summary */}
                  <div className="space-y-6">
                    {/* Payment Method Card - Flipkart Style */}
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaCreditCard className="text-yellow-500" /> Payment Method
                      </h3>
                      
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === 'cash'}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-yellow-500"
                          />
                          <div className="ml-3 flex-1">
                            <span className="font-medium text-slate-800 flex items-center gap-2">
                              <FaMoneyBillWave className="text-green-500" /> Cash on Delivery
                            </span>
                            <p className="text-sm text-slate-500">Pay when you receive the product</p>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={formData.paymentMethod === 'online'}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-yellow-500"
                          />
                          <div className="ml-3 flex-1">
                            <span className="font-medium text-slate-800 flex items-center gap-2">
                              <FaCreditCard className="text-blue-500" /> Online Payment
                            </span>
                            <p className="text-sm text-slate-500">Pay now via UPI, Card, Net Banking</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Order Summary Card - Flipkart Style */}
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-slate-600">
                          <span>Order Date:</span>
                          <span className="font-medium">{getOrderDate()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="flex items-center gap-2">
                            <FaCalendarAlt className="text-green-500" /> Expected Delivery:
                          </span>
                          <span className="font-medium text-green-600">{getDeliveryDate()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="flex items-center gap-2">
                            <FaClock className="text-blue-500" /> Delivery Time:
                          </span>
                          <span className="font-medium text-sm">
                            {pincodeStatus === 'metro' ? '9:00 AM - 12:00 PM' : '10:00 AM - 2:00 PM'}
                          </span>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">Total Amount:</span>
                            <span className="text-2xl font-bold text-yellow-600">₹{calculateCartTotal().toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={cartItems.length === 0 || !formData.street || !formData.city || !formData.pincode || isLoading}
                      className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTruck /> Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

