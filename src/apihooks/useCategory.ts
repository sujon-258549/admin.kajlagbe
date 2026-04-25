import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useChangeCategoryStatusMutation,
} from "../redux/features/category/categoryApi";

export const useCategory = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCategoriesQuery(queryObj || {});

  const [addCategory, { isLoading: isCreating }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [changeStatus, { isLoading: isStatusUpdating }] = useChangeCategoryStatusMutation();

  return {
    response,
    categories: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    addCategory,
    updateCategory,
    deleteCategory,
    changeStatus,
  };
};
