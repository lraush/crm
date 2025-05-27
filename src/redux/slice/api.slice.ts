import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type GetCallsParams = {
  date_start: string;
  date_end: string;
  limit?: number;
  offset?: number;
  in_out?: number;
  status?: "success" | "fail";
  sort_by?: "date" | "duration";
  order?: "ASC" | "DESC";
  search?: string;
};

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
    getCalls: builder.mutation<any, GetCallsParams>({
      query: (params) => {
        const query = new URLSearchParams();

        query.set("date_start", params.date_start);
        query.set("date_end", params.date_end);

        if (params.limit) query.set("limit", params.limit.toString());
        if (params.offset) query.set("offset", params.offset.toString());
        if (params.in_out !== undefined)
          query.set("in_out", params.in_out.toString());
        if (params.status) query.set("status", params.status);
        if (params.sort_by) query.set("sort_by", params.sort_by);
        if (params.order) query.set("order", params.order);
        if (params.search) query.set("search", params.search);

        return {
          url: `mango/getList?${query.toString()}`,
          method: "POST",
        };
      },
    }),
  }),
});

export const { useGetCallsMutation } = callsApi;

