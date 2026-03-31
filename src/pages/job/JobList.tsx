import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Popconfirm, Tag } from "antd";
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
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import JobModal, { type Job } from "../../Components/modal/job/JobModal";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";

// Mock Data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "Kajlagbe Ltd.",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    category: "Technology",
    subCategory: "Frontend Developer",
    salaryMin: "50000",
    salaryMax: "80000",
    experience: "3-5 Years",
    deadline: "31-03-2026",
    description: "We are looking for a skilled React developer...",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Redux"],
    isRemote: false,
    isUrgent: true,
    status: true,
    createdAt: "01-03-2026",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "TechBridge BD",
    location: "Chittagong, Bangladesh",
    type: "Full-time",
    category: "Technology",
    subCategory: "Full Stack Developer",
    salaryMin: "60000",
    salaryMax: "100000",
    experience: "5-8 Years",
    deadline: "15-04-2026",
    description: "Full stack role with React and Node.js focus...",
    skills: ["React.js", "Node.js", "MongoDB", "AWS"],
    isRemote: true,
    isUrgent: false,
    status: true,
    createdAt: "02-03-2026",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Creative Minds Co.",
    location: "Dhaka, Bangladesh",
    type: "Contract",
    category: "Design",
    subCategory: "UI/UX Designer",
    salaryMin: "30000",
    salaryMax: "50000",
    experience: "1-2 Years",
    deadline: "20-04-2026",
    description: "Design beautiful user experiences for our products...",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    isRemote: true,
    isUrgent: false,
    status: true,
    createdAt: "05-03-2026",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudSys Technologies",
    location: "Remote",
    type: "Full-time",
    category: "Technology",
    subCategory: "DevOps Engineer",
    salaryMin: "70000",
    salaryMax: "120000",
    experience: "5-8 Years",
    deadline: "10-04-2026",
    description: "Manage CI/CD pipelines and cloud infrastructure...",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    isRemote: true,
    isUrgent: true,
    status: false,
    createdAt: "06-03-2026",
  },
];

// Column definitions used by FilterColumn (key must match column key in the columns array)
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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Job | null>(null);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: Job) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: checked } : j)),
    );
  };

  const handleSubmit = (values: Omit<Job, "id" | "createdAt">) => {
    if (editData) {
      setJobs((prev) =>
        prev.map((j) => (j.id === editData.id ? { ...j, ...values } : j)),
      );
    } else {
      const newJob: Job = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setJobs((prev) => [newJob, ...prev]);
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
      width: 110,
      render: (_: unknown, record: Job) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Job Post">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleEdit(record)}
              icon={
                <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
              }
            />
          </Tooltip>

          <Popconfirm
            title="Delete Job Post"
            description="Are you sure you want to delete this job?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Job Post">
              <CustomButton
                variant="danger-outline"
                size="icon-sm"
                icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
              />
            </Tooltip>
          </Popconfirm>
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
      render: (title: string, record: Job) => (
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
        <span className="font-semibold text-gray-700 text-sm">{company}</span>
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
          {type}
        </Tag>
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (category: string, record: Job) => (
        <div>
          <span className="font-semibold text-gray-700 text-sm">
            {category}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">{record.subCategory}</p>
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
      render: (_: unknown, record: Job) => (
        <div>
          <span className="font-bold text-emerald-600 text-sm">
            ৳{Number(record.salaryMin).toLocaleString()}
          </span>
          <span className="text-gray-400 text-xs"> – </span>
          <span className="font-bold text-emerald-600 text-sm">
            ৳{Number(record.salaryMax).toLocaleString()}
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
          {skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
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
        <span className="text-gray-600 font-medium text-sm">{deadline}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Job) => (
        <CustomSwitch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
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
            >
              Refresh
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={handleCreate}
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              Post Job
            </CustomButton>
          </div>
        }
      />

      <div>
        {/* Toolbar */}
        <div className="flex justify-end mb-3">
          <FilterColumn
            tableName="job_list"
            columns={filterableColumns}
            onChangeSelectedKeys={setVisibleColumnKeys}
          />
        </div>

        <DataTable
          data={jobs}
          columns={visibleColumns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
        />
      </div>

      <JobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default JobList;
