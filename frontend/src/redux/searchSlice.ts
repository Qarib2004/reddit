import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/search/",credentials:"include" }),
  endpoints: (builder) => ({
    searchPosts: builder.query({
      query: (query) => `posts?q=${query}`,
    }),
    searchCommunities: builder.query({
      query: (query) => `communities?q=${query}`,
    }),
    searchComments: builder.query({
      query: (query) => `comments?q=${query}`,
    }),
    searchUsers: builder.query({
      query: (query) => `users?q=${query}`,
    }),
  }),
});

export const { useSearchPostsQuery, useSearchCommunitiesQuery, useSearchCommentsQuery, useSearchUsersQuery } = searchApi;
