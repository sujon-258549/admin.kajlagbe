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
import SubCategoryModal from "../../Components/modal/category/SubCategoryModal";
import {
  type TMeta,
  type TSubCategory,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetAllSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useUpdateSubCategoryStatusMutation,
} from "../../redux/api/subCategoryApi";
import { useGetAllCategoriesQuery } from "../../redux/features/category/categoryApi";
import { toast } from "sonner";
import formatDate from "../../Components/utils/dateFormate";
import debounceSearch from "../../Components/utils/debounceSearch";

interface TCategoryOption {
  label: string;
  value: string;
}

const SubCategoryList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<TSubCategory | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value, 500).then((value: string) => {
      setSearchText(value);
    });
  };

  const queryObj = searchText ? { searchTerm: searchText } : {};

  // API Queries & Mutations
  const {
    data: subCategoriesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSubCategoryQuery(queryObj);
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [updateStatus] = useUpdateSubCategoryStatusMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const allSubCategories: TSubCategory[] = subCategoriesData?.data || [];
  const meta: TMeta = subCategoriesData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const categories: TCategoryOption[] =
    categoriesData?.data?.data?.map((cat: any) => ({
      label: cat.name,
      value: cat.id,
    })) || [];

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: TSubCategory) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSubCategory(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "SubCategory deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete subcategory");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await updateStatus(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Status updated successfully");
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  const handleSubmit = async (values: Partial<TSubCategory>) => {
    try {
      let res;
      if (editData) {
        res = await updateSubCategory({ id: editData.id, data: values }).unwrap();
      } else {
        res = await createSubCategory(values).unwrap();
      }

      if (res?.success) {
        toast.success(res?.message || `SubCategory ${editData ? 'updated' : 'created'} successfully`);
        setModalOpen(false);
      } else {
        toast.error(res?.message || `Failed to ${editData ? 'update' : 'create'} subcategory`);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 110,
      render: (_: unknown, record: TSubCategory) => (
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
          <Tooltip title="Delete SubCategory">
            <CustomButton
              variant="danger-outline"
              size="icon-sm"
              onClick={() => {
                Modal.confirm({
                  title: "Delete SubCategory",
                  content: "Are you sure you want to delete this subcategory?",
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
      dataIndex: ["category", "name"],
      key: "categoryName",
      render: (text: string) => (
        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
          {text}
        </span>
      ),
    },
    {
      title: "ICON",
      dataIndex: "icon",
      key: "icon",
      render: (text: string) => (
        <div className="bg-gray-100 p-2 rounded-md inline-block w-8 h-8 flex items-center justify-center">
          <i className={`${text?.includes('fa-') ? text : `fa-solid fa-${text}`} text-gray-600`}></i>
        </div>
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
      render: (status: boolean, record: TSubCategory) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            checked={status}
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
              Add SubCategory
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
          data={allSubCategories}
          isLoading={isLoading || isFetching}
          columns={columns}
          isPaginate={meta.total > meta.limit}
          showHeader={true}
          rowKey="id"
          meta={meta}
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
