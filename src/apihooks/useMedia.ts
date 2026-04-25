import {
  useCreateImageMutation,
  useDeleteImageMutation,
  useGetImagesQuery,
  useLazyGetImagesQuery,
  useUpdateImageMutation,
} from "../redux/features/mediaApi/mediaApi";

export const useMedia = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetImagesQuery(queryObj || {});

  const [createImage, { isLoading: isCreating }] = useCreateImageMutation();
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
  const [getImagesLazy, { isFetching: isLazyFetching }] = useLazyGetImagesQuery();

  return {
    response,
    images: response?.data || [],
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting || isLazyFetching,
    isFetching,
    refetch,
    createImage,
    updateImage,
    deleteImage,
    getImagesLazy,
  };
};
