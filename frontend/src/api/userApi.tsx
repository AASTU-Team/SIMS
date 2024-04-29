import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LoginForm } from "../type/user";
import getCookie from "../hooks/getCookie";
import removeCookie from "../hooks/removeCookie";

const client = axios.create({
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
    const token: string = await client
      .get("/refresh")
      .then((res) => res.data.token);
    return token;
  } catch (error) {
    return null;
  }
};

export const refreshAuth = async (failedRequest:{response:AxiosResponse} ) => {
  const newToken = await fetchNewToken();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    setHeaderToken(newToken);
    return Promise.resolve(newToken);
  } else {
    return Promise.reject();
  }
};

export const Login = async ({email,password}: LoginForm) =>{
  return await client.post('/login',{email,password})
}

export const Logout = async () => {
  const refresh_token = getCookie("refresh_token") || ""
  setHeaderToken(refresh_token)
  const res = await client.post('/logout')
  removeHeaderToken()
  removeCookie("access_token")
  removeCookie("refresh_token")
  return res
}

export const useMe = () =>
  useQuery<AxiosResponse, AxiosError>({
    queryKey: ["me"],
    queryFn: () => client.get(`/me`).then((res:AxiosResponse) => res.data),
  });