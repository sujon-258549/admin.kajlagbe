import { useState } from "react";
import {
  faBriefcase,
  faUsers,
  faUserCheck,
  faFileLines,
  faArrowTrendUp,
  faBuilding,
  faUserPlus,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

// Import 6 Modern Charts
import JobApplicationsChart from "../charts/dashboard/RevenueChart";
import HiringStatChart from "../charts/dashboard/OrdersChart";
import JobCategoryChart from "../charts/dashboard/UserActivityChart";
import InterviewSuccessChart from "../charts/dashboard/InterviewSuccessChart";
import RecruitmentFunnelChart from "../charts/dashboard/RecruitmentFunnelChart";
import SalaryBenchmarksChart from "../charts/dashboard/SalaryBenchmarksChart";
import DateFilter, { type FilterType } from "../filter/DateFilter";
import StatCard from "../card/StatCard";

// New Table Components
import RecentJobsTable from "./tables/RecentJobsTable";
import TopCandidatesTable from "./tables/TopCandidatesTable";
import RecentActivity from "./tables/RecentActivity";
import JobApplicationsOverview from "./tables/JobApplicationsOverview";

const Dashboard = () => {
  const [globalFilter, setGlobalFilter] = useState<FilterType>("this-week");

  const handleGlobalFilterChange = (
    type: FilterType,
    range: [string, string],
  ) => {
    setGlobalFilter(type);
    console.log("Global Dashboard Filter:", type, range);
  };

  const stats = [
    {
      label: "Total Jobs",
      value: "4,250",
      icon: faBriefcase,
      color: "#6366f1", // Indigo
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Applications",
      value: "18,245",
      icon: faFileLines,
      color: "#059669", // Emerald
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Active Users",
      value: "2,840",
      icon: faUsers,
      color: "#f59e0b", // Amber
      trend: "+5.4%",
      trendUp: true,
    },
    {
      label: "Shortlisted",
      value: "1,250",
      icon: faUserCheck,
      color: "#8b5cf6", // Violet
      trend: "+4.1%",
      trendUp: true,
    },
    {
      label: "Remote Jobs",
      value: "854",
      icon: faBuilding,
      color: "#0ea5e9", // Sky
      trend: "+10.2%",
      trendUp: true,
    },
    {
      label: "Hired Cases",
      value: "420",
      icon: faCircleCheck,
      color: "#f43f5e", // Rose
      trend: "+14.3%",
      trendUp: true,
    },
    {
      label: "New Talents",
      value: "125",
      icon: faUserPlus,
      color: "#2dd4bf", // Teal
      trend: "+15.7%",
      trendUp: true,
    },
    {
      label: "Growth",
      value: "88%",
      icon: faArrowTrendUp,
      color: "#ec4899", // Pink
      trend: "+2.5%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Job Portal Analytics
          </h2>
          <p className="text-base text-gray-500 mt-1">
            Comprehensive recruitment life-cycle monitoring.
          </p>
        </div>
        <div className=" ">
          <DateFilter
            onFilterChange={handleGlobalFilterChange}
            activeFilter={globalFilter}
          />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            color={stat.color}
            period={
              globalFilter === "this-week"
                ? "This Week"
                : globalFilter === "this-month"
                  ? "This Month"
                  : globalFilter === "this-year"
                    ? "This Year"
                    : "This Period"
            }
          />
        ))}
      </div>

      {/* Charts Section - 6 Charts */}
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

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 -mt-11">
        <RecentJobsTable externalFilter={globalFilter} />
        <TopCandidatesTable externalFilter={globalFilter} />
      </div>

      {/* Bottom Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-20">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <JobApplicationsOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
