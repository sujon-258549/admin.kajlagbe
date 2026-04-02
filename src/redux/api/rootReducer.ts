import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';

export const reducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
