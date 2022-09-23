import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }
  return <>{children}</>;
};

export default ProtectedRoute;
