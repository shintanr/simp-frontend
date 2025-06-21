import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const AuthApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["auth"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["auth"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/api/auth/update-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["auth"],
    })
  }),
})

export const { useForgotPasswordMutation, useUpdatePasswordMutation } = AuthApi