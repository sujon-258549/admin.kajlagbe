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
import type {
  TDepartment,
  TDepartmentCreateUpdatePayload,
} from "../../Components/types";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useDepartment } from "../../apihooks/useDepartment";
import PageListPrint from "../../Components/common/PageListPrint";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";

const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "name", title: "Department Name" },
  { key: "isActive", title: "Status" },
  { key: "description", title: "Description" },
  { key: "createdAt", title: "Created At" },
];

const DepartmentList = () => {
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<TDepartment | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );
  const searchText = searchParams.get("searchTerm")?.trim() || "";

  const queryObj = {
    page,
    limit,
    ...(searchText && { searchTerm: searchText }),
  };

  const { can } = useRoutePermission();
  
  // Custom Hook usage
  const {
    departments,
    meta,
    isLoading,
    refetch,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateDepartmentStatus,
  } = useDepartment(queryObj);

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
          {can("update") && (
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
          )}

          {/* Delete */}
          {can("delete") && (
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
          )}
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
            disabled={!can("update")}
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

  const visibleColumns = columns.filter((col) =>
    visibleColumnKeys.includes(col.key as string),
  );

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
            <PageListPrint 
              tableData={departments?.map((item: any) => ({
                Name: item.name,
                Description: item.description || "—",
                Status: item.isActive ? "Active" : "Inactive",
                CreatedAt: formatDate(item.createdAt)
              }))}
              fileName="department-list"
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
                Add Department
              </CustomButton>
            )}
          </div>
        }
      />

      <div className="flex justify-end mb-3">
        <FilterColumn
          tableName="department_list"
          columns={filterableColumns}
          onChangeSelectedKeys={setVisibleColumnKeys}
        />
      </div>
        <DataTable
          selectRow={true}
          data={departments}
          isLoading={isLoading}
          columns={visibleColumns}
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          showHeader={true}
          rowKey={(record: TDepartment) => getRecordId(record)}
          total={meta?.total || 0}
          limit={limit}
          currentPage={page}
          setCurrentPage={setPage}
          setLimit={setLimit}
          showSizeChanger={true}
          clearSelectionTrigger={selectedRowIds.length === 0}
          onSelectRowsChange={(selectedRows: any[]) => {
            setSelectedRowIds(selectedRows.map((row) => getRecordId(row)));
          }}
        />
      
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
