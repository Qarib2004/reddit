import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post ,Comment,ModeratorStats,ModeratorChatMessage,ModeratorHistoryRecord,UserWarnings} from "../interface/types";

export const moderatorApi = createApi({
  reducerPath: "moderatorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/moderator", credentials: "include" }),
  endpoints: (builder) => ({
    getReportedPosts: builder.query<Post[], void>({
      query: () => "/reported-posts",
    }),
    takeActionOnPost: builder.mutation<{ message: string }, { id: string; action: "delete" | "dismiss" }>({
      query: ({ id, action }) => ({
        url: `/reported-posts/${id}`,
        method: "PUT",
        body: { action },
      }),
    }),
    getReportedComments: builder.query<Comment[], void>({
      query: () => "/reported",
    }),
    takeActionOnComment: builder.mutation<{ message: string }, { id: string; action: "delete" | "dismiss" }>({
      query: ({ id, action }) => ({
        url: `/reported-comments/${id}`,
        method: "PUT",
        body: { action },
      }),
    }),
    getModeratorStats: builder.query<ModeratorStats, void>({
        query: () => "/stats",
      }),
  
      getModeratorHistory: builder.query<ModeratorHistoryRecord[], void>({
        query: () => "/history",
      }),
  
      undoModeratorAction: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `/history/undo/${id}`,
          method: "PUT",
        }),
      }),
  
      getModeratorChat: builder.query<ModeratorChatMessage[], void>({
        query: () => "/chat",
      }),
  
      sendMessage: builder.mutation<{ message: string }, { text: string }>({
        query: (data) => ({
          url: "/chat/send",
          method: "POST",
          body: data,
        }),
      }),
  
      getUsersWithWarnings: builder.query<UserWarnings[], void>({
        query: () => "/warnings",
      }),
  
      issueWarning: builder.mutation<{ message: string }, string>({
        query: (userId) => ({
          url: `/warnings/${userId}`,
          method: "PUT",
        }),
      }),
  }),
});

export const { 
  useGetReportedPostsQuery, 
  useTakeActionOnPostMutation, 
  useGetReportedCommentsQuery, 
  useTakeActionOnCommentMutation ,
  useGetModeratorStatsQuery,
  useGetModeratorHistoryQuery,
  useUndoModeratorActionMutation,
  useGetModeratorChatQuery,
  useSendMessageMutation,
  useGetUsersWithWarningsQuery,
  useIssueWarningMutation,
} = moderatorApi;
