import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = (await getServerSession(authOptions)) as any;
    config.headers["Authorization"] = `Bearer ${session.user.token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
