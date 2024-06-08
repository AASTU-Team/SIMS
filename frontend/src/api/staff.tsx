import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import { StaffFields } from "../type/staff";

const client = axios.create({
  baseURL: "http://localhost:3000/user",
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
    const token: string = await client
      .get("/refresh")
      .then((res) => res.data.token);
    return token;
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
    return Promise.resolve(newToken);
  } else {
    return Promise.reject();
  }
};

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