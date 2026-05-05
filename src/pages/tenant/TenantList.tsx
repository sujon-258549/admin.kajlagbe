import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Input, Modal, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faSearch,
  faBuilding,
  faUsers,
  faBriefcase,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import TenantModal from "../../Components/modal/tenant/TenantModal";
import TenantSubscriptionModal from "../../Components/modal/tenant/TenantSubscriptionModal";
import debounceSearch from "../../Components/utils/debounceSearch";
import formatDate from "../../Components/utils/dateFormate";
import { toast } from "sonner";
import { useTenant } from "../../apihooks/useTenant";
import PageListPrint from "../../Components/common/PageListPrint";
import FilterColumn from "../../Components/FilterColumn/FilterColumn";

const filterableColumns = [
  { key: "action", title: "Action" },
  { key: "name", title: "Company Name" },
  { key: "email", title: "Email" },
  { key: "stats", title: "Users/Jobs" },
  { key: "isActive", title: "Status" },
  { key: "subscription", title: "Subscription" },
  { key: "createdAt", title: "Created At" },
];

const TenantList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    filterableColumns.map((c) => c.key),
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value, 500).then((value: string) => {
      setSearchText(value);
      setPage(1);
    });
  };

  const queryObj = {
    page,
    limit,
    ...(searchText && { searchTerm: searchText }),
  };
  
  const {
    tenants,
    meta,
    isLoading,
    refetch,
    deleteTenant,
    updateTenant,
  } = useTenant(queryObj);

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleSubscriptionManage = (record: any) => {
    setSelectedTenant(record);
    setSubscriptionModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteTenant(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Tenant deleted successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tenant");
    }
  };

  const handleStatusChange = async (record: any) => {
    try {
      await updateTenant({
        id: record.id,
        data: { isActive: !record.isActive }
      }).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Tenant">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleEdit(record)}
              icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
            />
          </Tooltip>

          <Tooltip title="Manage Subscription">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleSubscriptionManage(record)}
              icon={<FontAwesomeIcon icon={faTicket} className="text-xs" />}
            />
          </Tooltip>

          <Tooltip title="Delete Tenant">
            <CustomButton
              variant="danger-outline"
              size="icon-sm"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Tenant",
                  content: "Are you sure you want to delete this company? All associated data might be affected.",
                  okText: "Delete",
                  okType: "danger",
                  onOk: () => handleDelete(record.id),
                });
              }}
              icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>COMPANY NAME</span>
          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <FontAwesomeIcon icon={faBuilding} className="text-xs" />
          </div>
          <span className="font-semibold text-gray-700">{text}</span>
        </div>
      ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-gray-500 italic">{text || "N/A"}</span>,
    },
    {
      title: "STATS",
      key: "stats",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Tag icon={<FontAwesomeIcon icon={faUsers} />} color="blue">
            {record._count?.users || 0}
          </Tag>
          <Tag icon={<FontAwesomeIcon icon={faBriefcase} />} color="green">
            {record._count?.jobs || 0}
          </Tag>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: any) => (
        <CustomSwitch
          checked={isActive}
          onChange={() => handleStatusChange(record)}
          size="default"
        />
      ),
    },
    {
      title: "SUBSCRIPTION",
      key: "subscription",
      render: (_: any, record: any) => (
        <div className="flex flex-col gap-1">
          {record.subscription?.name ? (
            <Tag color="purple" className="font-semibold">
              {record.subscription.name}
            </Tag>
          ) : (
            <Tag color="default">No Plan</Tag>
          )}
          {record.subscriptionExpiry && (
            <span className="text-[10px] text-gray-400">
              Exp: {formatDate(record.subscriptionExpiry)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-600 font-medium">{formatDate(date)}</span>
      ),
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
          { label: "SaaS Management" },
          { label: "Tenants" },
        ]}
        title="Tenant Management"
        subTitle="Manage companies and organizations using your SaaS platform"
        extra={
          <div className="flex gap-3">
             <PageListPrint 
              tableData={tenants?.map((item: any) => ({
                Name: item.name,
                Email: item.email,
                Users: item._count?.users || 0,
                Jobs: item._count?.jobs || 0,
                Status: item.isActive ? "Active" : "Inactive",
              }))}
              fileName="tenants-list"
            />
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
              Add Tenant
            </CustomButton>
          </div>
        }
      />
      <div className="flex items-center justify-between gap-2">
        <Input
          onChange={handleSearch}
          className="max-w-md"
          placeholder="Search companies..."
          prefix={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
        />
        <FilterColumn
          tableName="tenant_list"
          columns={filterableColumns}
          onChangeSelectedKeys={setVisibleColumnKeys}
        />
      </div>
      <DataTable
        data={tenants}
        isLoading={isLoading}
        columns={visibleColumns}
        isPaginate={meta?.totalPages > 10}
        rowKey="id"
        total={meta?.total || 0}
        limit={limit}
        currentPage={page}
        setCurrentPage={setPage}
        setLimit={setLimit}
      />

      <TenantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />

      <TenantSubscriptionModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  );
};

export default TenantList;
