import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Comment } from "../interface/types";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
   
    getComments: builder.query<Comment[], string>({
      query: (postId) => `/posts/${postId}/comments`,
    }),

    addComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content, post: postId },
      }),
    }),

    likeComment: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/upvotes`,
        method: "POST",
      }),
    }),

    dislikeComment: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/downvotes`,
        method: "POST",
      }),
    }),

    deleteComment: builder.mutation<{ message: string }, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
    replyToComment: builder.mutation<Comment, { postId: string; parentId: string; content: string }>(
      {
        query: ({ postId, parentId, content }) => ({
          url: `/comments/${parentId}/reply`,
          method: "POST",
          body: { content, postId, parentComment: parentId },
        }),
      }
    ),
    

    likeReply: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/reply/upvotes`,
        method: "POST",
      }),
    }),

    dislikeReply: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/reply/downvotes`,
        method: "POST",
      }),
    }),

    reportComment: builder.mutation<{ message: string }, { commentId: string; reason: string }>({
      query: ({ commentId, reason }) => ({
        url: `comments/report/${commentId}`,
        method: "POST",
        body: { reason },
      }),
    }),
    
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation, 
  useReplyToCommentMutation,
  useLikeReplyMutation,
  useDislikeReplyMutation,
  useReportCommentMutation
} = commentsApi;
