import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Community } from "../interface/types";
export const communitiesApi = createApi({
  reducerPath: "communitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCommunities: builder.query<Community[], void>({
      query: () => "/communities",
    }),
    getCommunityById: builder.query<Community, string>({
      query: (id) => `/communities/${id}`,
    }),
    createCommunity: builder.mutation<Community, { name: string; description: string }>({
      query: (communityData) => ({
        url: "/communities",
        method: "POST",
        body: communityData,
      }),
    }),
    joinCommunity: builder.mutation<{ message: string }, string>({
      query: (communityId) => ({
        url: `/communities/${communityId}/join`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useGetCommunityByIdQuery,
  useCreateCommunityMutation,
  useJoinCommunityMutation,
} = communitiesApi;
