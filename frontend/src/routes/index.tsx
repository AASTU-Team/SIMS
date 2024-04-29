import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "../hooks/protectedRoutes";
import SignIn from "../pages/Login";
import NotFoundPage from "../pages/NotFound";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import RegisterUser from "../pages/RegisterUser";
import Profile from "../pages/Profile";
import SetPassword from "../pages/SetPassword";
const AllRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/setpass" element={<SetPassword />} />

        <Route
          path="/*"
          element={
            <ProtectedRoutes>
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/registration" element={<RegisterUser />} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AllRoutes;