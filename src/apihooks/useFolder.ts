import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetAllFoldersQuery,
  useGetFolderByIdQuery,
  useUpdateFolderMutation,
} from "../redux/features/folderApi/folderApi";

export const useFolder = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllFoldersQuery(queryObj || {});

  const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation();
  const [updateFolder, { isLoading: isUpdating }] = useUpdateFolderMutation();
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation();

  return {
    response,
    folders: response?.data || [],
    rootImages: response?.rootImages || [],
    meta: response?.meta,
    isLoading: isLoading || isFetching || isCreating || isUpdating || isDeleting,
    isFetching,
    refetch,
    createFolder,
    updateFolder,
    deleteFolder,
    useGetFolderById: useGetFolderByIdQuery,
  };
};
