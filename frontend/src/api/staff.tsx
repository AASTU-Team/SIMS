import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import { StaffFields } from "../type/staff";
import setCookie from "../hooks/setCookie";


const client = axios.create({
  baseURL: "http://localhost:3000/user",
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
export const getStaff = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("/staff/all");
};

export const registerStaff = async (data: StaffFields) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/register/staff", data);
};

export const exportStudent = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  const response = await client.get("/student/all/export");
  saveFile(response.data, "staff.csv");
};

const saveFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const deleteStaff = async (id: string, email: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.delete(`/staff/delete/?staff_id=${id}&email=${email}`);
};


export const getStaffDep = async (id:string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/staff/dept/${id}?inst=true`);
};