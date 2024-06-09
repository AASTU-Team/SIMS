import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import setCookie from "../hooks/setCookie";
import { SemesterDetails } from "../type/registration";

const client = axios.create({
  baseURL: "http://localhost:3000/",
});

const authClient = axios.create({
  baseURL: "http://localhost:5000/auth",
});

export const setHeaderToken = (token: string) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  //client.defaults.headers.common.Authorization = null;
  delete client.defaults.headers.common.Authorization;
};

export const fetchNewToken = async () => {
  try {
    const token = getCookie("refresh_token") || "";
    authClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await authClient.post("/refresh");
    const new_token = res.data.accessToken;
    // console.log(new_token)
    return new_token;
  } catch (error) {
    return null;
  }
};

export const refreshAuth = async (failedRequest: {
  response: AxiosResponse;
}) => {
  const newToken = await fetchNewToken();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    setHeaderToken(newToken);
    setCookie("access_token", newToken, 30);
    return Promise.resolve(newToken);
  } else {
    return Promise.reject();
  }
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAuth(error);
        return client(originalRequest);
      } catch (error) {
        removeHeaderToken();
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }

      return Promise.reject(error);
    }
  }
);
export const getSemester = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("Semester/");
};

export const addSemester = async (data: SemesterDetails) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("Semester/create", data);
};

export const activateSemester = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("Semester/activate", {id:id});
};

export const deactivateSemester = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch("Semester/deactivate", {id:id});
};

export const activateRegistration = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("RegistrationStatus/activate", { id: id });
};


export const deactivateRegistration = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch("RegistrationStatus/deactivate", { id: id });
};

export const activateAddDrop = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("AddStatus/activate", { id: id });
};

export const deactivateAddDrop = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch("AddStatus/deactivate", { id: id });
};

export const updateSemester = async (data: SemesterDetails,id:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch(`Semester/${id}`,data);
};

export const deleteSemester = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.delete(`Semester/${id}`);
};

export const getBatchCourses = async (staff_id:string,year:number,semester:number,type:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`curriculum/spec?id=${staff_id}&year=${year}&semester=${semester}&type=${type}`);
};

export const getRegistrationDepartment = async (id:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/department/getStudentStatus/${id}`);
};

export const confirmRegistrationDepartment = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/confirmStudentStatus/`, {
    data: [id],
    isAll: false,
  });
};

export const rejectRegistrationDepartment = async (id: string,reason:string,department:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/rejectStudentStatus/`, {
    data: [{id:id,reason:reason}],
    isAll: false,
    department:department
  });
};

export const confirmAllRegistrationDepartment = async (department:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/confirmStudentStatus/`, {
    isAll: true,
    department:department
  });
};

export const getRegistrationRegistrar = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/registrar/getStudentStatus/`);
};

export const confirmRegistrationRegistrar = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/confirmStudentStatus/`, {
    data: [id],
    isAll: false,
  });
};

export const rejectRegistrationRegistrar = async (
  id: string,
  reason: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/rejectStudentStatus/`, {
    data: [{ id: id, reason: reason }] });
};

export const confirmAllRegistrationRegistrar = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/confirmStudentStatus/`, {
    isAll: true,
  });
};

export const getDepartmentWithdrawal = async (department:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/department/withdrawalRequests/${department}`);
};

export const getDepartmentReadmission = async (department: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/department/enrollmentRequests/${department}`);
};

export const getRegistrarWithdrawal = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/registrar/withdrawalRequests/`);
};

export const getRegistrarReadmission = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/user/registrar/enrollmentRequests/`);
};

export const acceptWithdrawalRequestsDep = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/AcceptwithdrawalRequests`, {
    data: [id],
  });
};

export const acceptReadmissionRequestsDep = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/AcceptenrollmentRequests`, {
    data: [id],
  });
};

export const acceptWithdrawalRequestsReg = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/AcceptwithdrawalRequests`, {
    data: [id],
  });
};

export const acceptReadmissionRequestsReg = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/AcceptenrollmentRequests`, {
    data: [id],
  });
};

export const rejectWithdrawalRequestsDep = async (id: string, reason:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/RejectwithdrawalRequests`, {
    data: [{id,reason}]
  });
};

export const rejectReadmissionRequestsDep = async (id: string,reason:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/department/RejectEnrollmentRequests`, {
    data: [{ id, reason }],
  });
};

export const rejectWithdrawalRequestsReg = async (id: string,reason:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/AcceptwithdrawalRequests`, {
    data: [{ id, reason }],
  });
};

export const rejectReadmissionRequestsReg = async (id: string,reason:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/user/registrar/RejectenrollmentRequests`, {
    data: [{ id, reason }],
  });
};



export const getCourseSections = async (id: string,year:number,semester:number) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/assignment/course?id=${id}&year=${year}&semester=${semester}`);
};

export const getAddDropRequest = async (type:string,department:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(
    `user/student/addDrop?skip=0&limit=10&status=${type}&department=${department}`
  );
};

export const getAddDropRequestReg = async (type: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(
    `user/student/addDrop?skip=0&limit=10&registrarStatus=${type}`
  );
};

export const assignInstructor = async (assignment_id:string,instructor_id:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch(`assignment/${assignment_id}`, {instructor_id:instructor_id});
};

export const createSection = async (
  course_id: string,
  name: string,
  year: number,
  semester: number,
  type: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("section/create", {
    data: {
      name,
      year,
      semester,
      type
    },
    courseData:{
      course_id
    }
  });
};


export const getCoursesInstructor = async (id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/assignment/instructor/${id}`);
};

export const getSectionStudent = async (id: string, course_id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/assignment/teacher/`, { id, course_id });
};
