// File: redux/services/tugasPendahuluanApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TugasPendahuluanData {
  id_attempts: number;
  id_praktikum: number;
  id_pertemuan: number;
  id_user: number;
  total_score: number;
  completed_at: string;
  nama_praktikan: string;
  nim: string;
  email: string;
}

export interface TugasPendahuluanResponse {
  success: boolean;
  data: TugasPendahuluanData[];
  message?: string;
}

export const tugasPendahuluanApi = createApi({
  reducerPath: 'tugasPendahuluanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Tambahkan headers jika diperlukan
    prepareHeaders: (headers) => {
      // headers.set('authorization', `Bearer ${token}`)
      return headers;
    },
  }),
  tagTypes: ['TugasPendahuluan'],
  endpoints: (builder) => ({
    getTugasPendahuluanDetails: builder.query<TugasPendahuluanResponse, {
      idPraktikum: string;
      idPertemuan?: string;
    }>({
      query: ({ idPraktikum, idPertemuan }) => ({
        url: '/asprak/tugas-pendahuluan/details',
        params: {
          idPraktikum,
          ...(idPertemuan && { idPertemuan }),
        },
      }),
      providesTags: ['TugasPendahuluan'],
    }),
  }),
});

export const { useGetTugasPendahuluanDetailsQuery } = tugasPendahuluanApi;