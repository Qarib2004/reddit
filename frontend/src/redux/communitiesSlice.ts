import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Community } from "../interface/types";
export const communitiesApi = createApi({
  reducerPath: "communitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["Community"],
  endpoints: (builder) => ({
    getCommunities: builder.query<Community[], void>({
      query: () => "/communities",
    }),
    getCommunityById: builder.query<Community, string>({
      query: (_id) => `/communities/${_id}`,
      providesTags: (result, error, id) => [{ type: "Community", id }],
    }),
    createCommunity: builder.mutation<Community, { name: string; description: string }>({
      query: (communityData) => ({
        url: "/communities",
        method: "POST",
        body: communityData,
      }),
    }),
    joinCommunity: builder.mutation<{ message: string; community: string; subscriptions: string[] }, string>({
      query: (id) => ({
        url: `/communities/${id}/join`,
        method: "POST",
      }),
    }),
    leaveCommunity: builder.mutation<{ message: string; community: string; subscriptions: string[] }, string>({
      query: (id) => ({
        url: `/communities/${id}/leave`,
        method: "POST",
      }),
    }),
    requestToJoinCommunity: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/communities/${id}/requests`,
        method: "POST",
      }),
    }),
    getJoinRequests: builder.query<{ _id: string; username: string }[], string>({
      query: (communityId) => `/communities/${communityId}/requests`,
    }),
    approveJoinRequest: builder.mutation<{ message: string }, { communityId: string; _id: string }>({
      query: ({ communityId, _id }) => ({
        url: `/communities/${communityId}/approve/${_id}`,
        method: "POST",
      }),
    }),
    rejectJoinRequest: builder.mutation<{ message: string }, { communityId: string; _id: string }>({
      query: ({ communityId, _id }) => ({
        url: `/communities/${communityId}/reject/${_id}`,
        method: "POST",
      }),
    }),
    updateCommunity: builder.mutation<
    Community,
    { id: string; name: string; description: string; type: string }
  >({
    query: ({ id, ...data }) => ({
      url: `/communities/${id}`,
      method: "PUT",
      body: data,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: "Community", id }], 
  }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useGetCommunityByIdQuery,
  useCreateCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useRequestToJoinCommunityMutation,
  useGetJoinRequestsQuery,
  useApproveJoinRequestMutation,
  useRejectJoinRequestMutation,
  useUpdateCommunityMutation
} = communitiesApi;
