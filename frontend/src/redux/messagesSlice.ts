import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Message } from "../interface/types";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], { userId: string; recipientId: string }>({
      query: ({ userId, recipientId }) => `/messages/history/${userId}/${recipientId}`,
    }),

    sendMessage: builder.mutation<{ message: string }, { recipientId: string; message: string }>({
      query: ({ recipientId, message }) => ({
        url: `/messages/send`,
        method: "POST",
        body: { recipientId, message },
      }),
    }),

   
    getUnreadMessages: builder.query<{ [key: string]: number }, void>({
      query: () => "/messages/unread",
    }),

    
    markMessagesAsRead: builder.mutation<{ success: boolean }, { senderId: string }>({
      query: ({ senderId }) => ({
        url: `/messages/read/${senderId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetUnreadMessagesQuery,
  useMarkMessagesAsReadMutation,
} = messagesApi;
