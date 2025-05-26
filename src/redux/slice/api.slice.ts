// src/services/callsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callsApi = createApi({
  reducerPath: "callsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.skilla.ru/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", "Bearer testtoken");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCalls: builder.mutation<
      any,
      { date_start: string; date_end: string; limit: number }
    >({
      query: (body) => ({
        url: "mango/getList",
        method: "POST",
        body,
      }),
    }),
    getAudioRecord: builder.mutation<Blob, { record: string; partnership_id: string }>({
        query: ({ record, partnership_id }) => ({
          url: "mango/getRecord",
          method: "POST",
          body: { record, partnership_id }, 
        }),
      }),
    // getAudioRecord: builder.mutation<
    //   Blob,
    //   { record: string; partnership_id: string }
    // >({
    //   query: ({ record, partnership_id }) => ({
    //     url: `mango/getRecord?record=${record}&partnership_id=${partnership_id}`,
    //     method: "POST",
    //     body: { record, partnership_id },
    //   }),

    }),
  })
// });

export const { useGetCallsMutation, useGetAudioRecordMutation } = callsApi;
