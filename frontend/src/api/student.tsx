import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import { StudentDeleteFields, StudentFields } from "../type/student";
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
    const res = await authClient.post("/refresh")
    const new_token = res.data.accessToken;
    // console.log(new_token)
    return new_token;
  } catch (error) {
    return null;
  }
};

export const refreshAuth = async (failedRequest:{response:AxiosResponse} ) => {
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
  }}
);
export const getStudent = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("/student/all");
}

export const registerStudent = async (data: StudentFields) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/register/student", data);
}

export const aboutMe = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/me");
}

export const updateStudent = async (data: StudentFields) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  const id = data._id;
  return await client.patch(`/student/update?id=${id}`, data);
}

export const deleteStudent = async (data:StudentDeleteFields) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.delete(`/student/delete/`,{data});
}

export const registerStudentCsv = async (data: FormData) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/register/studentCsv", data);
}

export const downloadTemplate = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  const response = await client.get("/template", { responseType: "blob" });
  const filename = getFilenameFromUrl("/template.csv"); 
  saveFile(response.data, filename);
};

const getFilenameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
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