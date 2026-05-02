import { useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import { Tooltip, Modal, Tag, Form, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faTrash,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../Components/ui/Button";
import DataTable from "../../Components/Tables/DataTable";
import formatDate from "../../Components/utils/dateFormate";
import { toast } from "sonner";
import { useBlogComment } from "../../apihooks/useBlogComment";
import { useParams } from "react-router-dom";
import { useSingleBlog } from "../../apihooks/useBlog";
import PageListPrint from "../../Components/common/PageListPrint";

const BlogCommentList = () => {
  const { blogId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { comments, meta, isLoading, refetch, deleteBlogComment, createBlogComment, isCreating } = useBlogComment(blogId, { page, limit });
  const { blog } = useSingleBlog(blogId || "");
  
  const [viewComment, setViewComment] = useState<any>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = async (id: string) => {
    try {
      const res: any = await deleteBlogComment(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Comment deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete comment");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        blogId,
      };
      const res: any = await createBlogComment(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Comment created successfully");
        form.resetFields();
        setCreateModalVisible(false);
        refetch();
      } else {
        toast.error(res?.message || "Failed to create comment");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const columns = [
    ...(blogId ? [] : [{
      title: "BLOG",
      dataIndex: "blog",
      key: "blog",
      render: (blog: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700 line-clamp-1">{blog?.title || "N/A"}</span>
          <span className="text-[10px] text-gray-400">{blog?.slug}</span>
        </div>
      ),
    }]),
    {
      title: "USER",
      key: "user",
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">{record.name}</span>
          <span className="text-[10px] text-gray-400">{record.email}</span>
          <span className="text-[10px] text-gray-400">{record.phone}</span>
        </div>
      ),
    },
    {
      title: "COMMENT",
      dataIndex: "comment",
      key: "comment",
      render: (text: string) => (
        <span className="text-xs text-gray-600 line-clamp-2 max-w-[300px]">
          {text}
        </span>
      ),
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-[10px] text-gray-500">{formatDate(date)}</span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => setViewComment(record)}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>
          <Tooltip title="Delete Comment">
            <CustomButton
              variant="danger-outline"
              size="icon-sm"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Comment",
                  content: "Are you sure you want to delete this comment?",
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Blog Management", path: "/blog/list" },
          { label: blog?.title ? `${blog.title} - Comments` : "Comments" },
        ]}
        title={"Blog Comments"}
        subTitle={blog?.title ? `Comments on - ${blog.title}` : "Manage all user comments"}
        extra={
          <div className="flex gap-3">
             <PageListPrint 
              tableData={comments?.map((item: any) => ({
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                Comment: item.comment,
                Blog: item.blog?.title || "N/A",
                Date: formatDate(item.createdAt)
              }))}
              fileName="blog-comments"
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
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setCreateModalVisible(true)}
            >
              Add Comment
            </CustomButton>
          </div>
        }
      />

      <div className="">
        <DataTable
          data={comments}
          isLoading={isLoading}
          columns={columns}
          isPaginate={true}
          showHeader={true}
          rowKey="id"
          currentPage={page}
          total={meta?.total}
          limit={limit}
          setCurrentPage={setPage}
          setLimit={setLimit}
        />
      </div>

      {/* View Comment Modal */}
      <Modal
        title="Comment Details"
        open={!!viewComment}
        onCancel={() => setViewComment(null)}
        footer={[
          <CustomButton key="close" variant="outline" size="sm" onClick={() => setViewComment(null)}>
            Close
          </CustomButton>
        ]}
        centered
      >
        {viewComment && (
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800">{viewComment.name}</h4>
                <p className="text-xs text-gray-500">{viewComment.email}</p>
                <p className="text-xs text-gray-500">{viewComment.phone}</p>
              </div>
              <Tag color="blue">{formatDate(viewComment.createdAt)}</Tag>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "{viewComment.comment}"
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Comment Modal */}
      <Modal
        title="Add New Comment"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ name: "Admin", email: "admin@kajlagbe.com" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
           <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter a phone number" }]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please enter a comment" }]}
          >
            <Input.TextArea rows={4} placeholder="Write comment here..." />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <CustomButton variant="outline" size="sm" onClick={() => setCreateModalVisible(false)}>
              Cancel
            </CustomButton>
            <CustomButton variant="primary" size="sm" htmlType="submit" loading={isCreating}>
              Submit
            </CustomButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogCommentList;
