import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LoginForm } from "../type/user";

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

export const Login = async ({email,password}: LoginForm) =>{
  return await client.post('/login',{email,password})
}

export const useMe = () =>
  useQuery<AxiosResponse, AxiosError>({
    queryKey: ["me"],
    queryFn: () => client.get(`/me`).then((res:AxiosResponse) => res.data),
  });