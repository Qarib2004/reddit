import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../interface/types";
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<
      Post[],
      { sort?: string; search?: string; community?: string }
    >({
      query: ({ sort = "hot", search = "", community = "" }) =>
        `/posts?sort=${sort}&search=${search}&community=${community}`,
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
    }),
    searchPosts: builder.query<Post[], string>({
      query: (query) => `/posts/search/${query}`,
    }),
    createPost: builder.mutation<
      Post,
      { title: string; content?: string; community: string }
    >({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updatePost: builder.mutation<
      Post,
      { id: string; title: string; content: string }
    >({
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
    likePost: builder.mutation<
      { message: string; upvotes: string[]; downvotes: string[] },
      string
    >({
      query: (id) => ({
        url: `/posts/${id}/upvotes`,
        method: "POST",
      }),
    }),
    dislikePost: builder.mutation<
      { message: string; downvotes: string[]; upvotes: string[] },
      string
    >({
      query: (id) => ({
        url: `/posts/${id}/downvotes`,
        method: "POST",
      }),
    }),
    reportPost: builder.mutation<{ message: string }, string>({
      query: (postId) => ({
        url: `posts/report/${postId}`,
        method: "PUT",
      }),
    }),

    hidePost: builder.mutation<{ message: string }, string>({
      query: (postId) => ({
        url: `posts/hide/${postId}`,
        method: "PUT",
      }),
    }),

    showFewerPosts: builder.mutation<{ message: string }, string>({
      query: (postId) => ({
        url: `posts/show-fewer/${postId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useSearchPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useReportPostMutation,
  useHidePostMutation,
  useShowFewerPostsMutation,
} = postsApi;
