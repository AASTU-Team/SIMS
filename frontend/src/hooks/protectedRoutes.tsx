import useLocalStorage from "./useLocalStorage";
import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useLocalStorage("isAuthenticated", false);
  if (!isAuthenticated) {
    return <Navigate to='/signin' replace />;
  }
  return children;
}