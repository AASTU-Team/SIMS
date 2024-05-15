import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import { CurriculumFields } from "../type/curriculum";

const client = axios.create({
  baseURL: "http://localhost:3000/curriculum",
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

export const getCurriculum = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("/");
}

export const addCurriculum = async (data: CurriculumFields) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/create", data);
}
