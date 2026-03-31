import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faSearch,
  faFilter,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import DepartmentModal from "../../Components/modal/users/DepartmentModal";

const DepartmentList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock Departments Data
  const [departments, setDepartments] = useState([
    {
      _id: "1",
      name: "Engineering",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "2",
      name: "Design",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "3",
      name: "Marketing",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "4",
      name: "HR",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "5",
      name: "Finance",
      status: "Active",
      createdAt: "15-02-2026",
    },
  ]);

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDepartments((prev: any) => prev.filter((d: any) => d._id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setDepartments((prev: any) =>
      prev.map((d: any) =>
        d._id === id ? { ...d, status: checked ? "Active" : "Inactive" } : d,
      ),
    );
  };

  const handleSubmit = (values: any) => {
    if (editData) {
      setDepartments((prev: any) =>
        prev.map((d: any) =>
          d._id === editData._id ? { ...d, ...values } : d,
        ),
      );
    } else {
      const newDept = {
        _id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setDepartments((prev: any) => [newDept, ...prev]);
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Tooltip title="Edit Department">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleEdit(record)}
              icon={
                <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
              }
            />
          </Tooltip>

          {/* Delete */}
          <Popconfirm
            title="Delete Department"
            description="Are you sure you want to delete this department?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Department">
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
          <span>DEPARTMENT NAME</span>
          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>STATUS</span>
          <FontAwesomeIcon icon={faFilter} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            checked={status === "Active"}
            onChange={(checked: boolean) =>
              handleStatusChange(record._id, checked)
            }
            size="default"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>CREATED AT</span>
          <FontAwesomeIcon icon={faSort} className="text-primary text-xs" />
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-600 font-medium">{date}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "User Management" },
          { label: "Departments" },
        ]}
        title="Departments"
        subTitle="Manage company departments and their status"
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
              Add Department
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={departments}
          columns={columns}
          isPaginate={true}
          showHeader={true}
        />
      </div>

      <DepartmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default DepartmentList;
