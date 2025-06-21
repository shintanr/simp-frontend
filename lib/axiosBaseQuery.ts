import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    // console.log("🚀 ~ params:", params)
    // console.log("🚀 ~ data:", data)
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      console.log("🚀 ~ axiosError:", axiosError)
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
