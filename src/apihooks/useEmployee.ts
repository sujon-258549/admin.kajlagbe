import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "../redux/features/employApi/employApi";

export const useEmployee = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllEmployeesQuery(queryObj || {});

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  return {
    response,
    employees: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting,
    isFetching,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    // ID দিয়ে সিঙ্গেল এমপ্লয়ি ডাটা (অপশনাল ব্যবহারের জন্য)
    useGetEmployeeById: useGetEmployeeByIdQuery, 
  };
};
