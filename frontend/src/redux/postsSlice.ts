import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../interface/types";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<
      Post[],
      { sort?: string; search?: string; community?: string }
    >({
      query: ({ sort = "hot", search = "", community = "" }) =>
        `/posts?sort=${sort}&search=${search}&community=${community}`,
      providesTags: ["Post"],
    }),

    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
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
      invalidatesTags: ["Post"],
    }),

    updatePost: builder.mutation<Post, { id: string; title: string; content: string; postType: string }>(
      {
        query: ({ id, ...patch }) => ({
          url: `/posts/${id}`,
          method: "PATCH",
          body: patch, 
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
      }
    ),

    deletePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    likePost: builder.mutation<
      { message: string; upvotes: string[]; downvotes: string[]; karma: number },
      string
    >({
      query: (id) => ({
        url: `/posts/${id}/upvotes`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    dislikePost: builder.mutation<
      { message: string; downvotes: string[]; upvotes: string[]; karma: number },
      string
    >({
      query: (id) => ({
        url: `/posts/${id}/downvotes`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    reportPost: builder.mutation<{ message: string }, string>({
      query: (postId) => ({
        url: `posts/report/${postId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Post"],
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

    getSubscribedPosts: builder.query<Post[], void>({
      query: () => "/users/subscribed",
      providesTags: ["Post"], 
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
  useGetSubscribedPostsQuery
} = postsApi;
