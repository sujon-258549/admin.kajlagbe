import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetAllDepartmentsQuery,
  useUpdateDepartmentMutation,
  useUpdateDepartmentStatusMutation,
} from "../../redux/features/departmentApi/departmentApi";
import type {
  TDepartment,
  TDepartmentCreateUpdatePayload,
  TDepartmentMeta,
} from "../../Components/types";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";

const DepartmentList = () => {
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<TDepartment | null>(null);
  const searchText = searchParams.get("searchTerm")?.trim() || "";

  const queryObj = searchText ? { searchTerm: searchText } : {};

  const {
    data: departmentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllDepartmentsQuery(queryObj);
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [updateDepartmentStatus] = useUpdateDepartmentStatusMutation();

  const departments: TDepartment[] = departmentsData?.data || [];
  const meta: TDepartmentMeta = departmentsData?.meta || {
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
    setModalOpen(true);
  };

  const handleEdit = (record: TDepartment) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteDepartment(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Department deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete department");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await updateDepartmentStatus(id).unwrap();
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
    values: TDepartmentCreateUpdatePayload,
  ): Promise<boolean> => {
    try {
      const payload: TDepartmentCreateUpdatePayload = {
        name: values.name,
        description: values.description?.trim() || undefined,
        isActive: values.isActive,
      };

      let res;
      if (editData) {
        res = await updateDepartment({
          id: getRecordId(editData),
          data: payload,
        }).unwrap();
      } else {
        res = await createDepartment(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message ||
            `Department ${editData ? "updated" : "created"} successfully`,
        );
        return true;
      } else {
        toast.error(
          res?.message ||
            `Failed to ${editData ? "update" : "create"} department`,
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
      render: (_: unknown, record: TDepartment) => (
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
            onConfirm={() => handleDelete(getRecordId(record))}
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
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TDepartment) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            checked={isActive}
            onChange={() => handleStatusChange(getRecordId(record))}
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
      render: (date: string) => <span className="text-gray-600 font-medium">{formatDate(date)}</span>,
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
              Add Department
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={departments}
          isLoading={isLoading || isFetching}
          columns={columns}
          isPaginate={meta.total > meta.limit}
          showHeader={true}
          rowKey={(record: TDepartment) => getRecordId(record)}
          meta={meta}
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
