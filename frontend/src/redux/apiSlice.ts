import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl:  "http://localhost:5000/api", credentials: 'include' }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ message: string }, { username: string; email: string; password: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getUser: builder.query<{ id: string; username: string; email: string; karma: number }, void>({
      query: () => '/auth/me',
    }),
    updateUser: builder.mutation<{ message: string }, { username: string; email: string }>({
      query: (userData) => ({
        url: '/auth/update',
        method: 'PUT',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetUserQuery, useUpdateUserMutation } = apiSlice;
