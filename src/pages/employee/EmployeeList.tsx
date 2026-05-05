import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tag, Tooltip, Popconfirm, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "../../Components/Tables/DataTable";
import EmployeeModal, {
  type Employee,
} from "../../Components/modal/employ/EmployeeModal";
import CustomButton from "../../Components/ui/Button";
import CustomSwitch from "../../Components/ui/Switch";
import PageHeader from "../../Components/common/PageHeader";
import {
  useGetEmployeeByIdQuery,
} from "../../redux/features/employApi/employApi";
import type {
  CreateEmployeeRequest,
  EmployeeModalSubmit,
  UpdateEmployeeRequest,
} from "../../Components/types";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useEmployee } from "../../apihooks/useEmployee";
import PageListPrint from "../../Components/common/PageListPrint";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";

const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "name", title: "Name" },
  { key: "email", title: "Email" },
  { key: "phone", title: "Phone" },
  { key: "designation", title: "Designation" },
  { key: "department", title: "Department" },
  { key: "role", title: "Role" },
  { key: "address", title: "Address" },
  { key: "schedule", title: "Work Schedule" },
  { key: "status", title: "Status" },
];

const EmployeeList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );

  const { can } = useRoutePermission(); // current route → "Employees" module auto-detect

  const {
    employees,
    meta,
    isLoading,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployee({ page, limit, searchTerm});

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);

  const { data: editDetail, isFetching: editDetailLoading } =
    useGetEmployeeByIdQuery(editData?.id ?? "", {
      skip: !modalOpen || !editData?.id,
    });

  const tableLoading = isLoading;

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: Employee) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id).unwrap();
      message.success("Employee deleted");
    } catch {
      message.error("Could not delete employee");
    }
  };

  const handleStatusChange = async (record: Employee, checked: boolean) => {
    try {
      await updateEmployee({
        id: record.id,
        data: { user: { isActive: checked } },
      }).unwrap();
      message.success(checked ? "Activated" : "Deactivated");
    } catch {
      message.error("Could not update status");
      refetch();
    }
  };

  const handleSubmit = async (values: EmployeeModalSubmit) => {
    try {
      if (editData) {
        // Update request: user info is nested under 'user'
        const data: UpdateEmployeeRequest = values;
        await updateEmployee({ id: editData.id, data }).unwrap();
        message.success("Employee updated");
      } else {
        // Create request: values already follow the CreateEmployeeRequest nested structure
        const body: CreateEmployeeRequest = values;
        console.log("body", body);
        await createEmployee(body).unwrap();
        message.success("Employee created");
      }
      setModalOpen(false);
      setEditData(null);
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data &&
        typeof (err.data as { message: unknown }).message === "string"
          ? (err.data as { message: string }).message
          : "Request failed";
      message.error(msg);
      throw err;
    }
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: unknown, record: Employee) => (
        <div className="flex items-center gap-2">
          {/* View — সবসময় দেখাবে */}
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/employee/${record.id}`);
              }}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>

          {/* Edit — update permission লাগবে */}
          {can("update") && (
            <Tooltip title="Edit Employee">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
                icon={
                  <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                }
              />
            </Tooltip>
          )}

          {/* Delete — delete permission লাগবে */}
          {can("delete") && (
            <Popconfirm
              title="Delete Employee"
              description="Are you sure you want to delete this employee?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Delete">
                <CustomButton
                  variant="danger-outline"
                  size="icon-sm"
                  onClick={(e) => e.stopPropagation()}
                  icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Employee) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.profile?.photo ||
              `https://i.pravatar.cc/150?u=${record.email}`
            }
            alt={name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
            {name || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{email}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "phone",
      render: (mobile: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {mobile || "—"}
        </span>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (designation: string) => (
        <span
          className="text-xs font-semibold text-white whitespace-nowrap px-3 py-1 rounded-sm uppercase"
          style={{ backgroundColor: "#052e16" }}
        >
          {designation || "—"}
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => (
        <Tag
          style={{
            backgroundColor: "#f0fdf4",
            color: "#052e16",
            border: "1px solid #dcfce7",
            borderRadius: "4px",
          }}
          className=" px-3 font-medium uppercase"
        >
          {dept || "—"}
        </Tag>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="text-xs text-gray-800 font-medium whitespace-nowrap uppercase">
          {role?.replace("_", " ") || "—"}
        </span>
      ),
    },
    {
      title: "Address",
      key: "address",
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-600 whitespace-nowrap">
          <div>{record.address?.division || "—"}</div>
          <div className="text-[10px] opacity-70 whitespace-nowrap">
            {record.address?.district || "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Work Schedule",
      key: "schedule",
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-600">
          <div className="font-medium">
            {record.workInfo?.availableTime || "—"}
          </div>
          <div className="text-[10px] opacity-70">
            {record.workInfo?.workStartTime?.split(" ")[0] || "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean, record: any) => (
        <div onClick={(e) => e.stopPropagation()}>
          <CustomSwitch
            checked={isActive}
            onChange={(checked) => handleStatusChange(record, checked)}
            size="default"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </div>
      ),
    },
  ];

  const visibleColumns = columns.filter((col) =>
    visibleColumnKeys.includes(col.key as string),
  );

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Employees" }]}
        title="All Employees"
        subTitle="User + Profile + WorkInfo (Prisma) via /employ API"
        extra={
          <div className="flex gap-3">
            <PageListPrint 
              tableData={employees?.map((item: any) => ({
                Name: item.name,
                Email: item.email,
                Phone: item.mobile,
                Designation: item.designation,
                Department: item.department,
                Role: item.role,
                Status: item.isActive ? "Active" : "Inactive"
              }))}
              fileName="employee-list"
            />
            {can("create") ? (
              <CustomButton
                onClick={handleCreate}
                variant="primary"
                size="sm"
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                Add Employee
              </CustomButton>
            ) : null}
          </div>
        }
      />

      <div className="flex justify-end mb-3">
        <FilterColumn
          tableName="employee_list"
          columns={filterableColumns}
          onChangeSelectedKeys={setVisibleColumnKeys}
        />
      </div>

      <div className="">
        <DataTable
          selectRow={true}
          data={employees}
          columns={visibleColumns}
          rowKey="id"
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          showHeader={true}
          isLoading={tableLoading}
          total={meta?.total || 0}
          limit={limit}
          currentPage={page}
          setCurrentPage={setPage}
          setLimit={setLimit}
          showSizeChanger={true}
          clearSelectionTrigger={selectedRowIds.length === 0}
          onSelectRowsChange={(selectedRows: any[]) => {
            setSelectedRowIds(selectedRows.map((row) => row.id));
          }}
          onRow={(record: Employee) => ({
            onClick: () => navigate(`/employee/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <EmployeeModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
        editDetail={editDetail ?? null}
        detailLoading={editDetailLoading}
        submitting={isLoading}
      />
    </div>
  );
};

export default EmployeeList;
