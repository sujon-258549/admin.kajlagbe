import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Input, Modal } from "antd";
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
import { useDeleteCategoryMutation, useGetAllCategoriesQuery, useChangeCategoryStatusMutation } from "../../redux/features/category/categoryApi";
import debounceSearch from "../../Components/utils/debounceSearch";
import formatDate from "../../Components/utils/dateFormate";
import { toast } from "sonner";

const CategoryList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock Categories Data


  const [searchText, setSearchText] = useState("");
  const [loading , setLoading] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value, 500).then((value: string) => {
      setSearchText(value);
    });
  };


  const queryObj = searchText ? { searchTerm: searchText } : {};
  const { data: categoriesData, isLoading, isFetching, refetch } = useGetAllCategoriesQuery(queryObj);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [changeStatus] = useChangeCategoryStatusMutation();

  const allCategories = categoriesData?.data || [];
  const meta = categoriesData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };
  console.log("categoryData", allCategories);

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
      const res: any = await deleteCategory(id).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete category");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const handleStatusChange = async (id: string) => {
   try {
    setLoading(true);
    const res: any = await changeStatus({ id }).unwrap();

    if (res?.success) {
      toast.success(res?.message || "Category status changed successfully");
    } else {
      toast.error(res?.message || "Failed to change category status");
    }
   } catch (error: any) {
    toast.error(error?.data?.message || error?.message || "Something went wrong");
   } finally {
    setLoading(false);
   }
  };

  const handleSubmit = (values: any) => {
    console.log("Submit", values);
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
          <Tooltip title="Delete Category">
            <CustomButton
              variant="danger-outline"
              size="icon-sm"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Category",
                  content: "Are you sure you want to delete this category?",
                  okText: "Delete",
                  okType: "danger",
                  cancelText: "Cancel",
                  onOk: async () => {
                    await handleDelete(record.id);
                  },
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
        <div className="bg-gray-100 p-2 rounded-md inline-block w-8 h-8 flex items-center justify-center">
          <i className={`${text?.includes('fa-') ? text : `fa-solid fa-${text}`} text-gray-600`}></i>
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
            loading={loading}
            onChange={() => handleStatusChange(record.id)}
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
        <span className="text-gray-600 font-medium">{formatDate(date)}</span>
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
              Add Category
            </CustomButton>
          </div>
        }
      />
      <div className="flex items-center gap-2">
        <Input
          onChange={handleSearch}
          className="max-w-md"
          placeholder="Search"
        />
      </div>
      <div className="">
        <DataTable
          data={allCategories}
          isLoading={isLoading || isFetching}
          columns={columns}
          isPaginate={meta.total > meta.limit}
          showHeader={true}
          rowKey="id"
          meta={meta}
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
