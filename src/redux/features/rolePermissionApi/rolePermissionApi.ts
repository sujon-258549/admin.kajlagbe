import { baseApi } from "../../api/baseApi";

const rolePermissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRolePermissions: builder.query({
      query: (roleId) => ({
        url: `/role-permission/${roleId}`,
        method: "GET",
      }),
      providesTags: ["RolePermission"],
    }),
    updateRolePermissions: builder.mutation({
      query: ({ roleId, permissions }) => ({
        url: `/role-permission/${roleId}`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["RolePermission"],
    }),
  }),
});

export const {
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} = rolePermissionApi;
