import { baseApi } from "../../api/baseApi";
import type {
  TRole,
  TRoleCreateUpdatePayload,
  TRoleResponse,
} from "../../../Components/types";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<
      TRoleResponse<TRole[]>,
      Record<string, string | number | boolean | undefined>
    >({
      query: (args = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([name, value]) => {
          if (value !== undefined && value !== "") {
            params.append(name, String(value));
          }
        });
        return {
          url: "/role",
          method: "GET",
          params,
        };
      },
      providesTags: ["Role"],
    }),

    getRoleById: builder.query<TRoleResponse<TRole>, string>({
      query: (id) => `/role/${id}`,
      providesTags: ["Role"],
    }),

    createRole: builder.mutation<TRoleResponse<TRole>, TRoleCreateUpdatePayload>({
      query: (data) => ({
        url: "/role",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation<
      TRoleResponse<TRole>,
      { id: string; data: TRoleCreateUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation<TRoleResponse<TRole>, string>({
      query: (id) => ({
        url: `/role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),

    updateRoleStatus: builder.mutation<TRoleResponse<TRole>, string>({
      query: (id) => ({
        url: `/role/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleStatusMutation,
} = roleApi;
