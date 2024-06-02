import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "../hooks/protectedRoutes";
import SignIn from "../pages/login/index";
import NotFoundPage from "../pages/NotFound";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/profile/index";
import SetPassword from "../pages/SetPassword";
import Loader from "../components/Loader";
import StudentManagement from "../pages/StudentManagement";
import StaffManagement from "../pages/StaffManagement";
import RoomManagement from "../pages/RoomManagement";
import Calendar from "../pages/Calendar";
import AddStudent from "../pages/StudentManagement/AddStudent";
import EditStudent from "../pages/StudentManagement/EditStudent";
import AddStaff from "../pages/StaffManagement/AddStaff";
import EdditStaff from "../pages/StaffManagement/EditStaff";
import CourseManagement from "../pages/CourseManagment";
import AddCourse from "../pages/CourseManagment/AddCourse";
import EditCourse from "../pages/CourseManagment/EditCourse";
import CurriculumManagement from "../pages/CurriculumManagment";
import AddCurriculum from "../pages/CurriculumManagment/AddCurriculum";
import EditCurriculum from "../pages/CurriculumManagment/EditCurriculum";
import AddRooms from "../pages/RoomManagement/AddRoom";
import EditRoom from "../pages/RoomManagement/EditRoom";
import DepartmentManagement from "../pages/DepartmentManagement";
import AddDepartment from "../pages/DepartmentManagement/AddDepartment";
import EditDepartment from "../pages/DepartmentManagement/EditDepartment";
import StudentRegistration from "../pages/StudentRegistration";
import StudentCourses from "../pages/StudentCourses";
const AllRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/setpass/:id" element={<SetPassword />} />
        <Route path="/loading" element={<Loader />} />

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
                    <Route path="/students" element={<StudentManagement />} />
                    <Route path="/students/add" element={<AddStudent/>} />
                    <Route path="/students/edit/" element={<EditStudent />} />
                    <Route path="/staff" element={<StaffManagement />} />
                    <Route path="/staff/add" element={<AddStaff/>} />
                    <Route path="/staff/edit" element={<EdditStaff />} />
                    <Route path="/course" element={<CourseManagement />} />
                    <Route path="/courses/add" element={<AddCourse />} />
                    <Route path="/courses/edit" element={<EditCourse />} />
                    <Route path="/curriculum" element={<CurriculumManagement />} />
                    <Route path="/curriculum/add" element={<AddCurriculum />} />
                    <Route path="/curriculum/edit" element={<EditCurriculum />} />
                    <Route path="/department" element={<DepartmentManagement />} />
                    <Route path="/department/add" element={<AddDepartment/>} />
                    <Route path="/department/edit" element={<EditDepartment />} />
                    <Route path="/room" element={<RoomManagement />} />
                    <Route path="/room/add" element={<AddRooms />} />
                    <Route path="/rooms/edit" element={<EditRoom />} />
                    <Route path="/myRegistration" element={<StudentRegistration/>}/>
                    <Route path="/myCourses" element={<StudentCourses/>}/>
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/profile" element={<Profile />} />
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
