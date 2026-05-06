import {
  useCreateApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} from "../redux/features/applicationApi/applicationApi";

export const useApplication = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllApplicationsQuery(queryObj || {});

  const [createApplication, { isLoading: isCreating }] = useCreateApplicationMutation();
  const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteApplicationMutation();

  return {
    response,
    applications: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting,
    isFetching,
    refetch,
    createApplication,
    updateApplication,
    deleteApplication,
    useGetApplicationById: useGetApplicationByIdQuery,
  };
};
