import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../interface/types";

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api", credentials: "include" }),
  endpoints: (builder) => ({
    getFriendRequests: builder.query<User[], void>({
      query: () => "/users/friend-requests",
    }),
    acceptFriendRequest: builder.mutation<{ message: string }, string>({
      query: (requestId) => ({
        url: `/users/${requestId}/accept`,
        method: "POST",
      }),
    }),
    rejectFriendRequest: builder.mutation<{ message: string }, string>({
      query: (requestId) => ({
        url: `/users/${requestId}/reject`,
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useGetFriendRequestsQuery, 
  useAcceptFriendRequestMutation, 
  useRejectFriendRequestMutation 
} = friendsApi;
