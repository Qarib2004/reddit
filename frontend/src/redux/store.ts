import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { postsApi } from "./postsSlice";
import { commentsApi } from "./commentsSlice";
import { communitiesApi } from "./communitiesSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [communitiesApi.reducerPath]: communitiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(communitiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
