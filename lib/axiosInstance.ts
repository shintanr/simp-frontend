// lib/axiosInstance.ts (client only)
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("🚀 ~ error:", error);
    if (
      [401, 403].includes(error.response?.status) &&
      typeof window !== "undefined"
    ) {
      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
