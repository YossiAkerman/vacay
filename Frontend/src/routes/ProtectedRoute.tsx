import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactElement; 
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
