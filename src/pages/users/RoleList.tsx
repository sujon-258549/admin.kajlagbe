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
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
  useUpdateRoleMutation,
  useUpdateRoleStatusMutation,
} from "../../redux/features/roleApi/roleApi";
import type {
  TRole,
  TRoleCreateUpdatePayload,
  TRoleMeta,
} from "../../Components/types";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";

const RoleList = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editData, setEditData] = useState<TRole | null>(null);
  const { data: rolesData, isLoading, isFetching, refetch } = useGetAllRolesQuery(
    {},
  );
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [updateRoleStatus, { isLoading: isUpdatingStatus }] = useUpdateRoleStatusMutation();

  const roles: TRole[] = rolesData?.data || [];
  const meta: TRoleMeta = rolesData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

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
      width: 110,
      render: (_: unknown, record: TRole) => (
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
            checked={isActive}
            onChange={() => handleStatusChange(getRecordId(record))}
            size="default"
            loading={isUpdatingStatus}
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
            <CustomButton
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faRotateRight} />}
              onClick={() => refetch()}
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
          isLoading={isLoading || isFetching}
          columns={roleColumns}
          isPaginate={meta.total > meta.limit}
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
    </div>
  );
};

export default RoleList;
