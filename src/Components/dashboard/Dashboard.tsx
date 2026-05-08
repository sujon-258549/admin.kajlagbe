import {
  faBriefcase,
  faUsers,
  faUserCheck,
  faFileLines,
  faArrowTrendUp,
  faBuilding,
  faCircleCheck,
  faEye,
  faGlobe,
  faSignal,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import JobApplicationsChart from "../charts/dashboard/RevenueChart";
import HiringStatChart from "../charts/dashboard/OrdersChart";
import JobCategoryChart from "../charts/dashboard/UserActivityChart";
import InterviewSuccessChart from "../charts/dashboard/InterviewSuccessChart";
import RecruitmentFunnelChart from "../charts/dashboard/RecruitmentFunnelChart";
import SalaryBenchmarksChart from "../charts/dashboard/SalaryBenchmarksChart";
import DateFilter from "../filter/DateFilter";
import type { FilterType } from "../types";
import { useEffect, useState } from "react";
import StatCard from "../card/StatCard";

import RecentJobsTable from "./tables/RecentJobsTable";
import TopCandidatesTable from "./tables/TopCandidatesTable";
import RecentActivity from "./tables/RecentActivity";
import JobApplicationsOverview from "./tables/JobApplicationsOverview";

import { useSocket } from "../../context/SocketContext";
import {
  useGetAdminKpisQuery,
  useGetOnlineSnapshotQuery,
} from "../../redux/features/dashboardApi/dashboardApi";
import { useGetTrafficStatsQuery } from "../../redux/features/analyticsApi/analyticsApi";
import { filterLabel, filterToRange } from "../../utils/dateRange";

const numberFmt = (n: number | undefined) => {
  if (n === undefined || n === null || Number.isNaN(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const trendStr = (n: number | undefined) => {
  if (n === undefined || n === null || Number.isNaN(n)) return "0%";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
};

const Dashboard = () => {
  const [globalFilter, setGlobalFilter] = useState<FilterType>("this-week");
  const range = filterToRange(globalFilter);
  const periodLabel = filterLabel(globalFilter);

  const {
    data: kpis,
    isLoading: kpisLoading,
    refetch: refetchKpis,
  } = useGetAdminKpisQuery({ range });
  const {
    data: traffic,
    isLoading: trafficLoading,
    refetch: refetchTraffic,
  } = useGetTrafficStatsQuery({ range, source: "admin" });
  const { data: live, refetch: refetchLive } = useGetOnlineSnapshotQuery();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const reload = () => {
      refetchLive();
      refetchKpis();
      refetchTraffic();
    };
    socket.on("user-status-change", reload);
    socket.on("new-notification", reload);
    return () => {
      socket.off("user-status-change", reload);
      socket.off("new-notification", reload);
    };
  }, [socket, refetchLive, refetchKpis, refetchTraffic]);

  const handleGlobalFilterChange = (type: FilterType) => {
    setGlobalFilter(type);
  };

  type Stat = {
    label: string;
    value: string;
    icon: IconDefinition;
    color: string;
    trend: string;
    trendUp: boolean;
  };

  const isLoading = kpisLoading || trafficLoading;

  const stats: Stat[] = [
    {
      label: "Page Views",
      value: numberFmt(traffic?.pageViews),
      icon: faEye,
      color: "#0ea5e9",
      trend: trendStr(traffic?.deltas?.pageViews),
      trendUp: (traffic?.deltas?.pageViews ?? 0) >= 0,
    },
    {
      label: "Total Traffic",
      value: numberFmt(traffic?.sessions),
      icon: faGlobe,
      color: "#6366f1",
      trend: trendStr(traffic?.deltas?.sessions),
      trendUp: (traffic?.deltas?.sessions ?? 0) >= 0,
    },
    {
      label: "Unique Visitors",
      value: numberFmt(traffic?.uniqueUsers),
      icon: faUsers,
      color: "#8b5cf6",
      trend: trendStr(traffic?.deltas?.uniqueUsers),
      trendUp: (traffic?.deltas?.uniqueUsers ?? 0) >= 0,
    },
    {
      label: "Online Now",
      value: String(live?.onlineUsers ?? 0),
      icon: faSignal,
      color: "#10b981",
      trend: `${live?.liveSessions ?? 0} live`,
      trendUp: true,
    },
    {
      label: "New Users",
      value: numberFmt(kpis?.current.users),
      icon: faUserCheck,
      color: "#f59e0b",
      trend: trendStr(kpis?.deltas?.users),
      trendUp: (kpis?.deltas?.users ?? 0) >= 0,
    },
    {
      label: "Jobs Posted",
      value: numberFmt(kpis?.current.jobs),
      icon: faBriefcase,
      color: "#ec4899",
      trend: trendStr(kpis?.deltas?.jobs),
      trendUp: (kpis?.deltas?.jobs ?? 0) >= 0,
    },
    {
      label: "Applications",
      value: numberFmt(kpis?.current.applications),
      icon: faFileLines,
      color: "#059669",
      trend: trendStr(kpis?.deltas?.applications),
      trendUp: (kpis?.deltas?.applications ?? 0) >= 0,
    },
    {
      label: "Hired",
      value: numberFmt(kpis?.current.acceptedApplications),
      icon: faCircleCheck,
      color: "#f43f5e",
      trend: trendStr(kpis?.deltas?.acceptedApplications),
      trendUp: (kpis?.deltas?.acceptedApplications ?? 0) >= 0,
    },
    {
      label: "Active Jobs",
      value: numberFmt(kpis?.current.activeJobs),
      icon: faBuilding,
      color: "#2dd4bf",
      trend: trendStr(kpis?.deltas?.activeJobs),
      trendUp: (kpis?.deltas?.activeJobs ?? 0) >= 0,
    },
    {
      label: "Blogs",
      value: numberFmt(kpis?.current.blogs),
      icon: faArrowTrendUp,
      color: "#a855f7",
      trend: trendStr(kpis?.deltas?.blogs),
      trendUp: (kpis?.deltas?.blogs ?? 0) >= 0,
    },
    {
      label: "Contacts",
      value: numberFmt(kpis?.current.contacts),
      icon: faComments,
      color: "#fb923c",
      trend: trendStr(kpis?.deltas?.contacts),
      trendUp: (kpis?.deltas?.contacts ?? 0) >= 0,
    },
    {
      label: "Total Users",
      value: numberFmt(kpis?.totals?.totalUsers),
      icon: faUsers,
      color: "#475569",
      trend: "All time",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-base text-gray-500 mt-1">
            Real-time platform analytics, traffic, and recruitment insights.
          </p>
        </div>
        <DateFilter
          onFilterChange={handleGlobalFilterChange}
          activeFilter={globalFilter}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.label}
            value={isLoading ? "…" : stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            color={stat.color}
            period={periodLabel}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        <div className="md:col-span-2">
          <JobApplicationsChart externalFilter={globalFilter} />
        </div>
        <div>
          <JobCategoryChart externalFilter={globalFilter} />
        </div>
        <div>
          <RecruitmentFunnelChart externalFilter={globalFilter} />
        </div>
        <div>
          <InterviewSuccessChart externalFilter={globalFilter} />
        </div>
        <div>
          <SalaryBenchmarksChart externalFilter={globalFilter} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <HiringStatChart externalFilter={globalFilter} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 -mt-11">
        <RecentJobsTable externalFilter={globalFilter} />
        <TopCandidatesTable externalFilter={globalFilter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-20">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <JobApplicationsOverview externalFilter={globalFilter} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
