import {
  useCreateWorkTypeMutation,
  useGetAllWorkTypesQuery,
  useUpdateWorkTypeMutation,
  useUpdateWorkTypeStatusMutation,
  useDeleteWorkTypeMutation,
} from "../redux/features/workTypeApi/workTypeApi";

export const useWorkType = (queryObj?: any) => {
  const {
    data: workTypes,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllWorkTypesQuery(queryObj);

  const [createWorkType, { isLoading: isCreating }] = useCreateWorkTypeMutation();
  const [updateWorkType, { isLoading: isUpdating }] = useUpdateWorkTypeMutation();
  const [deleteWorkType, { isLoading: isDeleting }] = useDeleteWorkTypeMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateWorkTypeStatusMutation();

  return {
    workTypes: workTypes?.data || [],
    meta: workTypes?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    createWorkType,
    updateWorkType,
    deleteWorkType,
    updateStatus,
  };
};
