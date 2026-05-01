import {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
  useSendFeedbackMutation,
} from "../redux/features/contactApi/contactApi";

export const useContact = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllContactsQuery(queryObj || {});

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [sendFeedback, { isLoading: isSendingFeedback }] = useSendFeedbackMutation();

  return {
    response,
    contacts: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isDeleting || isSendingFeedback,
    isFetching,
    refetch,
    deleteContact,
    sendFeedback,
  };
};

export const useSingleContact = (id: string) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetContactByIdQuery(id, { skip: !id });
  return {
    contact: response?.data,
    isLoading: isLoading || isFetching,
    refetch,
  };
};
