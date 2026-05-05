import {
  useGetAllActivityLogsQuery,
  useGetActivitySummaryQuery,
} from "../redux/features/activityLogApi/activityLogApi";

export const useActivityLog = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllActivityLogsQuery(queryObj || {});

  return {
    response,
    logs: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching,
    isFetching,
    refetch,
  };
};

export const useActivitySummary = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetActivitySummaryQuery(queryObj || {});

  return {
    summary: response?.data,
    isLoading: isLoading || isFetching,
    refetch,
  };
};
