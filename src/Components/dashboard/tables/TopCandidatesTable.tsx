import React from "react";
import { Tag, Avatar } from "antd";
import DataTable from "../../Tables/DataTable";
import type { FilterType } from "../../types";
import { useGetTopCandidatesQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

interface TopCandidatesTableProps {
  externalFilter?: FilterType;
}

const TopCandidatesTable: React.FC<TopCandidatesTableProps> = ({
  externalFilter,
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetTopCandidatesQuery({ range, limit: 6 });

  const rows =
    data?.map((c) => ({
      _id: c.id,
      name: c.name,
      photo: c.photo,
      job: c.job,
      stage: c.stage,
    })) ?? [];

  const columns = [
    {
      title: "Candidate",
      dataIndex: "name",
      key: "name",
      render: (text: string, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="small"
            src={row.photo || `https://i.pravatar.cc/150?u=${text}`}
            alt={text}
          />
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      ),
    },
    { title: "Applied Job", dataIndex: "job", key: "job" },
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
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">No candidates in this period.</p>
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

export default TopCandidatesTable;
