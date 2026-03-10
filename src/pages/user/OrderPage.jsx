import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { 
  FaShoppingCart, FaTruck, FaCheck, FaMapMarkerAlt, FaCreditCard, 
  FaMoneyBillWave, FaCalendarAlt, FaClock, FaUndo, FaHome, FaBolt, 
  FaExclamationTriangle, FaTrash, FaPlus, FaMinus, FaGift, FaShieldAlt,
  FaArrowRight, FaCheckCircle, FaShippingFast, FaBox
} from "react-icons/fa";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [animated, setAnimated] = useState(false);

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cash"
  });

  const [orderDetails, setOrderDetails] = useState(null);
  const [savedTotal, setSavedTotal] = useState(0);

  useEffect(() => {
    setAnimated(true);
    
    const timer = setTimeout(() => {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
      
      if (!storedUserId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const directOrderItem = localStorage.getItem("directOrderItem");
      
      if (directOrderItem) {
        try {
          const item = JSON.parse(directOrderItem);
          if (item && item._id) {
            setCartItems([item]);
            setOrderType('direct');
            localStorage.removeItem("directOrderItem");
          } else {
            loadCart();
          }
        } catch (e) {
          loadCart();
        }
      } else {
        loadCart();
      }
      
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  const loadCart = () => {
    const savedCart = localStorage.getItem("userCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.length > 0) {
          setCartItems(parsedCart);
          setOrderType('cart');
        }
      } catch (e) {
        setCartItems([]);
        setOrderType(null);
      }
    } else {
      setCartItems([]);
      setOrderType(null);
    }
  };

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

  const validatePincode = (pin) => {
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const metroPincodes = ['110001', '400001', '600001', '560001', '700001', '500001', '750001', '160001'];
      return metroPincodes.includes(pin) ? 'metro' : 'normal';
    }
    return null;
  };

  const pincodeStatus = validatePincode(formData.pincode);

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
    if (cartItems.length === 0 && savedTotal > 0) {
      return savedTotal;
    }
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleOrderFromCart = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      const totalAmount = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
      setSavedTotal(totalAmount);

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

      setCartItems([]);
      localStorage.setItem("userCart", JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      setOrderDetails({
        orderId: orderIds[0] || 'N/A',
        orderCount: orderIds.length,
        orderDate: new Date(),
        deliveryDate: getDeliveryDate(),
        totalAmount: totalAmount
      });

      setMessage("Order placed successfully!");
      setSuccess(true);
      setStep(3);
    } catch (error) {
      setMessage("Order Failed. Please try again.");
      setSuccess(false);
      setStep(3);
    } finally {
      setOrderLoading(false);
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
    setSavedTotal(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 py-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            {orderType === 'direct' ? 'Quick Order' : 'Place Your Order'}
          </h1>
          <p className={`text-yellow-50 text-lg transition-all duration-700 delay-100 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            {orderType === 'direct' ? 'Complete your quick purchase' : 'Complete your order with delivery details'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Steps */}
        <div className={`flex items-center justify-center gap-2 md:gap-4 mb-8 transition-all duration-500 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          {[
            { num: 1, label: 'Cart' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Confirm' }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s.num ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-400/30 scale-110" : "bg-gray-200 text-gray-400"}`}>
                  {step > s.num ? <FaCheck className="text-lg" /> : s.num}
                </div>
                <span className={`text-xs md:text-sm mt-1 font-medium ${step >= s.num ? "text-yellow-600" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {s.num < 3 && (
                <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 rounded-full transition-all duration-500 ${step > s.num ? "bg-yellow-400" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {step === 3 ? (
            <div className="p-6 md:p-8">
              {success && orderDetails ? (
                <div className="text-center py-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                    <FaCheckCircle className="text-5xl text-green-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h3>
                  <p className="text-gray-500 mb-6">Thank you for your order</p>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto border border-yellow-100">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaTruck className="text-yellow-500" /> Order Details
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order ID:</span>
                        <span className="font-mono font-bold text-gray-700">{orderDetails.orderId?.slice(-8).toUpperCase()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaCalendarAlt className="text-yellow-500" /> Order Date:
                        </span>
                        <span className="font-medium text-gray-700">{getOrderDate()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaShippingFast className="text-green-500" /> Expected Delivery:
                        </span>
                        <span className="font-medium text-green-600">{getDeliveryDate()}</span>
                      </div>
                      
                      <div className="border-t border-yellow-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Total Amount:</span>
                          <span className="text-2xl font-bold text-gray-800">₹{savedTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={resetForm}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2"
                    >
                      <FaBox /> Order More
                    </button>
                    <button 
                      onClick={() => navigate("/track")}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTruck /> Track Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <FaExclamationTriangle className="text-5xl text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">Order Failed</h3>
                  <p className="text-gray-500 mb-6">{message}</p>
                  <button 
                    onClick={resetForm}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleOrderFromCart} className="p-6 md:p-8">
              {orderLoading && step === 2 && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-scaleIn">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Processing your order...</p>
                    <p className="text-gray-400 text-sm">Please wait</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  {/* Product Card */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 transition-colors">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      {orderType === 'direct' ? <FaBolt className="text-green-500" /> : <FaShoppingCart className="text-yellow-500" />} 
                      {orderType === 'direct' ? 'Quick Buy Product' : 'Your Products'}
                    </h3>
                    
                    {cartItems.length > 0 ? (
                      <div className="space-y-3">
                        {cartItems.map((item, index) => (
                          <div key={index} className={`rounded-xl p-3 flex gap-3 ${orderType === 'direct' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              ) : (
                                <FaBox className="text-xl text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 text-sm truncate">{item.title}</h4>
                              <p className="text-xs text-gray-500 truncate">
                                {item.category?.name || typeof item.category === 'object' ? item.category?.name : item.category}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="font-bold text-yellow-600 text-sm">₹{item.price?.toLocaleString('en-IN')}</p>
                                {orderType === 'cart' ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(index, -1)}
                                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-xs"
                                    >
                                      <FaMinus size={8} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-xs">{item.quantity || 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(index, 1)}
                                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-xs"
                                    >
                                      <FaPlus size={8} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Qty: 1</span>
                                )}
                              </div>
                            </div>
                            {orderType === 'cart' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(index)}
                                className="text-red-400 hover:text-red-600 transition-colors self-start"
                                title="Remove item"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FaExclamationTriangle className="text-4xl mx-auto mb-2 text-yellow-500" />
                        <p className="text-gray-600 font-medium">Your cart is empty</p>
                        <button 
                          type="button"
                          onClick={() => navigate("/tiles")}
                          className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                        >
                          Browse Products
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Address Card */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 transition-colors">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-yellow-500" /> Delivery Address
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="House No., Building Name, Street"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="6-digit PIN code"
                          maxLength={6}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
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

                <div className="space-y-6">
                  {/* Payment Method Card */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 transition-colors">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaCreditCard className="text-yellow-500" /> Payment Method
                    </h3>
                    
                    <div className="space-y-3">
                      <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-yellow-500"
                        />
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-800 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-500" /> Cash on Delivery
                          </span>
                          <p className="text-sm text-gray-500">Pay when you receive</p>
                        </div>
                      </label>
                      
                      <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-yellow-500"
                        />
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-800 flex items-center gap-2">
                            <FaCreditCard className="text-blue-500" /> Online Payment
                          </span>
                          <p className="text-sm text-gray-500">Pay via UPI, Card, Net Banking</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary Card */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 hover:border-yellow-200 transition-colors">
                    <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Order Date:</span>
                        <span className="font-medium">{getOrderDate()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-500" /> Expected Delivery:
                        </span>
                        <span className="font-medium text-green-600">{getDeliveryDate()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-2">
                          <FaClock className="text-blue-500" /> Delivery Time:
                        </span>
                        <span className="font-medium text-sm">
                          {pincodeStatus === 'metro' ? '9:00 AM - 12:00 PM' : '10:00 AM - 2:00 PM'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-600">
                        <FaShieldAlt /> Safe & Secure Delivery
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Total Amount:</span>
                          <span className="text-2xl font-bold text-yellow-600">₹{calculateCartTotal().toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || !formData.street || !formData.city || !formData.pincode || orderLoading}
                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {orderLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaTruck /> {orderType === 'direct' ? 'Buy Now' : 'Place Order'}
                        <FaArrowRight />
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
  );
};

export default OrderPage;

