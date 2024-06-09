import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import setCookie from "../hooks/setCookie";

const client = axios.create({
  baseURL: "http://localhost:2000/attendance",
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

export const createAttendanceRecord = async (
  course_id: string,
  instructor_id: string,
  date: string,
  attendance: { student_id: string; status: string }[]
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/new`, {
    course_id,
    instructor_id,
    date,
    attendance,
  });
};

export const getAttendance = async (
  course_id: string,
  instructor_id: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/instructor`, {
    course_id,
    instructor_id,
  });
};

export const updateAttendance = async (
  attendance_id: string,
  status: string,
  date: string,
  _id: string
) => {
  console.log(attendance_id, status, date, _id);
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.patch(`/attendance`, {
    attendance_id,
    attendances: { status, date, _id },
  });
};

export const getStudentAttendance = async (
  course_id: string,
  student_id: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post(`/student`, {
    course_id,
    student_id,
  });
};
