import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { usersApi } from "./services/userApi";
import { praktikumApi } from "./services/praktikumApi";
import { labApi } from "./services/labApi";
import { userPraktikumApi } from "./services/userPraktikum";
import { presensiApi } from "./services/presensiApi";
import { penilaianApi } from "./services/penilaian";
import { complaintApi } from "./services/complaintApi";
import { AuthApi } from "./services/authApi";
import { tugasPendahuluanApi } from "./services/tugasPendahuluanApi";


export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [praktikumApi.reducerPath]: praktikumApi.reducer,
    [labApi.reducerPath]: labApi.reducer,
    [userPraktikumApi.reducerPath]: userPraktikumApi.reducer,
    [presensiApi.reducerPath]: presensiApi.reducer,
    [penilaianApi.reducerPath]: penilaianApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
    [tugasPendahuluanApi.reducerPath]: tugasPendahuluanApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApi.middleware,
      usersApi.middleware,
      praktikumApi.middleware,
      labApi.middleware,
      userPraktikumApi.middleware,
      presensiApi.middleware,
      penilaianApi.middleware,
      complaintApi.middleware,
      tugasPendahuluanApi.middleware,
    ),
});

setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
