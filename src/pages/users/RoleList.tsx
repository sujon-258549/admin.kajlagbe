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
import RoleModal from "../../Components/modal/users/RoleModal";

const RoleList = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock Roles Data
  const [roles, setRoles] = useState([
    {
      _id: "1",
      name: "Admin",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "2",
      name: "Manager",
      status: "Active",
      createdAt: "15-02-2026",
    },
    {
      _id: "3",
      name: "Employee",
      status: "Active",
      createdAt: "15-02-2026",
    },
  ]);

  const handleCreate = () => {
    setEditData(null);
    setRoleModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setRoleModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((d) => d._id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setRoles((prev) =>
      prev.map((d) =>
        d._id === id ? { ...d, status: checked ? "Active" : "Inactive" } : d,
      ),
    );
  };

  const handleSubmitRole = (values: any) => {
    if (editData) {
      setRoles((prev) =>
        prev.map((d) => (d._id === editData._id ? { ...d, ...values } : d)),
      );
    } else {
      const newRole = {
        _id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setRoles((prev) => [newRole, ...prev]);
    }
  };

  const roleColumns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Tooltip title="Edit Role">
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
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Role">
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
          <span>ROLE NAME</span>
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
          { label: "Roles" },
        ]}
        title="Roles"
        subTitle="Manage system roles and their configurations"
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
              Add New Role
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={roles}
          columns={roleColumns}
          isPaginate={true}
          showHeader={true}
        />
      </div>

      {/* Role Modal */}
      <RoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleSubmitRole}
        editData={editData}
      />
    </div>
  );
};

export default RoleList;
