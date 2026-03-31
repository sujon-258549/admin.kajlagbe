import React, { useMemo } from "react";
import { Tag } from "antd";
import DataTable from "../../Tables/DataTable";
import type { FilterType } from "../../filter/DateFilter";

interface RecentJobsTableProps {
  externalFilter?: FilterType;
}

const RecentJobsTable: React.FC<RecentJobsTableProps> = ({
  externalFilter,
}) => {
  const allJobData = [
    {
      _id: "1",
      title: "Senior UI Designer",
      category: "Design",
      apps: 45,
      status: "Active",
      period: "this-week",
    },
    {
      _id: "2",
      title: "Full Stack Developer",
      category: "IT",
      apps: 120,
      status: "Active",
      period: "this-week",
    },
    {
      _id: "3",
      title: "Marketing Manager",
      category: "Marketing",
      apps: 32,
      status: "Closed",
      period: "this-month",
    },
    {
      _id: "4",
      title: "Data Analyst",
      category: "Data Science",
      apps: 88,
      status: "Active",
      period: "this-month",
    },
    {
      _id: "5",
      title: "Product Manager",
      category: "Product",
      apps: 15,
      status: "Active",
      period: "this-year",
    },
    {
      _id: "6",
      title: "QA Engineer",
      category: "Testing",
      apps: 24,
      status: "Active",
      period: "this-week",
    },
  ];

  const filteredData = useMemo(() => {
    if (!externalFilter || externalFilter === "this-week") {
      return allJobData.filter((item) => item.period === "this-week");
    }
    if (externalFilter === "this-month") {
      return allJobData.filter(
        (item) => item.period === "this-month" || item.period === "this-week",
      );
    }
    return allJobData; // Show all for other filters
  }, [externalFilter]);

  const columns = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
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
      <DataTable
        data={filteredData}
        columns={columns}
        isPaginate={false}
        showHeader={true}
      />
    </div>
  );
};

export default RecentJobsTable;
