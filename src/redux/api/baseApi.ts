import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Professional Base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // You can change this to your actual API URl from .env
    baseUrl: 'http://localhost:4500/api',
    prepareHeaders: (headers) => {
      // Professional way to handle auth tokens from localStorage/state
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Products', 'Orders', 'Category'], // Predefined tags for caching/invalidation
  endpoints: () => ({}), // Endpoints will be injected from specific slice APIs
})
