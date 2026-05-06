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
  faBriefcase,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import type { TJob } from "../../Components/types";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";
import { useJob } from "../../apihooks/useJob";
import { toast } from "sonner";
import TakaIcon from "../../Components/ui/TakaIcon";
import PageListPrint from "../../Components/common/PageListPrint";
import { useRoutePermission } from "../../utils/buttonPurmission";

// Column definitions used by FilterColumn
const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "thumbnail", title: "Thumbnail" },
  { key: "title", title: "Job Title" },
  { key: "company", title: "Company" },
  { key: "type", title: "Type" },
  { key: "category", title: "Category" },
  { key: "salary", title: "Salary" },
  { key: "skills", title: "Skills" },
  { key: "deadline", title: "Deadline" },
  { key: "applicantsCount", title: "Applicants Count" },
  { key: "status", title: "Status" },
];

const JobList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const { can } = useRoutePermission();
  const navigate = useNavigate();
  
  const queryObj = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
  };
  const {
    jobs,
    meta,
    isLoading,
    refetch,
    deleteJob,
    changeStatus,
  } = useJob(queryObj);

  console.log("Jobs data:", jobs);

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
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/details/${record.id}`);
                }}
                icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
              />
            </Tooltip>
          )}

          <Tooltip title="View Applications">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/job/applications/${record.id}`);
              }}
              icon={<FontAwesomeIcon icon={faUsers} className="text-xs" />}
            />
          </Tooltip>

          {can("update") && (
            <Tooltip title="Edit Job Post">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record.id);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
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
      title: "THUMBNAIL",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      render: (thumbnail: any) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {thumbnail?.url ? (
            <img
              src={thumbnail.url}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faBriefcase} className="text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: "Applicants Count",
      dataIndex: "applicantsCount",
      key: "applicantsCount",
      width: 120,
      render: (count: number) => (
        <Tag
          color="blue"
          className="m-0 rounded-full font-bold border-none bg-blue-50 text-blue-600"
        >
          {count || 0}
        </Tag>
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
        <div className="whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Tooltip title={title}>
              <span className="font-bold text-gray-800 text-sm line-clamp-1 truncate max-w-[150px]">
                {title}
              </span>
            </Tooltip>
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
            <Tooltip title={record.location}>
              <span className="text-xs text-gray-500 line-clamp-1 truncate max-w-[120px]">
                {record.location}
              </span>
            </Tooltip>
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
        <Tooltip title={company || "N/A"}>
          <span className="font-semibold text-gray-700 text-sm whitespace-nowrap truncate max-w-[120px] block">
            {company || "N/A"}
          </span>
        </Tooltip>
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
      render: (category: any, record: any) => {
        const catName = category?.name || record.categoryName || "N/A";
        const subCatName = record.subCategory?.name || "N/A";
        return (
          <div className="whitespace-nowrap">
            <Tooltip title={catName}>
              <span className="font-semibold text-gray-700 text-sm block truncate max-w-[120px]">
                {catName}
              </span>
            </Tooltip>
            <Tooltip title={subCatName}>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[120px]">
                {subCatName}
              </p>
            </Tooltip>
          </div>
        );
      },
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
        <div className="whitespace-nowrap">
          <span className="font-bold text-emerald-600 text-sm">
            <TakaIcon />{Number(record.salaryMin || 0).toLocaleString()}
          </span>
          <span className="text-gray-400 text-xs"> – </span>
          <span className="font-bold text-emerald-600 text-sm">
            <TakaIcon />{Number(record.salaryMax || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      title: "SKILLS",
      dataIndex: "skills",
      key: "skills",
      render: (skills: string[]) => {
        if (!skills || skills.length === 0) return <span className="text-gray-400">-</span>;
        return (
          <Tooltip
            title={
              <div className="flex flex-wrap gap-1 py-1">
                {(skills || []).map((skill, i) => (
                  <Tag
                    key={i}
                    color="blue"
                    className="text-[10px] m-0 border-none font-medium"
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            }
          >
            <div className="flex items-center gap-1 flex-nowrap overflow-hidden max-w-[160px]">
              {(skills || []).slice(0, 2).map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                >
                  {skill}
                </span>
              ))}
              {(skills || []).length > 2 && (
                <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer flex-shrink-0 border border-dashed border-primary/30">
                  +{skills.length - 2}
                </span>
              )}
            </div>
          </Tooltip>
        );
      },
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
        <span className="text-gray-600 font-medium text-sm whitespace-nowrap">{deadline || "No Limit"}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: TJob) => (
        <div onClick={(e) => e.stopPropagation()}>
          <CustomSwitch
            disabled={!can("update")}
            checked={status}
            onChange={() => handleStatusChange(record.id)}
            size="default"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </div>
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
            <PageListPrint 
              tableData={jobs?.map((job: any) => ({
                Title: job.title,
                Company: job.company,
                Type: job.type,
                Category: job.categoryName,
                Salary: `${job.salaryMin} - ${job.salaryMax}`,
                Deadline: job.deadline,
                Status: job.status ? "Active" : "Inactive"
              }))}
              fileName="job-list"
            />
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
          selectRow={true}
          data={jobs}
          isLoading={isLoading}
          columns={visibleColumns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
          meta={meta}
          total={meta?.total || 0}
          limit={limit}
          currentPage={page}
          setCurrentPage={setPage}
          setLimit={setLimit}
          showSizeChanger={true}
          clearSelectionTrigger={selectedRowIds.length === 0}
          onSelectRowsChange={(selectedRows: any[]) => {
            setSelectedRowIds(selectedRows.map((row) => row.id));
          }}
          onRow={(record: TJob) => ({
            onClick: () => navigate(`/job/details/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default JobList;
