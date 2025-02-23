import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/payments",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createPayment: builder.mutation<{ approvalUrl: string }, number>({
      query: (amount) => ({
        url: "/create",
        method: "POST",
        body: { amount },
      }),
    }),
    executePayment: builder.mutation<{ message: string; wallet: number }, { paymentId: string; PayerID: string }>({
      query: ({ paymentId, PayerID }) => ({
        url: `/success?paymentId=${paymentId}&PayerID=${PayerID}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreatePaymentMutation, useExecutePaymentMutation } = walletApi;
