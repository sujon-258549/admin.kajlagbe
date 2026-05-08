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

export interface CategoryItem {
  label: string;
  value: number;
}

export interface ApplicationStatusItem {
  status: string;
  count: number;
}

export interface HiringRate {
  total: number;
  accepted: number;
  rate: number;
}

export interface RecruitmentStage {
  stage: string;
  value: number;
}

export interface SalaryBenchmark {
  level: string;
  avgSalary: number;
  jobs: number;
}

export interface RecentJobRow {
  id: string;
  title: string;
  category: string;
  company: string | null;
  apps: number;
  status: "Active" | "Draft";
  createdAt: string;
}

export interface TopCandidateRow {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  job: string;
  stage: string;
  appliedAt: string;
}

export interface JobApplicantsBlock {
  id: string;
  title: string;
  company: string;
  totalApplicants: number;
  newApplicants: number;
  applicants: Array<{
    id: string;
    name: string;
    photo: string | null;
    status: "New" | "Reviewed" | "Shortlisted";
    appliedAt: string;
  }>;
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

    getJobsByCategory: builder.query<
      CategoryItem[],
      { range?: DateRangeKey } | void
    >({
      query: (args) => ({
        url: "/dashboard/charts/jobs-by-category",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<CategoryItem[]>(res),
      providesTags: ["Dashboard"],
    }),

    getApplicationStatus: builder.query<
      ApplicationStatusItem[],
      { range?: DateRangeKey } | void
    >({
      query: (args) => ({
        url: "/dashboard/charts/application-status",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<ApplicationStatusItem[]>(res),
      providesTags: ["Dashboard"],
    }),

    getHiringRate: builder.query<HiringRate, { range?: DateRangeKey } | void>({
      query: (args) => ({
        url: "/dashboard/charts/hiring-rate",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<HiringRate>(res),
      providesTags: ["Dashboard"],
    }),

    getRecruitmentFunnel: builder.query<
      RecruitmentStage[],
      { range?: DateRangeKey } | void
    >({
      query: (args) => ({
        url: "/dashboard/charts/recruitment-funnel",
        method: "GET",
        params: args ? { range: args.range } : undefined,
      }),
      transformResponse: (res: any) => unwrap<RecruitmentStage[]>(res),
      providesTags: ["Dashboard"],
    }),

    getSalaryBenchmarks: builder.query<SalaryBenchmark[], void>({
      query: () => ({
        url: "/dashboard/charts/salary-benchmarks",
        method: "GET",
      }),
      transformResponse: (res: any) => unwrap<SalaryBenchmark[]>(res),
      providesTags: ["Dashboard"],
    }),

    getRecentJobs: builder.query<
      RecentJobRow[],
      { range?: DateRangeKey; limit?: number } | void
    >({
      query: (args) => ({
        url: "/dashboard/tables/recent-jobs",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<RecentJobRow[]>(res),
      providesTags: ["Dashboard"],
    }),

    getTopCandidates: builder.query<
      TopCandidateRow[],
      { range?: DateRangeKey; limit?: number } | void
    >({
      query: (args) => ({
        url: "/dashboard/tables/top-candidates",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<TopCandidateRow[]>(res),
      providesTags: ["Dashboard"],
    }),

    getJobsWithApplicants: builder.query<
      JobApplicantsBlock[],
      { range?: DateRangeKey; limit?: number } | void
    >({
      query: (args) => ({
        url: "/dashboard/tables/jobs-with-applicants",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<JobApplicantsBlock[]>(res),
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
  useGetJobsByCategoryQuery,
  useGetApplicationStatusQuery,
  useGetHiringRateQuery,
  useGetRecruitmentFunnelQuery,
  useGetSalaryBenchmarksQuery,
  useGetRecentJobsQuery,
  useGetTopCandidatesQuery,
  useGetJobsWithApplicantsQuery,
} = dashboardApi;
