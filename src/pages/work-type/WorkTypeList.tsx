import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faFilter,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import type { TWorkType, CreateWorkTypeRequest } from "../../Components/types";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import WorkTypeModal from "../../Components/modal/users/WorkTypeModal";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useWorkType } from "../../apihooks/useWorkType";

const WorkTypeList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<TWorkType | null>(null);

  const { can } = useRoutePermission();

  const {
    workTypes,
    isLoading,
    refetch,
    createWorkType,
    updateWorkType,
    deleteWorkType,
    updateStatus,
  } = useWorkType();

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      const err = error as { data?: { message?: string }; message?: string };
      return err.data?.message || err.message || "Something went wrong";
    }
    return "Something went wrong";
  };

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: TWorkType) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteWorkType(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Work type deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete work type");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res: any = await updateStatus({ id }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Status updated successfully");
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmit = async (
    values: CreateWorkTypeRequest & { isActive: boolean }
  ): Promise<boolean> => {
    try {
      const payload: CreateWorkTypeRequest = {
        name: values.name,
        description: values.description?.trim() || undefined,
      };

      let res: any;
      if (editData) {
        res = await updateWorkType({
          id: editData.id,
          data: payload,
        }).unwrap();
      } else {
        res = await createWorkType(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message ||
            `Work type ${editData ? "updated" : "created"} successfully`
        );
        return true;
      } else {
        toast.error(
          res?.message ||
            `Failed to ${editData ? "update" : "create"} work type`
        );
        return false;
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: unknown, record: TWorkType) => (
        <div className="flex items-center gap-2">
          {can("update") && (
            <Tooltip title="Edit Work Type">
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

          {can("delete") && (
            <Popconfirm
              title="Delete Work Type"
              description="Are you sure you want to delete this work type?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Delete Work Type">
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
      title: "WORK TYPE NAME",
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
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TWorkType) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            disabled={!can("update")}
            checked={isActive}
            onChange={() => handleStatusChange(record.id)}
            size="default"
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
      render: (date: string) => (
        <span className="text-gray-600 font-medium">{formatDate(date)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "User Management" },
          { label: "Work Types" },
        ]}
        title="Work Types"
        subTitle="Manage available work types (Full-time, Part-time, etc.)"
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
                Add Work Type
              </CustomButton>
            )}
          </div>
        }
      />

      <DataTable
        data={workTypes || []}
        isLoading={isLoading}
        columns={columns}
        showHeader={true}
        rowKey={(record: TWorkType) => record.id}
      />

      <WorkTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default WorkTypeList;
