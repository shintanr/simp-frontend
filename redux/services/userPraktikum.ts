import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userPraktikumApi = createApi({
  reducerPath: "userPraktikumApi",
  tagTypes: ["userPraktikum"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUserPraktikum: builder.query({
      query: ({lab_id = "1"}: {lab_id?: string}) => ({
        url: "/api/user-praktikum",
        method: "GET",
        params: { lab_id },
      }),
      providesTags: ["userPraktikum"],
    }),
    detailuserPraktikum: builder.query({
      query: (id) => ({
        url: `/api/user-praktikum/${id}`,
        method: "GET",
      }),
      providesTags: ["userPraktikum"],
    }),
    createuserPraktikum: builder.mutation({
      query: (data) => ({
        url: "/api/user-praktikum",
        method: "POST",
        data,
      }),
      invalidatesTags: ["userPraktikum"],
    }),
    inquiryPraktikum: builder.mutation({
      query: (data) => ({
        url: "/api/user-praktikum/inquiry",
        method: "POST",
        data,
      }),
      invalidatesTags: ["userPraktikum"],
    })
  }),
});

export const { useGetUserPraktikumQuery, useInquiryPraktikumMutation, useCreateuserPraktikumMutation, useDetailuserPraktikumQuery } = userPraktikumApi;
