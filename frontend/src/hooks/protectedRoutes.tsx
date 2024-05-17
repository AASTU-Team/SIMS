import { Navigate } from "react-router-dom";
import React from "react";
import getCookie from "./getCookie";
import { useQuery } from "@tanstack/react-query";
import { aboutMe } from "../api/student";
import Loader from "../components/Loader";
import { setUser } from "../state/users/usersSlice";
import { useDispatch } from "react-redux";

interface UserState {
    name: string,
    email: string,
    role: string,
    roles:string[],
    id: string
}

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: aboutMe,
  });
  
  if (!access_token) {
    return <Navigate to='/signin' replace />;
  }
  
  if(query.isLoading){
    return <Loader/>
  }

  if(query.isSuccess){

  const user = query.data?.data
 
  const state:UserState ={
    name:user?.user?.name,
    email: user?.user?.email,
    role: user?.role?.includes("student")? "Student" : "Staff",
    roles: user?.role,
    id: user?.user?.id
  }
  
  dispatch(setUser(state))

}

  return children;
}