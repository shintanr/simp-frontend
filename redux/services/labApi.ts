import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const labApi = createApi({
  reducerPath: "labApi",
  tagTypes: ["Lab"],
  refetchOnFocus: true,
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getLabs: builder.query({
      query: () => ({
        url: "/api/lab",
        method: "GET",
      }),
      providesTags: ["Lab"],
    }),
  }),
});

export const { useGetLabsQuery} = labApi;
