import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["User"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        orderBy = "created_at",
        sortDirection = "DESC",
      }) => ({
        url: "/api/users",
        method: "GET",
        params: { page, limit, search, orderBy, sortDirection },
      }),
      providesTags: ["User"],
    }),
    detailUser: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/api/users",
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/api/users/${data.id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useDetailUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
