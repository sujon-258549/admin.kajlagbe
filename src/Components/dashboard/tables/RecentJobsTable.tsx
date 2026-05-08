import React from "react";
import { Tag } from "antd";
import DataTable from "../../Tables/DataTable";
import type { FilterType } from "../../types";
import { useGetRecentJobsQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

interface RecentJobsTableProps {
  externalFilter?: FilterType;
}

const RecentJobsTable: React.FC<RecentJobsTableProps> = ({
  externalFilter,
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetRecentJobsQuery({ range, limit: 6 });

  const rows =
    data?.map((j) => ({
      _id: j.id,
      title: j.title,
      category: j.category,
      apps: j.apps,
      status: j.status,
    })) ?? [];

  const columns = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Applications",
      dataIndex: "apps",
      key: "apps",
      render: (val: number) => (
        <span className="font-bold text-indigo-600">{val}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "Active" ? "green" : "orange"}
          bordered={false}
          className="rounded-full px-3"
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Job Postings</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All
        </button>
      </div>
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">No jobs in this period.</p>
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          isPaginate={false}
          showHeader={true}
        />
      )}
    </div>
  );
};

export default RecentJobsTable;
