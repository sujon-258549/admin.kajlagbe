import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faShieldAlt,
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
import DesignationModal from "../../Components/modal/users/DesignationModal";
import PermissionModal from "../../Components/modal/users/PermissionModal";

const RolesPermissions = () => {
  const [designationModalOpen, setDesignationModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);

  // Mock Designations Data
  const [designations, setDesignations] = useState([
    {
      _id: "1",
      name: "Production Manager",
      role: "Manager",
      employees: 2,
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "2",
      name: "Team Lead - OTM",
      role: "Manager",
      employees: 0,
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "3",
      name: "OTM",
      role: "Employee",
      employees: 0,
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "4",
      name: "Team Lead - CRM",
      role: "Manager",
      employees: 0,
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "5",
      name: "Production",
      role: "Employee",
      employees: 0,
      status: "Active",
      createdAt: "15-02-2026",
    },
  ]);

  const handleCreate = () => {
    setEditData(null);
    setDesignationModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setDesignationModalOpen(true);
  };

  const handleManagePermissions = (record: any) => {
    setSelectedDesignation(record);
    setPermissionModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDesignations((prev) => prev.filter((d) => d._id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setDesignations((prev) =>
      prev.map((d) =>
        d._id === id ? { ...d, status: checked ? "Active" : "Inactive" } : d,
      ),
    );
  };

  const handleSubmitDesignation = (values: any) => {
    if (editData) {
      setDesignations((prev) =>
        prev.map((d) => (d._id === editData._id ? { ...d, ...values } : d)),
      );
    } else {
      const newDesignation = {
        _id: Date.now().toString(),
        ...values,
        employees: 0,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setDesignations((prev) => [newDesignation, ...prev]);
    }
  };

  const designationColumns = [
    {
      title: "ACTION",
      key: "action",
      width: 130,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {/* Permissions */}
          <Tooltip title="Manage Permissions">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleManagePermissions(record)}
              icon={<FontAwesomeIcon icon={faShieldAlt} className="text-xs" />}
            />
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit Designation">
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
            title="Delete Designation"
            description="Are you sure you want to delete this designation?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Designation">
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
          <span>NAME</span>
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
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="text-sm font-medium text-gray-600">{role}</span>
      ),
    },
    {
      title: "TOTAL EMPLOYEES",
      dataIndex: "employees",
      key: "employees",
      render: (count: number) => (
        <span
          className={`font-bold ${count > 0 ? "text-emerald-600" : "text-gray-400"}`}
        >
          {count}
        </span>
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
            onChange={(checked) => handleStatusChange(record._id, checked)}
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
          { label: "Designations" },
        ]}
        title="Designations"
        subTitle="Manage job titles and assign specific system permissions"
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
              Add New
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={designations}
          columns={designationColumns}
          isPaginate={true}
          showHeader={true}
        />
      </div>

      {/* Designation Modal */}
      <DesignationModal
        open={designationModalOpen}
        onClose={() => setDesignationModalOpen(false)}
        onSubmit={handleSubmitDesignation}
        editData={editData}
      />

      {/* Permission Modal */}
      <PermissionModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        designationName={selectedDesignation?.name || ""}
      />
    </div>
  );
};

export default RolesPermissions;
