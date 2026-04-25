import {
  useGetAllSubCategoryQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useUpdateSubCategoryStatusMutation,
  useDeleteSubCategoryMutation,
} from "../redux/features/subCategoryApi/subCategoryApi";

export const useSubCategory = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSubCategoryQuery(queryObj || {});

  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateSubCategoryStatusMutation();

  return {
    response,
    subCategories: response?.data || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isStatusUpdating,
    isFetching,
    refetch,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    updateStatus,
    useGetSubCategoryById: useGetSubCategoryByIdQuery,
  };
};
