import { configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import { rootReducer } from "./rootReducer";

// Resolve storage for ESM/Vite compatibility
const persistStorage = (storage as any).default ?? storage;

const persistConfig = {
  key: "root",
  version: 1,
  storage: persistStorage,
  whitelist: ["auth"], // Persist only auth slice for security and performance
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false, // Performance optimization for large state
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== "production", // Enable Redux Devtools only in development
});

export const persistor = persistStore(store);

// Types for typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
