import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../interface/types";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api", credentials: "include" }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<{ message: string }, { username: string; email: string; password: string }>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => "/auth/me",
    }),
    updateUser: builder.mutation<{ message: string }, { 
      username?: string; 
      email?: string;
      selectedTopics?: string[]; 
      subscriptions?: string[];
    }>({
      query: (userData) => ({
        url: "/auth/update",
        method: "PUT",
        body: userData,
      }),
    }),
    getAdminStats: builder.query<{ stats: { totalUsers: number; totalPosts: number; totalComments: number; totalCommunities: number } }, void>({
      query: () => "/auth/admin",
    }),
    selectTopics: builder.mutation<{ message: string }, { topics: string[] }>({
      query: (data) => ({
        url: "/users/select-topics",
        method: "PUT",
        body: data,
      }),
    }),
    savePost: builder.mutation<{ message: string; savedPosts: string[] }, string>({
      query: (postId) => ({
        url: `/users/save/${postId}`,
        method: "POST",
      }),
    }),
    sendFriendRequest: builder.mutation<{ message: string }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/friend-request/${userId}`,
        method: "POST",
      }),
    }),

    
    acceptFriendRequest: builder.mutation<{ message: string }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/friend-accept/${userId}`,
        method: "POST",
      }),
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
    }),
    getUsers: builder.query<User, void>({
      query: () => "/",
   
  }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation, 
  useGetUserQuery, 
  useUpdateUserMutation, 
  useGetAdminStatsQuery,
  useSelectTopicsMutation,
  useSavePostMutation,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useGetUserByIdQuery,
  useGetUsersQuery
} = apiSlice;
