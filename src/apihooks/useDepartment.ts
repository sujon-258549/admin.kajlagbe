import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetAllDepartmentsQuery,
  useUpdateDepartmentMutation,
  useUpdateDepartmentStatusMutation,
} from "../redux/features/departmentApi/departmentApi";

/**
 * useDepartment Hook (API Hook)
 */
export const useDepartment = (queryObj?: any) => {
  const {
    data: departmentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllDepartmentsQuery(queryObj);

  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();
  const [updateDepartmentStatus, { isLoading: isUpdatingStatus }] = useUpdateDepartmentStatusMutation();

  return {
    // Data & State
    departmentsData,
    departments: departmentsData?.data || [],
    meta: departmentsData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPage: 1,
    },
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isUpdatingStatus,
    isFetching,
    
    // Actions
    refetch,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateDepartmentStatus,
  };
};
