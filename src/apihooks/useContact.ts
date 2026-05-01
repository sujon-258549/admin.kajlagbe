import {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
} from "../redux/features/contactApi/contactApi";

export const useContact = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllContactsQuery(queryObj || {});

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  return {
    response,
    contacts: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isDeleting,
    isFetching,
    refetch,
    deleteContact,
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
