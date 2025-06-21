import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const presensiApi = createApi({
  reducerPath: "presensiApi",
  tagTypes: ["presensi"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPresensiPraktikum: builder.query({
      query: ({
        id_user,
        id_praktikum,
        id_modul,
        id_shift,
        order_by = "id_modul",
        sort = "asc",
      }) => ({
        url: "/api/presensi",
        method: "GET",
        params: { id_user, id_praktikum, id_modul, id_shift, order_by, sort },
      }),
      providesTags: ["presensi"],
    }),
    getSummaryPresensiPraktikum: builder.query({
      query: ({
        id_user,
        id_praktikum,
        id_modul,
        id_shift
      }) => ({
        url: "/api/presensi-summary",
        method: "GET",
        params: { id_user, id_praktikum, id_modul, id_shift },
      }),
      providesTags: ["presensi"],
    }),
    createPresensiPraktikum: builder.mutation({
      query: (data) => ({
        url: "/api/presensi",
        method: "POST",
        data,
      }),
      invalidatesTags: ["presensi"],
    })
  }),
});

export const { useGetPresensiPraktikumQuery, useGetSummaryPresensiPraktikumQuery, useCreatePresensiPraktikumMutation } = presensiApi;
