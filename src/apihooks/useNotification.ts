import { useGetAllNotificationsQuery, useMarkAllAsReadMutation, useUpdateNotificationMutation } from "../redux/features/notificationApi/notificationApi";

export const useNotification = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllNotificationsQuery(queryObj || {});

  const [markAllRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();
  const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();

  return {
    response,
    notifications: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isMarking || isUpdating,
    isFetching,
    refetch,
    markAllRead,
    updateNotification,
  };
};
