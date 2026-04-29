import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
  useChangeBlogStatusMutation,
  useGetSingleBlogQuery,
} from "../redux/features/blogApi/blogApi";

export const useBlog = (queryObj?: any) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBlogsQuery(queryObj || {});

  const [addBlog, { isLoading: isCreating }] = useAddBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [changeStatus, { isLoading: isStatusUpdating }] = useChangeBlogStatusMutation();

  return {
    response,
    blogs: response?.data || [],
    meta: response?.meta,
    isLoading:
      isLoading ||
      isFetching ||
      isCreating ||
      isUpdating ||
      isDeleting ||
      isStatusUpdating,
    isFetching,
    refetch,
    addBlog,
    updateBlog,
    deleteBlog,
    changeStatus,
  };
};

export const useSingleBlog = (id: string) => {
  const { data: response, isLoading, isFetching, refetch } = useGetSingleBlogQuery(id, { skip: !id });
  return {
    blog: response?.data,
    isLoading: isLoading || isFetching,
    refetch,
  };
};
