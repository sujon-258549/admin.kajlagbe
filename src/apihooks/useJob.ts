import {
  useCreateJobMutation,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useChangeJobStatusMutation,
} from "../redux/features/jobApi/jobApi";

export const useJob = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllJobsQuery(queryObj || {});

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  const [changeStatus, { isLoading: isStatusUpdating }] = useChangeJobStatusMutation();

  return {
    response,
    jobs: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    createJob,
    updateJob,
    deleteJob,
    changeStatus,
    useGetJobById: useGetJobByIdQuery,
  };
};
