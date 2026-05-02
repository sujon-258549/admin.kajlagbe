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
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import type {
  TRole,
  TRoleCreateUpdatePayload,
} from "../../Components/types";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import RoleModal from "../../Components/modal/users/RoleModal";
import PermissionModal from "../../Components/modal/users/PermissionModal";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useRole } from "../../apihooks/useRole";
import PageListPrint from "../../Components/common/PageListPrint";

const RoleList = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editData, setEditData] = useState<TRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<TRole | null>(null);

  const { can } = useRoutePermission();

  const {
    roles,
    meta,
    isLoading,
    refetch,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
  } = useRole({});

  const getRecordId = (record: { id?: string; _id?: string }) =>
    record.id || record._id || "";
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      const err = error as { data?: { message?: string }; message?: string };
      return err.data?.message || err.message || "Something went wrong";
    }
    return "Something went wrong";
  };

  const handleCreate = () => {
    setEditData(null);
    setRoleModalOpen(true);
  };

  const handleEdit = (record: TRole) => {
    setEditData(record);
    setRoleModalOpen(true);
  };

  const handleManagePermissions = (record: TRole) => {
    setSelectedRole(record);
    setPermissionModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteRole(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Role deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete role");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await updateRoleStatus(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Status updated successfully");
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmitRole = async (
    values: TRoleCreateUpdatePayload,
  ): Promise<boolean> => {
    try {
      const payload: TRoleCreateUpdatePayload = {
        role: values.role,
        description: values.description?.trim() || undefined,
        isActive: values.isActive,
      };

      let res;
      if (editData) {
        res = await updateRole({
          id: getRecordId(editData),
          data: payload,
        }).unwrap();
      } else {
        res = await createRole(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message || `Role ${editData ? "updated" : "created"} successfully`,
        );
        return true;
      } else {
        toast.error(
          res?.message || `Failed to ${editData ? "update" : "create"} role`,
        );
        return false;
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const roleColumns = [
    {
      title: "ACTION",
      key: "action",
      width: 150,
      render: (_: unknown, record: TRole) => (
        <div className="flex items-center gap-2">
          {/* Permissions */}
          {can("update") && (
            <Tooltip title="Manage Permissions">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => handleManagePermissions(record)}
                className="text-primary border-primary/30"
                icon={
                  <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                }
              />
            </Tooltip>
          )}

          {/* Edit */}
          {can("update") && (
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
          )}

          {/* Delete */}
          {can("delete") && (
            <Popconfirm
              title="Delete Role"
              description="Are you sure you want to delete this role?"
              onConfirm={() => handleDelete(getRecordId(record))}
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
          )}
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
      dataIndex: "role",
      key: "role",
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
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TRole) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            disabled={!can("update")}
            checked={isActive}
            onChange={() => handleStatusChange(getRecordId(record))}
            size="default"
            loading={isLoading}
          />
        </div>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      render: (text?: string | null) => (
        <span className="text-gray-600">{text?.trim() || "—"}</span>
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
      render: (date: string) => <span className="text-gray-600 font-medium">{formatDate(date)}</span>,
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
            <PageListPrint 
              tableData={roles?.map((item: any) => ({
                Role: item.role,
                Description: item.description || "—",
                Status: item.isActive ? "Active" : "Inactive",
                CreatedAt: formatDate(item.createdAt)
              }))}
              fileName="role-list"
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
                Add New Role
              </CustomButton>
            )}
          </div>
        }
      />

      <div className="">
        <DataTable
          data={roles}
          isLoading={isLoading}
          columns={roleColumns}
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          showHeader={true}
          rowKey={(record: TRole) => getRecordId(record)}
          meta={meta}
        />
      </div>

      {/* Role Modal */}
      <RoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleSubmitRole}
        editData={editData}
      />

      {/* Permission Modal */}
      <PermissionModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        role={selectedRole}
      />
    </div>
  );
};

export default RoleList;
