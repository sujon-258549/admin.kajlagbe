import {
  useCreateSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useChangeSubscriptionStatusMutation,
} from "../redux/features/subscriptionApi/subscriptionApi";

export const useSubscription = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSubscriptionsQuery(queryObj || {});

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();
  const [changeStatus, { isLoading: isStatusUpdating }] = useChangeSubscriptionStatusMutation();

  return {
    response,
    subscriptions: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    changeStatus,
    useGetSubscriptionById: useGetSubscriptionByIdQuery,
  };
};
