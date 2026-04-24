import { baseApi } from "../../api/baseApi";
import type {
  CreateEmployeeRequest,
  EmployApiUser,
  EmployeeRow,
  UpdateEmployeeRequest,
} from "../../../Components/types";
import {
  mapApiUserToEmployeeRow,
  unwrapEmployeeListResponse,
  unwrapEmploySingleResponse,
} from "../../../Components/types";

const employApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<unknown, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/employ/create-employ",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),

    getAllEmployees: builder.query<
      { data: EmployeeRow[]; meta: any },
      Record<string, string | number | boolean | undefined>
    >({
      query: (args) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([name, value]) => {
          if (value !== undefined && value !== "") {
            params.append(name, String(value));
          }
        });
        return {
          url: "/employ",
          method: "GET",
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: unwrapEmployeeListResponse(res).map(mapApiUserToEmployeeRow),
        meta: res?.meta,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Employee" as const, id })),
              "Employee",
            ]
          : ["Employee"],
    }),

    getMyEmployeeData: builder.query<unknown, void>({
      query: () => ({ url: "/employ/my-data", method: "GET" }),
      providesTags: ["Employee"],
    }),

    getEmployeeById: builder.query<EmployApiUser, string>({
      query: (id) => `/employ/${id}`,
      transformResponse: (res: unknown) => {
        const u = unwrapEmploySingleResponse(res);
        if (u) return u;
        throw new Error("Invalid employee detail response");
      },
      providesTags: (_r, _e, id) => [{ type: "Employee", id }],
    }),

    updateEmployee: builder.mutation<
      unknown,
      { id: string; data: UpdateEmployeeRequest }
    >({
      query: ({ id, data }) => ({
        url: `/employ/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, "Employee"],
    }),

    deleteEmployee: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/employ/${id}`, method: "DELETE" }),
      invalidatesTags: ["Employee"],
    }),

    softDeleteEmployee: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/employ/${id}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Employee"],
    }),

    blockEmployee: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/employ/${id}/block`, method: "PATCH" }),
      invalidatesTags: ["Employee"],
    }),

    changeEmployeePassword: builder.mutation<
      unknown,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/employ/change-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),

    verifyEmployeeOtp: builder.mutation<
      unknown,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/employ/varify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetAllEmployeesQuery,
  useGetMyEmployeeDataQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSoftDeleteEmployeeMutation,
  useBlockEmployeeMutation,
  useChangeEmployeePasswordMutation,
  useVerifyEmployeeOtpMutation,
} = employApi;
