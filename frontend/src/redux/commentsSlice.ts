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
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation, 
} = commentsApi;
