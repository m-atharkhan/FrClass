import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center text-5xl mt-[40vh] text-blue-600">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;