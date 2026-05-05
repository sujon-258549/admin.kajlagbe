import { baseApi } from "../../api/baseApi";

const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivityLogs: builder.query({
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
          url: "/activity-log",
          method: "GET",
          params,
        };
      },
      providesTags: ["ActivityLog"],
    }),

    getActivityLogById: builder.query({
      query: (id: string) => `/activity-log/${id}`,
      providesTags: ["ActivityLog"],
    }),

    getActivitySummary: builder.query({
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
          url: "/activity-log/summary",
          method: "GET",
          params,
        };
      },
      providesTags: ["ActivityLog"],
    }),
  }),
});

export const {
  useGetAllActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useGetActivitySummaryQuery,
} = activityLogApi;