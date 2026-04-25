import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useUpdateRoleStatusMutation,
} from "../redux/features/roleApi/roleApi";

export const useRole = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllRolesQuery(queryObj || {});

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [updateRoleStatus, { isLoading: isStatusUpdating }] = useUpdateRoleStatusMutation();

  return {
    response,
    roles: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    useGetRoleById: useGetRoleByIdQuery,
  };
};
