import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tooltip, Modal, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faRotateRight,
  faEye,
  faTrash,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import { useApplication } from "../../apihooks/useApplication";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";
import type { TApplication } from "../../Components/types";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    jobId: jobId,
  });

  const { applications, meta, isLoading, refetch, deleteApplication } = useApplication(searchParams);

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteApplication(id).unwrap();
      if (res?.success) {
        toast.success("Application deleted successfully");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete application");
    }
  };

  const columns = [
    {
      title: "APPLICANT",
      key: "applicant",
      render: (_: any, record: TApplication) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
            {record.user?.profile?.photo ? (
              <img src={record.user.profile.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              record.user?.profile?.name?.charAt(0) || "U"
            )}
          </div>
          <div>
            <div className="font-bold text-gray-800">{record.user?.profile?.name || "Unknown User"}</div>
            <div className="text-xs text-gray-500">{record.user?.email}</div>
          </div>
        </div>
      ),
    },
    ...(!jobId ? [{
      title: "JOB",
      key: "job",
      render: (_: any, record: TApplication) => (
        <div className="font-semibold text-gray-700">{record.job?.title || "N/A"}</div>
      ),
    }] : []),
    {
      title: "APPLY DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => <span className="text-gray-600">{formatDate(date)}</span>,
    },
    {
      title: "STATUS",
      dataIndex: "applyStatus",
      key: "applyStatus",
      render: (status: string) => {
        let color = "blue";
        if (status === "ACCEPTED") color = "green";
        if (status === "REJECTED") color = "red";
        if (status === "PENDING") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "RESUME",
      dataIndex: "resume",
      key: "resume",
      render: (resume: string) => (
        resume ? (
          <a href={resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
            <span>View Resume</span>
          </a>
        ) : <span className="text-gray-400">Not provided</span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 120,
      render: (_: any, record: TApplication) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => navigate(`/job/application-details/${record.id}`)}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <CustomButton
              variant="danger-outline"
              size="icon-sm"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Application",
                  content: "Are you sure you want to delete this application?",
                  okText: "Delete",
                  okType: "danger",
                  onOk: () => handleDelete(record.id),
                });
              }}
              icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Jobs", path: "/job/list" },
          { label: "Applications" },
        ]}
        title="Job Applications"
        extra={
          <div className="flex items-center gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              icon={<FontAwesomeIcon icon={faRotateRight} />}
            >
              Refresh
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={() => navigate("/job/list")}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back to Jobs
            </CustomButton>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable
          columns={columns}
          data={applications}
          loading={isLoading}
          pagination={{
            current: meta?.page || 1,
            pageSize: meta?.limit || 10,
            total: meta?.total || 0,
            onChange: (page: number, limit: number) => setSearchParams({ ...searchParams, page, limit }),
          }}
        />
      </div>
    </div>
  );
};

export default JobApplications;
