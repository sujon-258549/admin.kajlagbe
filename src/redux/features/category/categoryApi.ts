import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
   
        // Add new category
        addCategory: builder.mutation({
            query: (data) => ({
                url: "/category",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        // Get all categories with dynamic query params
        getAllCategories: builder.query({
            query: (args: Record<string, string | number | boolean | undefined>) => {
                const params = new URLSearchParams()
                if(args){
                    Object.entries(args).forEach(([name, value]) => {
                        if (value !== undefined) {
                            params.append(name, String(value));
                        }
                    });
                }
                return {
                    url: "/category",
                    method: "GET",
                    params,
                }
            },
            providesTags: ["Category"],
        }),


        // Get single category
        getSingleCategory: builder.query({
            query: (id) => `/category/${id}`,
            providesTags: ["Category"],
        }),

        // Update category
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/category/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        // Delete category
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // Change category status
        changeCategoryStatus: builder.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/category/${id}/status`,
                method: "PATCH",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const { useGetAllCategoriesQuery, useAddCategoryMutation, useGetSingleCategoryQuery, useUpdateCategoryMutation, useDeleteCategoryMutation, useChangeCategoryStatusMutation } = categoryApi;
