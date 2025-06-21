import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const praktikumApi = createApi({
  reducerPath: "praktikumApi",
  tagTypes: ["praktikum"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPraktikum: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        orderBy = "id_praktikum",
        sortDirection = "DESC",
      }) => ({
        url: "/api/praktikum",
        method: "GET",
        params: { page, limit, search, orderBy, sortDirection },
      }),
      providesTags: ["praktikum"],
    }),
    detailPraktikum: builder.query({
      query: (id) => ({
        url: `/api/praktikum/${id}`,
        method: "GET",
      }),
      providesTags: ["praktikum"],
    }),
    createPraktikum: builder.mutation({
      query: (data) => ({
        url: "/api/praktikum",
        method: "POST",
        data,
      }),
      invalidatesTags: ["praktikum"],
    }),
    updatePraktikum: builder.mutation({
      query: (data) => ({
        url: `/api/praktikum/${data.id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["praktikum"],
    }),
    deletePraktikum: builder.mutation({
      query: (id) => ({
        url: `/api/praktikum/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["praktikum"],
    })
  }),
});

export const { useGetPraktikumQuery, useDetailPraktikumQuery, useCreatePraktikumMutation, useUpdatePraktikumMutation, useDeletePraktikumMutation } = praktikumApi;
