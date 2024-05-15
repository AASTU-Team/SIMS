import { Navigate } from "react-router-dom";
import React from "react";
import getCookie from "./getCookie";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const access_token = getCookie("access_token");
  if (!access_token) {
    return <Navigate to='/signin' replace />;
  }
  return children;
}