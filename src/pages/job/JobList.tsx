import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Modal, Tag } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faSearch,
  faFilter,
  faSort,
  faBolt,
  faLocationDot,
  faMoneyBillWave,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import type { TJob } from "../../Components/types";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";
import { useJob } from "../../apihooks/useJob";
import { toast } from "sonner";
import { useRoutePermission } from "../../utils/buttonPurmission";

// Column definitions used by FilterColumn
const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "title", title: "Job Title" },
  { key: "company", title: "Company" },
  { key: "type", title: "Type" },
  { key: "category", title: "Category" },
  { key: "salary", title: "Salary" },
  { key: "skills", title: "Skills" },
  { key: "deadline", title: "Deadline" },
  { key: "status", title: "Status" },
];

const JobList = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );

  const { can } = useRoutePermission();
  const navigate = useNavigate();
  
  const queryObj = searchTerm ? { searchTerm } : {};
  const {
    jobs,
    meta,
    isLoading,
    refetch,
    deleteJob,
    changeStatus,
  } = useJob(queryObj);

  const handleCreate = () => {
    navigate("/job/create");
  };

  const handleEdit = (id: string) => {
    navigate(`/job/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteJob(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Job deleted successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete job");
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res: any = await changeStatus({ id }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Status updated");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const jobTypeColorMap: Record<string, string> = {
    "Full-time": "green",
    "Part-time": "blue",
    Contract: "orange",
    Internship: "purple",
    Freelance: "cyan",
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 150,
      render: (_: unknown, record: TJob) => (
        <div className="flex items-center gap-2">
          {can("view") && (
            <Tooltip title="View Details">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(`/job/details/${record.id}`)}
                icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
              />
            </Tooltip>
          )}

          {can("update") && (
            <Tooltip title="Edit Job Post">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => handleEdit(record.id)}
                icon={
                  <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                }
              />
            </Tooltip>
          )}

          {can("delete") && (
            <Tooltip title="Delete Job Post">
              <CustomButton
                variant="danger-outline"
                size="icon-sm"
                onClick={() => {
                  Modal.confirm({
                    title: "Delete Job",
                    content: "Are you sure you want to delete this job posting?",
                    okText: "Delete",
                    okType: "danger",
                    onOk: () => handleDelete(record.id),
                  });
                }}
                icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>JOB TITLE</span>
          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "title",
      key: "title",
      render: (title: string, record: TJob) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm">{title}</span>
            {record.isUrgent && (
              <Tooltip title="Urgent Hiring">
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <FontAwesomeIcon icon={faBolt} className="text-[9px]" />
                  Urgent
                </span>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-gray-400 text-[10px]"
            />
            <span className="text-xs text-gray-500">{record.location}</span>
            {record.isRemote && (
              <Tag
                color="blue"
                className="text-[10px] px-1.5 py-0 m-0 leading-4"
              >
                Remote
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "COMPANY",
      dataIndex: "company",
      key: "company",
      render: (company: string) => (
        <span className="font-semibold text-gray-700 text-sm">{company || "N/A"}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>TYPE</span>
          <FontAwesomeIcon icon={faFilter} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={jobTypeColorMap[type] || "default"}
          className="font-medium text-xs"
        >
          {type || "Full-time"}
        </Tag>
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (category: any, record: any) => (
        <div>
          <span className="font-semibold text-gray-700 text-sm">
            {category?.name || record.categoryName || "N/A"}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">{record.subCategory?.name || "N/A"}</p>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            className="text-gray-400 text-xs"
          />
          <span>SALARY</span>
        </div>
      ),
      key: "salary",
      render: (_: unknown, record: TJob) => (
        <div>
          <span className="font-bold text-emerald-600 text-sm">
            ৳{Number(record.salaryMin || 0).toLocaleString()}
          </span>
          <span className="text-gray-400 text-xs"> – </span>
          <span className="font-bold text-emerald-600 text-sm">
            ৳{Number(record.salaryMax || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      title: "SKILLS",
      dataIndex: "skills",
      key: "skills",
      render: (skills: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {(skills || []).slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
          {(skills || []).length > 3 && (
            <Tooltip title={skills.slice(3).join(", ")}>
              <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer">
                +{skills.length - 3}
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>DEADLINE</span>
          <FontAwesomeIcon icon={faSort} className="text-primary text-xs" />
        </div>
      ),
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline: string) => (
        <span className="text-gray-600 font-medium text-sm">{deadline || "No Limit"}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: TJob) => (
        <CustomSwitch
          disabled={!can("update")}
          checked={status}
          onChange={() => handleStatusChange(record.id)}
          size="default"
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  const visibleColumns = columns.filter((col) =>
    visibleColumnKeys.includes(col.key as string),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management" },
          { label: "Job List" },
        ]}
        title="Job Postings"
        subTitle="Manage all job posts, statuses, and applications"
        extra={
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faRotateRight} />}
              onClick={() => refetch()}
            >
              Refresh
            </CustomButton>
            {can("create") && (
              <CustomButton
                variant="primary"
                size="sm"
                onClick={handleCreate}
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                Post Job
              </CustomButton>
            )}
          </div>
        }
      />

      <div>
        <div className="flex justify-end mb-3">
          <FilterColumn
            tableName="job_list"
            columns={filterableColumns}
            onChangeSelectedKeys={setVisibleColumnKeys}
          />
        </div>

        <DataTable
          data={jobs}
          isLoading={isLoading}
          columns={visibleColumns}
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          showHeader={true}
          rowKey="id"
          meta={meta}
        />
      </div>
    </div>
  );
};

export default JobList;
