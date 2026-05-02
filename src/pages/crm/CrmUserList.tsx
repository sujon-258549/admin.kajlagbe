import { useSearchParams } from "react-router-dom";
import { Tag } from "antd";
import DataTable from "../../Components/Tables/DataTable";
import PageHeader from "../../Components/common/PageHeader";
import { useEmployee } from "../../apihooks/useEmployee";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useState } from "react";
import { Tooltip, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRobot } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import FollowUpModal from "../../Components/modal/automation/FollowUpModal";
import { useTriggerFollowUpEmailsMutation } from "../../redux/features/automationApi/automationApi";
import PageListPrint from "../../Components/common/PageListPrint";

const CrmUserList = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const { can } = useRoutePermission();
  const [triggerFollowUp, { isLoading: isTriggering }] =
    useTriggerFollowUpEmailsMutation();

  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const {
    employees: users,
    meta,
    isLoading,
  } = useEmployee({ searchTerm, role: "USER" });

  const handleManualTrigger = async () => {
    try {
      await triggerFollowUp({}).unwrap();
      message.success("Follow-up automation process triggered successfully!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to trigger automation.");
    }
  };

  const handleOpenFollowUp = (record: any) => {
    setSelectedUser(record);
    setFollowUpModalOpen(true);
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Send Follow-up">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleOpenFollowUp(record)}
              icon={<FontAwesomeIcon icon={faPaperPlane} className="text-xs" />}
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
        <Tag
          color="blue"
          className="font-bold text-[10px] uppercase rounded-md border-none px-3"
        >
          {record.role || "USER"}
        </Tag>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, record: any) => (
        <div className="text-[11px] text-gray-500">
          {record.address?.district
            ? `${record.address.district}, ${record.address.division}`
            : "—"}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "CRM" },
          { label: "User List" },
        ]}
        title="CRM - User List"
        subTitle="Manage and view CRM users"
        extra={
          <div className="flex gap-3">
            <PageListPrint 
              tableData={users?.map((item: any) => ({
                Name: item.name,
                Email: item.email,
                Mobile: item.mobile,
                Location: item.address?.district ? `${item.address.district}, ${item.address.division}` : "—",
                Status: item.isActive ? "Active" : "Inactive"
              }))}
              fileName="crm-user-list"
            />
            {can("update") && (
              <CustomButton
                variant="primary"
                size="sm"
                onClick={handleManualTrigger}
                loading={isTriggering}
                icon={<FontAwesomeIcon icon={faRobot} />}
              >
                Trigger Follow-up Automation
              </CustomButton>
            )}
          </div>
        }
      />

      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <DataTable
          data={users}
          columns={columns}
          rowKey="id"
          isPaginate={meta && meta.total > (meta.limit || 10)}
          isLoading={isLoading}
        />
      </div>
      <FollowUpModal
        open={followUpModalOpen}
        onClose={() => {
          setFollowUpModalOpen(false);
          setSelectedUser(null);
        }}
        userData={selectedUser}
      />
    </div>
  );
};

export default CrmUserList;
