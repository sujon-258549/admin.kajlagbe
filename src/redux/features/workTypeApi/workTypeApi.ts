import { baseApi } from "../../api/baseApi";
import {
  TWorkType,
  CreateWorkTypeRequest,
  UpdateWorkTypeRequest,
} from "../../../Components/types";

const workTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkType: builder.mutation<unknown, CreateWorkTypeRequest>({
      query: (body) => ({
        url: "/work-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkType"],
    }),

    getAllWorkTypes: builder.query<TWorkType[], void>({
      query: () => ({
        url: "/work-types",
        method: "GET",
      }),
      transformResponse: (res: any) => res.data || res,
      providesTags: ["WorkType"],
    }),

    getWorkTypeById: builder.query<TWorkType, string>({
      query: (id) => `/work-types/${id}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: (_r, _e, id) => [{ type: "WorkType", id }],
    }),

    updateWorkType: builder.mutation<
      unknown,
      { id: string; data: UpdateWorkTypeRequest }
    >({
      query: ({ id, data }) => ({
        url: `/work-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "WorkType", id }, "WorkType"],
    }),

    updateWorkTypeStatus: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/work-types/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "WorkType", id }, "WorkType"],
    }),

    deleteWorkType: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/work-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkType"],
    }),
  }),
});

export const {
  useCreateWorkTypeMutation,
  useGetAllWorkTypesQuery,
  useGetWorkTypeByIdQuery,
  useUpdateWorkTypeMutation,
  useUpdateWorkTypeStatusMutation,
  useDeleteWorkTypeMutation,
} = workTypeApi;
