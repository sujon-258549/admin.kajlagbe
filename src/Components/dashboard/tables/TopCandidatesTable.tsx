import React, { useMemo } from "react";
import { Tag, Avatar } from "antd";
import DataTable from "../../Tables/DataTable";
import type { FilterType } from "../../filter/DateFilter";

interface TopCandidatesTableProps {
  externalFilter?: FilterType;
}

const TopCandidatesTable: React.FC<TopCandidatesTableProps> = ({
  externalFilter,
}) => {
  const allCandidateData = [
    {
      _id: "1",
      name: "Sujon Ahmed",
      job: "UI Designer",
      score: 95,
      stage: "Interview",
      period: "this-week",
    },
    {
      _id: "2",
      name: "Jane Doe",
      job: "Full Stack",
      score: 88,
      stage: "Shortlisted",
      period: "this-week",
    },
    {
      _id: "3",
      name: "Alex Hunter",
      job: "Developer",
      score: 92,
      stage: "Assessment",
      period: "this-month",
    },
    {
      _id: "4",
      name: "Michael Ross",
      job: "Lawyer",
      score: 85,
      stage: "Initial Call",
      period: "this-month",
    },
    {
      _id: "5",
      name: "Sarah Connor",
      job: "Data Scientist",
      score: 98,
      stage: "Offer",
      period: "this-year",
    },
    {
      _id: "6",
      name: "John Wick",
      job: "Security",
      score: 100,
      stage: "Hired",
      period: "this-week",
    },
  ];

  const filteredData = useMemo(() => {
    if (!externalFilter || externalFilter === "this-week") {
      return allCandidateData.filter((item) => item.period === "this-week");
    }
    if (externalFilter === "this-month") {
      return allCandidateData.filter(
        (item) => item.period === "this-month" || item.period === "this-week",
      );
    }
    return allCandidateData;
  }, [externalFilter]);

  const columns = [
    {
      title: "Candidate",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="small"
            src={`https://i.pravatar.cc/150?u=${text}`}
            alt={text}
          />
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Applied Job",
      dataIndex: "job",
      key: "job",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (val: number) => (
        <span
          className={`font-bold ${val > 90 ? "text-emerald-500" : "text-amber-500"}`}
        >
          {val}%
        </span>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage: string) => (
        <Tag color="processing" bordered={false} className="rounded-full px-3">
          {stage}
        </Tag>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Top Candidates For Review
        </h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View CRM
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

export default TopCandidatesTable;
