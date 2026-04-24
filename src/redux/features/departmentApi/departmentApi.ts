import { baseApi } from "../../api/baseApi";
import type {
  TDepartment,
  TDepartmentCreateUpdatePayload,
  TDepartmentResponse,
} from "../../../Components/types";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDepartments: builder.query<
      TDepartmentResponse<TDepartment[]>,
      Record<string, string | number | boolean | undefined>
    >({
      query: (args = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([name, value]) => {
          if (value !== undefined && value !== "") {
            params.append(name, String(value));
          }
        });
        return {
          url: "/department",
          method: "GET",
          params,
        };
      },
      providesTags: ["Department"],
    }),

    getDepartmentById: builder.query<TDepartmentResponse<TDepartment>, string>({
      query: (id) => `/department/${id}`,
      providesTags: ["Department"],
    }),

    createDepartment: builder.mutation<
      TDepartmentResponse<TDepartment>,
      TDepartmentCreateUpdatePayload
    >({
      query: (data) => ({
        url: "/department",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    updateDepartment: builder.mutation<
      TDepartmentResponse<TDepartment>,
      { id: string; data: TDepartmentCreateUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/department/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    deleteDepartment: builder.mutation<TDepartmentResponse<TDepartment>, string>({
      query: (id) => ({
        url: `/department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),

    updateDepartmentStatus: builder.mutation<
      TDepartmentResponse<TDepartment>,
      string
    >({
      query: (id) => ({
        url: `/department/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateDepartmentStatusMutation,
} = departmentApi;
