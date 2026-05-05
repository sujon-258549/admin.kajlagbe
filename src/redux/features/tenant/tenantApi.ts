import { baseApi } from "../../api/baseApi";

const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new tenant
    addTenant: builder.mutation({
      query: (data) => ({
        url: "/tenant/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tenant"],
    }),

    // Get all tenants with dynamic query params
    getAllTenants: builder.query({
      query: (args: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/tenant",
          method: "GET",
          params,
        };
      },
      providesTags: ["Tenant"],
    }),

    // Get single tenant
    getSingleTenant: builder.query({
      query: (id) => `/tenant/${id}`,
      providesTags: ["Tenant"],
    }),

    // Update tenant
    updateTenant: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tenant/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tenant"],
    }),

    // Delete tenant
    deleteTenant: builder.mutation({
      query: (id) => ({
        url: `/tenant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tenant"],
    }),
  }),
});

export const {
  useGetAllTenantsQuery,
  useAddTenantMutation,
  useGetSingleTenantQuery,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantApi;
