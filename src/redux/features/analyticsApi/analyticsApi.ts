import { baseApi } from "../../api/baseApi";
import type { DateRangeKey } from "../dashboardApi/dashboardApi";

export interface TrafficStats {
  range: { from: string; to: string; label: string };
  pageViews: number;
  sessions: number;
  uniqueUsers: number;
  deltas: { pageViews: number; sessions: number; uniqueUsers: number };
  previous: { pageViews: number; sessions: number; uniqueUsers: number };
}

export interface TrafficPoint {
  key: string;
  label: string;
  pageViews: number;
  sessions: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface ReferrerItem {
  referrer: string;
  views: number;
}

export interface LiveSnapshot {
  live: number;
}

export interface TrackPayload {
  sessionId: string;
  path: string;
  fullUrl?: string;
  title?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  durationMs?: number;
  source?: string;
}

const unwrap = <T>(res: any): T => (res?.data ?? res) as T;

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackPageView: builder.mutation<unknown, TrackPayload>({
      query: (body) => ({
        url: "/analytics/track",
        method: "POST",
        body,
      }),
    }),

    getTrafficStats: builder.query<
      TrafficStats,
      { range?: DateRangeKey; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/traffic",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<TrafficStats>(res),
      providesTags: ["Analytics"],
    }),

    getTrafficTimeseries: builder.query<
      TrafficPoint[],
      { range?: DateRangeKey; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/timeseries",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<TrafficPoint[]>(res),
      providesTags: ["Analytics"],
    }),

    getTopPages: builder.query<
      TopPage[],
      { range?: DateRangeKey; limit?: number; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/top-pages",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<TopPage[]>(res),
      providesTags: ["Analytics"],
    }),

    getGeoBreakdown: builder.query<
      BreakdownItem[],
      { range?: DateRangeKey; limit?: number; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/geo",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<BreakdownItem[]>(res),
      providesTags: ["Analytics"],
    }),

    getDeviceBreakdown: builder.query<
      BreakdownItem[],
      { range?: DateRangeKey; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/devices",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<BreakdownItem[]>(res),
      providesTags: ["Analytics"],
    }),

    getBrowserBreakdown: builder.query<
      BreakdownItem[],
      { range?: DateRangeKey; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/browsers",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<BreakdownItem[]>(res),
      providesTags: ["Analytics"],
    }),

    getReferrers: builder.query<
      ReferrerItem[],
      { range?: DateRangeKey; limit?: number; source?: string } | void
    >({
      query: (args) => ({
        url: "/analytics/referrers",
        method: "GET",
        params: args || undefined,
      }),
      transformResponse: (res: any) => unwrap<ReferrerItem[]>(res),
      providesTags: ["Analytics"],
    }),

    getLiveSnapshot: builder.query<LiveSnapshot, void>({
      query: () => ({ url: "/analytics/live", method: "GET" }),
      transformResponse: (res: any) => unwrap<LiveSnapshot>(res),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useTrackPageViewMutation,
  useGetTrafficStatsQuery,
  useGetTrafficTimeseriesQuery,
  useGetTopPagesQuery,
  useGetGeoBreakdownQuery,
  useGetDeviceBreakdownQuery,
  useGetBrowserBreakdownQuery,
  useGetReferrersQuery,
  useGetLiveSnapshotQuery,
} = analyticsApi;
