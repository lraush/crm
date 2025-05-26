import { configureStore } from "@reduxjs/toolkit";
import { callsApi } from "./slice/api.slice";

export const store = configureStore({
  reducer: {
    [callsApi.reducerPath]: callsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(callsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
