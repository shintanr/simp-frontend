import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  tagTypes: ["complaint"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (data) => ({
        url: "/api/complaints",
        method: "POST",
        data,
      }),
      invalidatesTags: ["complaint"],
    }),
    updateStatusComplaint: builder.mutation({
      query: (data) => ({
        url: `/api/complaints/update-status/${data.id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["complaint"],
    })
  }),
})

export const { useCreateComplaintMutation, useUpdateStatusComplaintMutation } = complaintApi