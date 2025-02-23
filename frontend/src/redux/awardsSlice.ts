import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const awardsApi = createApi({
  reducerPath: "awardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/awards",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAwards: builder.query({
      query: () => "/",
    }),
    sendAward: builder.mutation({
      query: ({ awardId, commentId }) => ({
        url: "/send",
        method: "POST",
        body: { awardId, commentId },
      }),
    }),
  }),
});

export const { useGetAwardsQuery, useSendAwardMutation } = awardsApi;
