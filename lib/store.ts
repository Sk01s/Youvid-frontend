"use client";

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme-slice";
import authReducer from "./features/auth-slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// No-op storage for SSR
const createNoopStorage = () => ({
  getItem: (_: string) => Promise.resolve<string | null>(null),
  setItem: (_: string, _v: string) => Promise.resolve(),
  removeItem: (_: string) => Promise.resolve(),
});
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Separate persist configs for each reducer
const themePersistConfig = {
  key: "theme",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const rootReducer = {
  theme: persistReducer(themePersistConfig, themeReducer),
  auth: persistReducer(authPersistConfig, authReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
