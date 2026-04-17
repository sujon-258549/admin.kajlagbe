import { baseApi } from "../../api/baseApi";

const employApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Create new employee
        createEmployee: builder.mutation({
            query: (data) => ({
                url: "/employ/create-employ",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        // Get all employees with dynamic query params
        getAllEmployees: builder.query({
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
                    url: "/employ",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["Employee"],
        }),

        // Get my data (authenticated)
        getMyEmployeeData: builder.query({
            query: () => ({
                url: "/employ/my-data",
                method: "GET",
            }),
            providesTags: ["Employee"],
        }),

        // Get single employee by id
        getEmployeeById: builder.query({
            query: (id: string) => `/employ/${id}`,
            providesTags: ["Employee"],
        }),

        // Update employee
        updateEmployee: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/employ/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        // Delete employee (hard delete)
        deleteEmployee: builder.mutation({
            query: (id: string) => ({
                url: `/employ/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employee"],
        }),

        // Soft delete employee
        softDeleteEmployee: builder.mutation({
            query: (id: string) => ({
                url: `/employ/${id}/soft-delete`,
                method: "PATCH",
            }),
            invalidatesTags: ["Employee"],
        }),

        // Block / unblock employee
        blockEmployee: builder.mutation({
            query: (id: string) => ({
                url: `/employ/${id}/block`,
                method: "PATCH",
            }),
            invalidatesTags: ["Employee"],
        }),

        // Change password (authenticated)
        changeEmployeePassword: builder.mutation({
            query: (data: { oldPassword: string; newPassword: string }) => ({
                url: "/employ/change-password",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        // Verify OTP
        verifyEmployeeOtp: builder.mutation({
            query: (data: { email: string; otp: string }) => ({
                url: "/employ/varify-otp",
                method: "POST",
                body: data,
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
