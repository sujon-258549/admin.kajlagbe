import { 
  useCreateBlogCommentMutation, 
  useGetAllBlogCommentsQuery, 
  useGetCommentsByBlogIdQuery, 
  useDeleteBlogCommentMutation 
} from "../redux/features/blogApi/blogCommentApi";

export const useBlogComment = (blogId?: string, query?: any) => {
  const { 
    data: allCommentsData, 
    isLoading: isAllCommentsLoading, 
    refetch: refetchAll 
  } = useGetAllBlogCommentsQuery(query || {}, { skip: !!blogId });

  const { 
    data: blogCommentsData, 
    isLoading: isBlogCommentsLoading, 
    refetch: refetchByBlog 
  } = useGetCommentsByBlogIdQuery({ blogId: blogId!, query }, { skip: !blogId });

  const [deleteBlogComment, { isLoading: isDeleting }] = useDeleteBlogCommentMutation();
  const [createBlogComment, { isLoading: isCreating }] = useCreateBlogCommentMutation();

  return {
    comments: blogId ? blogCommentsData?.data : allCommentsData?.data,
    meta: blogId ? blogCommentsData?.meta : allCommentsData?.meta,
    isLoading: blogId ? isBlogCommentsLoading : isAllCommentsLoading,
    refetch: blogId ? refetchByBlog : refetchAll,
    deleteBlogComment,
    createBlogComment,
    isDeleting,
    isCreating
  };
};
