import {
  useDeleteErrorLogMutation,
  useGetAllErrorLogsQuery,
  useGetErrorSummaryQuery,
  useMarkErrorResolvedMutation,
} from "../redux/features/errorLogApi/errorLogApi";

export const useErrorLog = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllErrorLogsQuery(queryObj || {});

  const [markResolved, { isLoading: isResolving }] =
    useMarkErrorResolvedMutation();
  const [deleteErrorLog, { isLoading: isDeleting }] =
    useDeleteErrorLogMutation();

  return {
    response,
    logs: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isResolving || isDeleting,
    isFetching,
    refetch,
    markResolved,
    deleteErrorLog,
  };
};

export const useErrorSummary = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetErrorSummaryQuery(queryObj || {});

  return {
    summary: response?.data,
    isLoading: isLoading || isFetching,
    refetch,
  };
};
