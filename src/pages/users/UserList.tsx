import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tooltip, Popconfirm, message, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faPlus,
  faEye,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "../../Components/Tables/DataTable";
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
import UserModal from "../../Components/modal/users/UserModal";
import UserSubscriptionDrawer from "../../Components/modal/users/UserSubscriptionDrawer";
import PageListPrint from "../../Components/common/PageListPrint";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";

const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "user", title: "User Info" },
  { key: "mobile", title: "Mobile" },
  { key: "role", title: "Role" },
  { key: "work", title: "Work Info" },
  { key: "location", title: "Location" },
  { key: "status", title: "Status" },
];

const UserList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );
  const { can } = useRoutePermission();

  const {
    employees: users,
    meta,
    isLoading,
    refetch,
    createEmployee: createUser,
    updateEmployee: updateUser,
    deleteEmployee: deleteUser,
  } = useEmployee({ page, limit, searchTerm, role: "USER" });

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<any | null>(null);

  const { data: editDetail, isFetching: editDetailLoading } =
    useGetEmployeeByIdQuery(editData?.id ?? "", {
      skip: !modalOpen || !editData?.id,
    });

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      message.success("User deleted successfully");
    } catch {
      message.error("Could not delete user");
    }
  };

  const handleStatusChange = async (record: any, checked: boolean) => {
    try {
      await updateUser({
        id: record.id,
        data: { user: { isActive: checked } },
      }).unwrap();
      message.success(checked ? "User activated" : "User deactivated");
    } catch {
      message.error("Could not update status");
      refetch();
    }
  };

  const handleSubmit = async (values: EmployeeModalSubmit) => {
    try {
      if (editData) {
        const data: UpdateEmployeeRequest = values;
        await updateUser({ id: editData.id, data }).unwrap();
        message.success("User updated successfully");
      } else {
        const body: CreateEmployeeRequest = {
          ...values,
          user: {
            ...values.user,
            password: values.user.password || "12345678",
          },
        };
        await createUser(body).unwrap();
        message.success("User created successfully");
      }
      setModalOpen(false);
      setEditData(null);
    } catch (err: any) {
      message.error(err?.data?.message || "Request failed");
      throw err;
    }
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/users/${record.id}`);
              }}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>

          {can("update") && (
            <Tooltip title="Edit User">
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

          {can("delete") && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
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

          <Tooltip title="Manage Subscription & Brand">
            <CustomButton
              variant="outline"
              size="icon-sm"
              className="!text-purple-600 !border-purple-200 hover:!bg-purple-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUserForDrawer(record);
                setDrawerOpen(true);
              }}
              icon={<FontAwesomeIcon icon={faCreditCard} className="text-xs" />}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "User Info",
      key: "user",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.profile?.photo ||
              `https://i.pravatar.cc/150?u=${record.email}`
            }
            alt={record.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
          />
          <div className="overflow-hidden">
            <div className="font-bold text-gray-800 text-sm truncate uppercase">
              {record.name || "—"}
            </div>
            <div className="text-[11px] text-gray-400 truncate">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (mobile: string) => (
        <span className="text-sm text-gray-600 font-medium">
          {mobile || "—"}
        </span>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (_: any, record: any) => (
        <Tag color="blue" className="font-bold text-[10px] uppercase rounded-md border-none px-3">
          {record.role || "USER"}
        </Tag>
      ),
    },
    {
      title: "Work Info",
      key: "work",
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400">
             {(record.workInfo?.workTypes ?? []).map((w: any) => w.name).join(", ") || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, record: any) => (
        <div className="text-[11px] text-gray-500">
           {record.address?.district ? `${record.address.district}, ${record.address.division}` : "—"}
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

  const [activeTab, setActiveTab] = useState("all");

  const filteredUsers = activeTab === "brand" 
    ? users?.filter((u: any) => u.tenantId) 
    : users;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "User Management" },
          { label: "All User" },
        ]}
        title="All Users"
        subTitle="Manage regular users and their details"
        extra={
          <div className="flex gap-3">
            <PageListPrint 
              tableData={filteredUsers?.map((item: any) => ({
                Name: item.name,
                Email: item.email,
                Mobile: item.mobile,
                Role: item.role || "USER",
                Status: item.isActive ? "Active" : "Inactive"
              }))}
              fileName="user-list"
            />
            {can("create") ? (
              <CustomButton
                onClick={handleCreate}
                variant="primary"
                size="sm"
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                Add New User
              </CustomButton>
            ) : null}
          </div>
        }
      />

      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Users
          </button>
          {can("View Brand Users") && (
            <button
              onClick={() => setActiveTab("brand")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === "brand"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Brand Users
            </button>
          )}
        </div>
        <FilterColumn
          tableName="user_list"
          columns={filterableColumns}
          onChangeSelectedKeys={setVisibleColumnKeys}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <DataTable
          selectRow={true}
          data={filteredUsers}
          columns={visibleColumns}
          rowKey="id"
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          isLoading={isLoading}
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
          onRow={(record: any) => ({
            onClick: () => navigate(`/users/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <UserModal
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

      <UserSubscriptionDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUserForDrawer(null);
        }}
        user={selectedUserForDrawer}
      />
    </div>
  );
};

export default UserList;
