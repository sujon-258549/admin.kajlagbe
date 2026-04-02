import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import authReducer from '../features/auth/authSlice';

export const reducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});
