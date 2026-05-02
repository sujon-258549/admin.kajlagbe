import { baseApi } from "../../api/baseApi";

const blogCommentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a comment
    createBlogComment: builder.mutation({
      query: (data) => ({
        url: "/blog-comment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogComment", "Blog"],
    }),

    // Get all comments
    getAllBlogComments: builder.query({
      query: (args: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/blog-comment",
          method: "GET",
          params,
        };
      },
      providesTags: ["BlogComment"],
    }),

    // Get comments for a specific blog
    getCommentsByBlogId: builder.query({
      query: ({ blogId, query }) => {
        const params = new URLSearchParams();
        if (query) {
          Object.entries(query).forEach(([name, value]) => {
            if (value !== undefined) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: `/blog-comment/blog/${blogId}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["BlogComment"],
    }),

    // Get comment by ID
    getBlogCommentById: builder.query({
      query: (id) => `/blog-comment/${id}`,
      providesTags: ["BlogComment"],
    }),

    // Update comment
    updateBlogComment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog-comment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BlogComment"],
    }),

    // Delete comment
    deleteBlogComment: builder.mutation({
      query: (id) => ({
        url: `/blog-comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogComment", "Blog"],
    }),
  }),
});

export const {
  useCreateBlogCommentMutation,
  useGetAllBlogCommentsQuery,
  useGetCommentsByBlogIdQuery,
  useGetBlogCommentByIdQuery,
  useUpdateBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogCommentApi;
