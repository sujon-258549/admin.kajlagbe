import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Popconfirm, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faSearch,
  faFilter,
  faSort,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import SubscriptionModal, {
  type Subscription,
} from "../../Components/modal/subscription/SubscriptionModal";

// Mock initial data
const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Basic",
    slug: "basic",
    price: "499",
    discount: "0",
    duration: "Monthly",
    activeDays: 30,
    description: "Perfect for individuals and small businesses.",
    isRecomended: false,
    featured: ["5 Job Posts", "Basic Analytics", "Email Support"],
    isActive: true,
    status: true,
    createdAt: "15-02-2026",
  },
  {
    id: "2",
    name: "Pro",
    slug: "pro",
    price: "1499",
    discount: "10%",
    duration: "Monthly",
    activeDays: 30,
    description: "Great for growing teams with advanced needs.",
    isRecomended: true,
    featured: [
      "Unlimited Job Posts",
      "Advanced Analytics",
      "Priority Support",
      "Featured Listings",
    ],
    isActive: true,
    status: true,
    createdAt: "15-02-2026",
  },
  {
    id: "3",
    name: "Enterprise",
    slug: "enterprise",
    price: "4999",
    discount: "15%",
    duration: "Yearly",
    activeDays: 365,
    description: "All-inclusive plan for large enterprises.",
    isRecomended: false,
    featured: [
      "Unlimited Everything",
      "Dedicated Manager",
      "API Access",
      "White Label",
      "Custom Integrations",
    ],
    isActive: true,
    status: true,
    createdAt: "15-02-2026",
  },
];

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(mockSubscriptions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Subscription | null>(null);

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: Subscription) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: checked } : s)),
    );
  };

  const handleSubmit = (values: Omit<Subscription, "id" | "createdAt">) => {
    if (editData) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === editData.id ? { ...s, ...values } : s)),
      );
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setSubscriptions((prev) => [newSub, ...prev]);
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: unknown, record: Subscription) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Tooltip title="Edit Subscription">
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
            title="Delete Subscription"
            description="Are you sure you want to delete this plan?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Subscription">
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
          <span>PLAN NAME</span>
          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Subscription) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">{name}</span>
          {record.isRecomended && (
            <Tooltip title="Recommended Plan">
              <FontAwesomeIcon
                icon={faStar}
                className="text-amber-400 text-xs"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price: string, record: Subscription) => (
        <div>
          <span className="font-bold text-gray-800 text-base">৳{price}</span>
          {record.discount && record.discount !== "0" && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
              -{record.discount}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string, record: Subscription) => (
        <div>
          <span className="font-semibold text-gray-700">{duration}</span>
          <span className="ml-2 text-xs text-gray-400">
            ({record.activeDays}d)
          </span>
        </div>
      ),
    },
    {
      title: "FEATURED",
      dataIndex: "featured",
      key: "featured",
      render: (featured: string[]) => (
        <div className="flex flex-col gap-1">
          {featured.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-emerald-500 text-xs shrink-0"
              />
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {f}
              </span>
            </div>
          ))}
          {featured.length > 3 && (
            <span className="text-xs text-primary font-semibold">
              +{featured.length - 3} more
            </span>
          )}
        </div>
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
      render: (status: boolean, record: Subscription) => (
        <div className="flex flex-col gap-1.5">
          <CustomSwitch
            checked={status}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            size="default"
            checkedChildren="On"
            unCheckedChildren="Off"
          />
          <Tag
            className="w-fit text-xs font-medium"
            color={record.isActive ? "green" : "default"}
          >
            {record.isActive ? "Active" : "Inactive"}
          </Tag>
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
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Subscription" }]}
        title="Subscription Plans"
        subTitle="Manage subscription packages and pricing tiers"
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
              Add Plan
            </CustomButton>
          </div>
        }
      />

      <div>
        <DataTable
          data={subscriptions}
          columns={columns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
        />
      </div>

      <SubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default SubscriptionList;
