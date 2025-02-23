import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { postsApi } from "./postsSlice";
import { commentsApi } from "./commentsSlice";
import { communitiesApi } from "./communitiesSlice";
import { categoriesApi } from "./categoriesSlice";
import {notificationsApi} from "./notificationsSlice";
import { messagesApi } from "./messagesSlice";
import { adminApi } from "./adminSlice";
import { moderatorApi } from "./moderatorSlice";
import authReducer from "./authSlice";
import { searchApi } from "./searchSlice";
import { awardsApi } from "./awardsSlice";
import { walletApi } from "./WalletSlice";

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
    [moderatorApi.reducerPath]: moderatorApi.reducer, 
    [searchApi.reducerPath]: searchApi.reducer, 
    [awardsApi.reducerPath]: awardsApi.reducer, 
    [walletApi.reducerPath]: walletApi.reducer, 



     
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
      .concat(adminApi.middleware)
      .concat(moderatorApi.middleware)
      .concat(searchApi.middleware)
      .concat(awardsApi.middleware)
      .concat(walletApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
