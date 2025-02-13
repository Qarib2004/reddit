import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Community,User,Post,AdminStats } from "../interface/types";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:5000/api/admin",
        credentials: "include" 
    }),
    endpoints: (builder) => ({
        getAllUsers: builder.query<User[], void>({
            query: () => "/users",
        }),
        banUser: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/${id}/ban`,
                method: "PUT",
            }),
        }),
        updateUserRole: builder.mutation<{ message: string }, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: "PUT",
                body: { role },
            }),
        }),

        getAllCommunities: builder.query<Community[], void>({
            query: () => "/communities",
        }),

        deleteCommunity: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/communities/${id}`,
                method: "DELETE",
            }),
        }),

        getAllPosts: builder.query<Post[], void>({
            query: () => "/posts",
        }),

        deletePost: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
        }),
        getAdminStats: builder.query<AdminStats, void>({
            query: () => "/stats",
          }),
    }),
});

export const {
    useGetAllUsersQuery,
    useBanUserMutation,
    useUpdateUserRoleMutation,
    useGetAllCommunitiesQuery,
    useDeleteCommunityMutation,
    useGetAllPostsQuery,
    useDeletePostMutation,
    useGetAdminStatsQuery
} = adminApi;
