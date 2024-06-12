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
import DepartmentStudentRegistration from "../pages/DepartmentStudentRegistration";
import AddDropRequests from "../pages/DepartmentStudentRegistration/AddDropRequests";
import RegistrarRegistration from "../pages/RegistrarRegistration";
import RegistrarAddDropRequests from "../pages/RegistrarRegistration/AddDropRequests";
import StudentGrades from "../pages/StudentGrades";
import SemesterManagement from "../pages/SemesterManagment";
import BatchCourses from "../pages/SemesterManagment/BatchCourses";
import AttendanceManagement from "../pages/AttendanceManagement";
import StudentGradeReport from "../pages/StudentGradeReport";
import DepartmentGradeApproval from "../pages/DepartmentGradeApproval";
import DeanGradeApproval from "../pages/DeanGradeApproval";
import RoleRoutes from "../hooks/roleBasedRoutes";
import ForgetPassword from "../pages/ForgetPassoword";
const AllRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot_pass" element={<ForgetPassword />} />
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

                    {/* Student Management Routes */}
                    <Route
                      path="/students/*"
                      element={
                        <RoleRoutes role="studentMan">
                          <Routes>
                            <Route index element={<StudentManagement />} />
                            <Route path="/add" element={<AddStudent />} />
                            <Route path="/edit/" element={<EditStudent />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Staff Management Routes */}
                    <Route
                      path="/staff/*"
                      element={
                        <RoleRoutes role="staffMan">
                          <Routes>
                            <Route index element={<StaffManagement />} />
                            <Route path="/add" element={<AddStaff />} />
                            <Route path="/edit" element={<EdditStaff />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Course Management Routes */}
                    <Route
                      path="/course/*"
                      element={
                        <RoleRoutes role="courseMan">
                          <Routes>
                            <Route index element={<CourseManagement />} />
                            <Route path="/add" element={<AddCourse />} />
                            <Route path="/edit" element={<EditCourse />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Curriculum Management Routes */}
                    <Route
                      path="/curriculum/*"
                      element={
                        <RoleRoutes role="curriculumMan">
                          <Routes>
                            <Route index element={<CurriculumManagement />} />
                            <Route path="/add" element={<AddCurriculum />} />
                            <Route path="/edit" element={<EditCurriculum />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Department Management Routes */}
                    <Route
                      path="/department/*"
                      element={
                        <RoleRoutes role="departmentMan">
                          <Routes>
                            <Route index element={<DepartmentManagement />} />
                            <Route path="/add" element={<AddDepartment />} />
                            <Route path="/edit" element={<EditDepartment />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Room Management Routes */}
                    <Route
                      path="/room/*"
                      element={
                        <RoleRoutes role="roomMan">
                          <Routes>
                            <Route index element={<RoomManagement />} />
                            <Route path="/add" element={<AddRooms />} />
                            <Route path="/edit" element={<EditRoom />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Semester Management Routes */}
                    <Route
                      path="/semester/*"
                      element={
                        <RoleRoutes role="semesterMan">
                          <Routes>
                            <Route index element={<SemesterManagement />} />
                            <Route path="/batches" element={<BatchCourses />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Student Grading Management Routes */}
                    <Route
                      path="/studentGrades/*"
                      element={
                        <RoleRoutes role="studentGrade">
                          <Routes>
                            <Route index element={<StudentGrades />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Student Department Registration Management Routes */}
                    <Route
                      path="/studentDepReg/*"
                      element={
                        <RoleRoutes role="studentDepReg">
                          <Routes>
                            <Route
                              index
                              element={<DepartmentStudentRegistration />}
                            />
                            <Route
                              path="/viewRequest"
                              element={<AddDropRequests />}
                            />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Registrar Registration Management Routes */}
                    <Route
                      path="/studentReg/*"
                      element={
                        <RoleRoutes role="studentReg">
                          <Routes>
                            <Route index element={<RegistrarRegistration />} />
                            <Route
                              path="/viewRequest"
                              element={<RegistrarAddDropRequests />}
                            />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Attendance Management Routes */}
                    <Route
                      path="/attendance/*"
                      element={
                        <RoleRoutes role="attendance">
                          <Routes>
                            <Route index element={<AttendanceManagement />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Department Grade Approval Routes */}

                    <Route
                      path="/depGrade/*"
                      element={
                        <RoleRoutes role="depGradeManagement">
                          <Routes>
                            <Route
                              index
                              element={<DepartmentGradeApproval />}
                            />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Dean Grade Approval Routes */}
                    <Route
                      path="/deanGrade/*"
                      element={
                        <RoleRoutes role="deanGradeManagement">
                          <Routes>
                            <Route index element={<DeanGradeApproval />} />
                          </Routes>
                        </RoleRoutes>
                      }
                    />

                    {/* Student Routes */}

                    <Route
                      path="/myRegistration"
                      element={
                        <RoleRoutes role="student">
                          <StudentRegistration />
                        </RoleRoutes>
                      }
                    />
                    <Route
                      path="/myCourses"
                      element={
                        <RoleRoutes role="student">
                          <StudentCourses />
                        </RoleRoutes>
                      }
                    />
                    <Route
                      path="/myGrades"
                      element={
                        <RoleRoutes role="student">
                          <StudentGradeReport />
                        </RoleRoutes>
                      }
                    />

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
