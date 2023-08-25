import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosClient.interceptors.request.use(async (request) => {
  const session = (await getSession()) as any;
  if (session) {
    request.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return request;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(`error`, error);
  }
);

export default axiosClient;
