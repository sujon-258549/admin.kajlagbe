import {
  useAddTenantMutation,
  useDeleteTenantMutation,
  useGetAllTenantsQuery,
  useUpdateTenantMutation,
} from "../redux/features/tenant/tenantApi";

export const useTenant = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllTenantsQuery(queryObj || {});

  const [addTenant, { isLoading: isCreating }] = useAddTenantMutation();
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();
  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation();

  return {
    response,
    tenants: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting,
    isFetching,
    refetch,
    addTenant,
    updateTenant,
    deleteTenant,
  };
};
