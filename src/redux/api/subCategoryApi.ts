import { baseApi } from "./baseApi";

export interface TSubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  icon?: string;
  slug: string;
  status: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: TMeta;
}

export const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategory: builder.query<TResponse<TSubCategory[]>, Record<string, any>>({
      query: (arg) => ({
        url: "/sub-category",
        method: "GET",
        params: arg,
      }),
      providesTags: ["Category"],
    }),
    getSubCategoryById: builder.query<TResponse<TSubCategory>, string>({
      query: (id) => ({
        url: `/sub-category/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    createSubCategory: builder.mutation<TResponse<TSubCategory>, Partial<TSubCategory>>({
      query: (data) => ({
        url: "/sub-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateSubCategory: builder.mutation<TResponse<TSubCategory>, { id: string; data: Partial<TSubCategory> }>({
      query: ({ id, data }) => ({
        url: `/sub-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateSubCategoryStatus: builder.mutation<TResponse<TSubCategory>, string>({
      query: (id) => ({
        url: `/sub-category/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
    deleteSubCategory: builder.mutation<TResponse<TSubCategory>, string>({
      query: (id) => ({
        url: `/sub-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllSubCategoryQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useUpdateSubCategoryStatusMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
