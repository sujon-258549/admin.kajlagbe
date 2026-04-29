import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { logout, setUser } from '../features/auth/authSlice'
import { Mutex } from 'async-mutex'

// Create a new mutex to prevent multiple simultaneous refresh calls
const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4500/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      // console.log("📤 [Auth] Sending Token:", token.substring(0, 20) + "...");
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
  credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  
  let result = await baseQuery(args, api, extraOptions)

  // DEBUG: See every result
  // console.log("🔍 [Debug] API Result:", result);

  if (result.error) {
  
    
    // Check if it's 401 (Unauthorized)
    if (result.error.status === 401 || (result.error.data as any)?.error?.statusCode === 401) {
      console.log("🔴 [Auth] Access token expired (401). Attempting to refresh...");
      
      if (!mutex.isLocked()) {
        const release = await mutex.acquire()
        try {
          console.log("🔄 [Auth] Fetching new token from /auth/refresh-token...");
          
          const refreshResult: any = await baseQuery(
            {
              url: '/auth/refresh-token',
              method: 'POST',
            },
            api,
            extraOptions
          )

          console.log("🔄 [Auth] Refresh Result:", refreshResult);

          if (refreshResult.data) {
            console.log("✅ [Auth] Token refreshed successfully! Retrying original request...");
            const { accessToken, user } = refreshResult.data.data;
            api.dispatch(setUser({ user, token: accessToken }))
            result = await baseQuery(args, api, extraOptions)
          } else {
            console.error("❌ [Auth] Refresh token expired or invalid. Logging out...");
            api.dispatch(logout())
          }
        } finally {
          release()
        }
      } else {
        await mutex.waitForUnlock()
        result = await baseQuery(args, api, extraOptions)
      }
    }
  }
  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Products',
    'Orders',
    'Category',
    'Employee',
    'Department',
    'Role',
    'Folder',
    'Media',
    'WorkType',
    'Job',
    'Subscription',
    'RolePermission',
    'Blog',
  ],
  endpoints: () => ({}),
})
