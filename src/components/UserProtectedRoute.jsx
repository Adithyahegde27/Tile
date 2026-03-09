import React from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("mytoken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default UserProtectedRoute;