import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { reducer } from './api/rootReducer';

// Configure the professional store
export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Typed standard RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;