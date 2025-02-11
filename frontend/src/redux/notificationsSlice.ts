import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api", credentials: "include" }),
  endpoints: (builder) => ({
    getNotifications: builder.query<{ friendRequests: number; unreadMessages: number }, void>({
      query: () => "/users/notifications",
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
