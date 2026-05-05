import { baseApi } from "../../api/baseApi";

const errorLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllErrorLogs: builder.query({
      query: (args: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined && value !== "" && value !== null) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/error-log",
          method: "GET",
          params,
        };
      },
      providesTags: ["ErrorLog"],
    }),

    getErrorLogById: builder.query({
      query: (id: string) => `/error-log/${id}`,
      providesTags: ["ErrorLog"],
    }),

    getErrorSummary: builder.query({
      query: (args: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined && value !== "" && value !== null) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/error-log/summary",
          method: "GET",
          params,
        };
      },
      providesTags: ["ErrorLog"],
    }),

    markErrorResolved: builder.mutation({
      query: ({ id, resolved }: { id: string; resolved: boolean }) => ({
        url: `/error-log/${id}/resolve`,
        method: "PATCH",
        body: { resolved },
      }),
      invalidatesTags: ["ErrorLog"],
    }),

    deleteErrorLog: builder.mutation({
      query: (id: string) => ({
        url: `/error-log/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ErrorLog"],
    }),
  }),
});

export const {
  useGetAllErrorLogsQuery,
  useGetErrorLogByIdQuery,
  useGetErrorSummaryQuery,
  useMarkErrorResolvedMutation,
  useDeleteErrorLogMutation,
} = errorLogApi;
