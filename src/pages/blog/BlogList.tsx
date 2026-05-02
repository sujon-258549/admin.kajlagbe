import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Modal, Tag, Badge } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faPenToSquare,
  faTrash,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import CustomSwitch from "../../Components/ui/Switch";
import formatDate from "../../Components/utils/dateFormate";
import { toast } from "sonner";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useBlog } from "../../apihooks/useBlog";
import PageListPrint from "../../Components/common/PageListPrint";

const BlogList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const { can } = useRoutePermission();
  const queryObj = searchTerm ? { searchTerm } : {};
  
  const {
    blogs,
    meta,
    isLoading,
    refetch,
    deleteBlog,
    changeStatus,
  } = useBlog(queryObj);

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteBlog(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Blog deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete blog");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      setStatusLoading(id);
      const res: any = await changeStatus(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Blog status updated");
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    } finally {
      setStatusLoading(null);
    }
  };

  const columns = [
    {
      title: "ACTION",
      key: "action",
      width: 160,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {/* View Details */}
          {can("view") && (
            <Tooltip title="View Details">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(`/blog/details/${record.id}`)}
                icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
              />
            </Tooltip>
          )}

          {/* Manage Comments */}
          {can("view") && (
            <Tooltip title="Manage Comments">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(`/blog/comments/${record.id}`)}
                icon={<FontAwesomeIcon icon={faMessage} className="text-xs" />}
              />
            </Tooltip>
          )}

          {/* View/Edit */}
          {can("update") && (
            <Tooltip title="Edit Blog">
              <CustomButton
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(`/blog/edit/${record.id}`)}
                icon={
                  <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                }
              />
            </Tooltip>
          )}

          {/* Delete */}
          {can("delete") && (
            <Tooltip title="Delete Blog">
              <CustomButton
                variant="danger-outline"
                size="icon-sm"
                onClick={() => {
                  Modal.confirm({
                    title: "Delete Blog",
                    content: "Are you sure you want to delete this blog post?",
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
          )}
        </div>
      ),
    },
    {
      title: "COVER",
      dataIndex: "cover",
      key: "cover",
      width: 80,
      render: (cover: any) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {cover?.url ? (
            <img src={cover.url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faEye} className="text-gray-300" />
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>TITLE</span>
          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700 line-clamp-1">{text}</span>
          <span className="text-[10px] text-gray-400">{record.slug}</span>
        </div>
      ),
    },
    {
      title: "COMMENTS",
      key: "commentsCount",
      width: 100,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
           <Badge 
            count={record?._count?.comments || 0} 
            showZero 
            color={record?._count?.comments > 0 ? '#1890ff' : '#d9d9d9'}
            style={{ fontSize: '10px' }}
          />
          <span className="text-xs text-gray-500">Comments</span>
        </div>
      )
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (text: string) => text ? <Tag color="blue">{text}</Tag> : <span className="text-gray-400">-</span>,
    },
    {
      title: "AUTHOR",
      dataIndex: "author",
      key: "author",
      render: (author: any) => (
        <div className="flex items-center gap-2">
          {author?.profile?.photo && (
            <img 
              src={author.profile.photo} 
              alt="Author" 
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
          )}
          <span className="text-xs font-medium text-gray-600">
            {author?.profile?.name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      title: "TAGS",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {tags?.map((tag) => (
            <Tag key={tag} className="text-[10px] px-1 m-0">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>PUBLISHED</span>
          <FontAwesomeIcon icon={faFilter} className="text-gray-300 text-xs" />
        </div>
      ),
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean, record: any) => (
        <div className="flex items-center gap-2">
          <CustomSwitch
            disabled={!can("update")}
            checked={isPublished}
            loading={statusLoading === record.id}
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
        <span className="text-gray-600 font-medium text-xs">{formatDate(date)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Blog Management" },
          { label: "Blog List" },
        ]}
        title="Blog Posts"
        subTitle="Manage and publish articles on your platform"
        extra={
          <div className="flex gap-3">
            <PageListPrint 
              tableData={blogs?.map((item: any) => ({
                Title: item.title,
                Category: item.category,
                Author: item.author?.profile?.name || "Unknown",
                Comments: item?._count?.comments || 0,
                Published: item.isPublished ? "Yes" : "No",
                CreatedAt: formatDate(item.createdAt)
              }))}
              fileName="blog-list"
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
                onClick={() => navigate("/blog/create")}
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                Create Blog
              </CustomButton>
            )}
          </div>
        }
      />
      <div className="">
        <DataTable
          data={blogs}
          isLoading={isLoading}
          columns={columns}
          isPaginate={(meta?.total ?? 0) > (meta?.limit ?? 10)}
          showHeader={true}
          rowKey="id"
          meta={meta}
        />
      </div>
    </div>
  );
};

export default BlogList;
