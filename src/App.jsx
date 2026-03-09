import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import UserNavbar from "./components/UserNavbar/UserNavbar";
import UserLayout from "./components/UserLayout";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import LatestProduct from "./components/LatestProduct/LatestProduct";
import Banner from "./components/Banner/Banner";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

//User Side Pages
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Dashboard from "./pages/user/Dashboard";
import ViewCategory from "./pages/user/ViewCategory";
import ViewTile from "./pages/user/ViewTile";
import Feedback from "./pages/user/Feedback";
import OrderPage from "./pages/user/OrderPage";
import TrackOrder from "./pages/user/TrackOrder";
import UserProfile from "./pages/user/UserProfile";
import AboutUs from "./pages/user/AboutUs";
import Contact from "./pages/user/Contact";
import OrderHistory from "./pages/user/OrderHistory";
import Wishlist from "./pages/user/Wishlist";


//Admin Side Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageTile from "./pages/admin/ManageTile";
import ManageOrders from "./pages/admin/ManageOrders";
import ViewFeedback from "./pages/admin/ViewFeedback";
import AdminSettings from "./pages/admin/AdminSettings";

//User Route Protected
import UserProtectedRoute from "./components/UserProtectedRoute";

//Admin Route Protected
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Routes>

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Products />
                <LatestProduct />
                <Banner />
                <Testimonials />
                <Footer />
              </>
            }
          />

          {/* Register Page (No Navbar, No Footer)  USER ROUTES */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Public Pages with Main Navbar */}
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <AboutUs />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />
          
          {/* User Pages with Navbar */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} /> 
            <Route path="/category" element={<ViewCategory />} />
            <Route path="/tiles" element={<UserProtectedRoute><ViewTile /></UserProtectedRoute>} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/myorders" element={<UserProtectedRoute><OrderHistory /></UserProtectedRoute>} />
            <Route path="/wishlist" element={<UserProtectedRoute><Wishlist /></UserProtectedRoute>} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<UserProtectedRoute><UserProfile /></UserProtectedRoute>} />
          </Route>

          {/* Admin login page ADMIN ROUTES*/}
          <Route path="/admin" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

          <Route path="/admin/category" element={<AdminProtectedRoute>< ManageCategory /></AdminProtectedRoute>} />

          <Route path="/admin/tile" element={<AdminProtectedRoute>< ManageTile /></AdminProtectedRoute>} />

          <Route path="/admin/orders" element={<AdminProtectedRoute>< ManageOrders /></AdminProtectedRoute>} />

          <Route path="/admin/feedback" element={<AdminProtectedRoute><ViewFeedback /></AdminProtectedRoute>} />

          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

          {/* Redirect old profile route to settings */}
          <Route path="/admin/profile" element={<Navigate to="/admin/settings" />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
