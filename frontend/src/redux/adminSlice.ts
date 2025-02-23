import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Community,User,Post,AdminStats } from "../interface/types";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:5000/api/admin",
        credentials: "include" 
    }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getAllUsers: builder.query<User[], void>({
            query: () => "/users", providesTags: ["Users"],
        }),
        banUser: builder.mutation<
        { message: string; user: User },
        { id: string; duration: number }
      >({
        query: ({ id, duration }) => ({
          url: `/users/${id}/ban`,
          method: "PUT",
          body: { duration },
        }),
        async onQueryStarted({ id, duration }, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              adminApi.util.updateQueryData("getAllUsers", undefined, (draft) => {
                const user = draft.find((u) => u._id === id);
                if (user) {
                  user.banned = duration !== -1;
                  user.banUntil = duration === -1 ? null : new Date(new Date().setDate(new Date().getDate() + duration));
                }
              })
            );
          } catch (error) {
            console.error("Failed to update ban status", error);
          }
        },
        invalidatesTags: ["Users"],
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
          getModeratorRequests: builder.query<User[], void>({
            query: () => "/moderator-requests",
          }),
          updateModeratorRequest: builder.mutation<{ message: string }, { id: string; status: "approved" | "rejected" }>({
            query: ({ id, status }) => ({
              url: `/moderator-requests/${id}`,
              method: "PUT",
              body: { status },
            }),
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
    useGetAdminStatsQuery,
    useGetModeratorRequestsQuery,
     useUpdateModeratorRequestMutation
} = adminApi;
