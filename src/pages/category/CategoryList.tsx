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
import CategoryModal from "../../Components/modal/category/CategoryModal";

const CategoryList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock Categories Data
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Technology",
      slug: "technology",
      icon: "code",
      description: "IT and Software Development",
      status: true,
      createdAt: "15-02-2026",
    },
    {
      id: "2",
      name: "Healthcare",
      slug: "healthcare",
      icon: "heart",
      description: "Medical and Health Services",
      status: true,
      createdAt: "15-02-2026",
    },
    {
      id: "3",
      name: "Education",
      slug: "education",
      icon: "book",
      description: "Teaching and Learning",
      status: true,
      createdAt: "15-02-2026",
    },
  ]);

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories((prev: any) => prev.filter((c: any) => c.id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setCategories((prev: any) =>
      prev.map((c: any) => (c.id === id ? { ...c, status: checked } : c)),
    );
  };

  const handleSubmit = (values: any) => {
    if (editData) {
      setCategories((prev: any) =>
        prev.map((c: any) => (c.id === editData.id ? { ...c, ...values } : c)),
      );
    } else {
      const newCategory = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setCategories((prev: any) => [newCategory, ...prev]);
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Tooltip title="Edit Category">
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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Category">
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
          <span>CATEGORY NAME</span>
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
          <span>SLUG</span>
        </div>
      ),
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>ICON</span>
        </div>
      ),
      dataIndex: "icon",
      key: "icon",
      render: (text: string) => (
        <div className="bg-gray-100 p-2 rounded-md inline-block">
          <span className="text-gray-600">{text}</span>
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
      render: (status: boolean, record: any) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            checked={status}
            onChange={(checked: boolean) =>
              handleStatusChange(record.id, checked)
            }
            size="default"
          />
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
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management" },
          { label: "Categories" },
        ]}
        title="Job Categories"
        subTitle="Manage job categories for your platform"
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
              Add Category
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={categories}
          columns={columns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
        />
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default CategoryList;
//ad
