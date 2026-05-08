import { baseApi } from "../../api/baseApi";

export type DateRangeKey =
  | "today"
  | "yesterday"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "this-year"
  | "all";

export interface AdminKpiBatch {
  users: number;
  jobs: number;
  applications: number;
  blogs: number;
  contacts: number;
  payments: number;
  activeJobs: number;
  acceptedApplications: number;
}

export interface AdminKpis {
  range: { from: string; to: string; label: string };
  totals: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    totalBlogs: number;
    totalContacts: number;
  };
  current: AdminKpiBatch;
  previous: AdminKpiBatch;
  deltas: Record<keyof AdminKpiBatch, number>;
}

export interface GrowthPoint {
  key: string;
  label: string;
  users: number;
  jobs: number;
  applications: number;
}

export interface FunnelStage {
  name: string;
  value: number;
  pct: number;
}

export interface OnlineSnapshot {
  onlineUsers: number;
  liveSessions: number;
}

export interface LiveFeedItem {
  type: "signup" | "application" | "contact";
  id: string;
  label: string;
  detail: string;
  createdAt: string;
}

export interface RecentSignals {
  recentUsers: any[];
  recentJobs: any[];
  recentApplications: any[];
  recentContacts: any[];
}

const unwrap = <T>(res: any): T => (res?.data ?? res) as T;

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<any, void>({
      query: () => ({ url: "/dashboard/overview", method: "GET" }),
      transformResponse: (res: any) => unwrap(res),
      providesTags: ["Dashboard"],
    }),

    getAdminKpis: builder.query<AdminKpis, { range?: DateRangeKey } | void>({
      query: (args) => ({
        url: "/dashboard/admin/kpis",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<AdminKpis>(res),
      providesTags: ["Dashboard"],
    }),

    getGrowthTimeseries: builder.query<
      GrowthPoint[],
      { range?: DateRangeKey } | void
    >({
      query: (args) => ({
        url: "/dashboard/admin/growth",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<GrowthPoint[]>(res),
      providesTags: ["Dashboard"],
    }),

    getConversionFunnel: builder.query<
      FunnelStage[],
      { range?: DateRangeKey } | void
    >({
      query: (args) => ({
        url: "/dashboard/admin/funnel",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<FunnelStage[]>(res),
      providesTags: ["Dashboard"],
    }),

    getRecentSignals: builder.query<RecentSignals, void>({
      query: () => ({ url: "/dashboard/admin/recent", method: "GET" }),
      transformResponse: (res: any) => unwrap<RecentSignals>(res),
      providesTags: ["Dashboard"],
    }),

    getOnlineSnapshot: builder.query<OnlineSnapshot, void>({
      query: () => ({ url: "/dashboard/online", method: "GET" }),
      transformResponse: (res: any) => unwrap<OnlineSnapshot>(res),
      providesTags: ["Dashboard"],
    }),

    getLiveActivityFeed: builder.query<LiveFeedItem[], { limit?: number } | void>({
      query: (args) => ({
        url: "/dashboard/live-feed",
        method: "GET",
        params: args ? { limit: args.limit } : undefined,
      }),
      transformResponse: (res: any) => unwrap<LiveFeedItem[]>(res),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetAdminKpisQuery,
  useGetGrowthTimeseriesQuery,
  useGetConversionFunnelQuery,
  useGetRecentSignalsQuery,
  useGetOnlineSnapshotQuery,
  useGetLiveActivityFeedQuery,
} = dashboardApi;
