import { Navigate } from "react-router-dom";
import React from "react";
import getCookie from "./getCookie";
import { useQuery } from "@tanstack/react-query";
import { aboutMe } from "../api/student";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const access_token = getCookie("access_token");
  const query = useQuery({
    queryKey: ["me"],
    queryFn: aboutMe,
  });
  console.log(query.data)
  // if (query?.student){

  // }
  if (!access_token) {
    return <Navigate to='/signin' replace />;
  }
  return children;
}