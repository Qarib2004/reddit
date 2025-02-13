import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { postsApi } from "./postsSlice";
import { commentsApi } from "./commentsSlice";
import { communitiesApi } from "./communitiesSlice";
import { categoriesApi } from "./categoriesSlice";
import {notificationsApi} from "./notificationsSlice";
import { messagesApi } from "./messagesSlice";
import { adminApi } from "./adminSlice";
import authReducer from "./authSlice";

import {friendsApi} from "./friendsSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [communitiesApi.reducerPath]: communitiesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer, 
    [notificationsApi.reducerPath]: notificationsApi.reducer, 
    [friendsApi.reducerPath]: friendsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer, 
     
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(communitiesApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(friendsApi.middleware)
      .concat(messagesApi.middleware)
      .concat(adminApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
