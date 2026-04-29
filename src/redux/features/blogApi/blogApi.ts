import { baseApi } from "../../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new blog
    addBlog: builder.mutation({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Get all blogs with dynamic query params
    getAllBlogs: builder.query({
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
          url: "/blog",
          method: "GET",
          params,
        };
      },
      providesTags: ["Blog"],
    }),

    // Get single blog
    getSingleBlog: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: ["Blog"],
    }),

    // Update blog
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Change blog status
    changeBlogStatus: builder.mutation({
      query: (id: string) => ({
        url: `/blog/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useAddBlogMutation,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useChangeBlogStatusMutation,
} = blogApi;
