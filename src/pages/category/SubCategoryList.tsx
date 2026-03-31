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
import SubCategoryModal from "../../Components/modal/category/SubCategoryModal";

const SubCategoryList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock Categories for Selection
  const categories = [
    { value: "1", label: "Technology" },
    { value: "2", label: "Healthcare" },
    { value: "3", label: "Education" },
  ];

  // Mock SubCategories Data
  const [subCategories, setSubCategories] = useState([
    {
      id: "101",
      name: "Frontend Developer",
      slug: "frontend-developer",
      categoryId: "1",
      categoryName: "Technology",
      icon: "code",
      description: "React, Vue, etc.",
      status: true,
      createdAt: "15-02-2026",
    },
    {
      id: "102",
      name: "Backend Developer",
      slug: "backend-developer",
      categoryId: "1",
      categoryName: "Technology",
      icon: "server",
      description: "Node, Python, Go, etc.",
      status: true,
      createdAt: "15-02-2026",
    },
    {
      id: "103",
      name: "Nurse",
      slug: "nurse",
      categoryId: "2",
      categoryName: "Healthcare",
      icon: "user-md",
      description: "Registered Nurses",
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
    setSubCategories((prev: any) => prev.filter((c: any) => c.id !== id));
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setSubCategories((prev: any) =>
      prev.map((c: any) => (c.id === id ? { ...c, status: checked } : c)),
    );
  };

  const handleSubmit = (values: any) => {
    const category = categories.find((c) => c.value === values.categoryId);
    const categoryName = category ? category.label : "";

    if (editData) {
      setSubCategories((prev: any) =>
        prev.map((c: any) =>
          c.id === editData.id ? { ...c, ...values, categoryName } : c,
        ),
      );
    } else {
      const newSubCategory = {
        id: Date.now().toString(),
        ...values,
        categoryName,
        createdAt: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setSubCategories((prev: any) => [newSubCategory, ...prev]);
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
          <Tooltip title="Edit SubCategory">
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
            title="Delete SubCategory"
            description="Are you sure you want to delete this subcategory?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete SubCategory">
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
          <span>SUBCATEGORY NAME</span>
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
          <span>PARENT CATEGORY</span>
          <FontAwesomeIcon icon={faFilter} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => (
        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
          {text}
        </span>
      ),
    },
    {
      title: "SLUG",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>STATUS</span>
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
          { label: "SubCategories" },
        ]}
        title="Job SubCategories"
        subTitle="Manage job subcategories for your platform"
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
              Add SubCategory
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={subCategories}
          columns={columns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
        />
      </div>

      <SubCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
        categories={categories}
      />
    </div>
  );
};

export default SubCategoryList;
