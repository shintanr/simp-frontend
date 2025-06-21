import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const penilaianApi = createApi({
  reducerPath: "penilaianApi",
  tagTypes: ["penilaian"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPenilaianPraktikum: builder.query({
      query: ({
        id_user,
        id_praktikum,
        id_modul,
        id_shift,
        order_by = "id_modul",
        sort = "asc",
      }) => ({
        url: "/api/penilaian",
        method: "GET",
        params: { id_user, id_praktikum, id_modul, id_shift, order_by, sort },
      }),
      providesTags: ["penilaian"],
    }),
    createPenilaianPraktikum: builder.mutation({
      query: (data) => ({
        url: "/api/penilaian",
        method: "POST",
        data,
      }),
      invalidatesTags: ["penilaian"],
    })
  }),
});

export const { useGetPenilaianPraktikumQuery, useCreatePenilaianPraktikumMutation } = penilaianApi;
