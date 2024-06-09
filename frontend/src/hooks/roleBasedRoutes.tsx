
import React from "react";
import {  useSelector } from "react-redux";
import { RootState } from "../state/store";
import NotFoundPage from "../pages/NotFound";



export default function RoleRoutes({role, children }: { role:string,children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  // console.log(user.roles,role)
  if (user.roles && user.roles.includes(role)) {
    return children
  }
  else{
    return <NotFoundPage/>}
  
}