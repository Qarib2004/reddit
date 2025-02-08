import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../interface/types";
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], string | void>({
      query: (sort = "hot") => `/posts?sort=${sort}`,
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
    }),
    createPost: builder.mutation<Post, { title: string; content?: string; community: string }>({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updatePost: builder.mutation<Post, { id: string; title: string; content: string }>({
      query: ({ id, ...postData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: postData,
      }),
    }),
    deletePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
    }),
    likePost: builder.mutation<{ message: string; upvotes: number }, string>({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
    }),
    dislikePost: builder.mutation<{ message: string; downvotes: number }, string>({
      query: (id) => ({
        url: `/posts/${id}/dislike`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
} = postsApi;
