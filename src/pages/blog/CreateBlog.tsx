import { useEffect, useState, useRef } from "react";
import { Form, Card } from "antd";
import { useParams, useNavigate } from "react-router";
import PageHeader from "../../Components/common/PageHeader";
import CustomInput from "../../Components/ui/Input";
import CustomButton from "../../Components/ui/Button";
import CustomSwitch from "../../Components/ui/Switch";
import MediaLibraryPickerModal from "../../Components/modal/media/MediaLibraryPickerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useBlog, useSingleBlog } from "../../apihooks/useBlog";
import { usePermission } from "../../utils/sidebar";
import { toast } from "sonner";
import type { TMediaImage } from "../../Components/types";
import RichTextEditor from "../../Components/ui/RichTextEditor";

const CreateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [content, setContent] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<TMediaImage | null>(null);

  const isEditMode = !!id;
  const { blog } = useSingleBlog(id || "");
  const { addBlog, updateBlog, isLoading: isMutationLoading } = useBlog();
  const { currentUser } = usePermission();



  const isInitialized = useRef(false);

  useEffect(() => {
    if (isEditMode && blog && !isInitialized.current) {
      form.setFieldsValue({
        ...blog,
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags,
      });
      setTimeout(() => {
        setContent(blog.content || "");
        if (blog.cover) {
          setSelectedCover(blog.cover);
        }
      }, 0);
      isInitialized.current = true;
    }
  }, [blog, isEditMode, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        content,
        authorId: currentUser?.id,
        coverId: selectedCover?.id || null,
        tags: values.tags
          ? Array.isArray(values.tags)
            ? values.tags
            : values.tags.split(",").map((t: string) => t.trim())
          : [],
      };

      if (isEditMode) {
        await updateBlog({ id, data: payload }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await addBlog(payload).unwrap();
        toast.success("Blog created successfully");
      }
      navigate("/blog/list");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleMediaConfirm = (images: TMediaImage[]) => {
    if (images.length > 0) {
      setSelectedCover(images[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Blog Management", path: "/blog/list" },
          { label: isEditMode ? "Edit Blog" : "Create Blog" },
        ]}
        title={isEditMode ? "Edit Blog Post" : "Create New Blog"}
        subTitle={
          isEditMode
            ? `Editing: ${blog?.title || "..."}`
            : "Share your thoughts with the world"
        }
        extra={
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/blog/list")}
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Back to List
          </CustomButton>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isPublished: false }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <div
              className="w-32 h-32 mb-6 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group"
              onClick={() => setIsMediaModalOpen(true)}
            >
              {selectedCover ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedCover.url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium text-center px-2">
                      Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faImage}
                    className="text-2xl text-gray-300 mb-2"
                  />
                  <span className="text-gray-400 text-xs text-center px-4">
                    Select Cover Image
                  </span>
                </>
              )}
            </div>

            <Card className="border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="title"
                  label={
                    <span className="font-semibold text-gray-700">
                      Blog Title
                    </span>
                  }
                  rules={[{ required: true, message: "Title is required" }]}
                >
                  <CustomInput placeholder="Enter title..." size="md" />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label={
                    <span className="font-semibold text-gray-700">Slug</span>
                  }
                >
                  <CustomInput placeholder="e.g. my-awesome-post" size="md" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="category"
                  label={
                    <span className="font-semibold text-gray-700">
                      Category
                    </span>
                  }
                >
                  <CustomInput
                    placeholder="e.g. Technology, Lifestyle"
                    size="md"
                  />
                </Form.Item>

                <Form.Item
                  name="tags"
                  label={
                    <span className="font-semibold text-gray-700">Tags</span>
                  }
                  help="Separate tags with commas"
                >
                  <CustomInput
                    placeholder="e.g. react, nodejs, web"
                    size="md"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="description"
                  label={
                    <span className="font-semibold text-gray-700">
                      Description
                    </span>
                  }
                >
                  <CustomInput.TextArea
                    placeholder="Enter brief description..."
                    rows={2}
                  />
                </Form.Item>

                <Form.Item
                  name="excerpt"
                  label={
                    <span className="font-semibold text-gray-700">
                      Excerpt / Short Summary
                    </span>
                  }
                >
                  <CustomInput.TextArea
                    placeholder="A brief summary for search results..."
                    rows={2}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="font-semibold text-gray-700">Content</span>
                }
                required
              >
                <div className="border border-gray-200 rounded-md overflow-hidden min-h-[400px]">
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </Form.Item>
            </Card>

            <Card className="border-gray-200 mt-4!">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Form.Item
                  name="isPublished"
                  valuePropName="checked"
                  label={
                    <span className="font-semibold text-gray-700">Status</span>
                  }
                  className="mb-0"
                >
                  <CustomSwitch
                    checkedChildren="Published"
                    unCheckedChildren="Draft"
                    size="default"
                  />
                </Form.Item>

                <CustomButton
                  htmlType="submit"
                  variant="primary"
                  className="h-12 px-10 text-lg"
                  loading={isMutationLoading}
                  icon={<FontAwesomeIcon icon={faSave} />}
                >
                  {isEditMode ? "Update Post" : "Publish Blog"}
                </CustomButton>
              </div>
            </Card>
          </div>
        </div>
      </Form>

      <MediaLibraryPickerModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onConfirm={handleMediaConfirm}
        multiple={false}
        title="Select Blog Cover Image"
      />
    </div>
  );
};

export default CreateBlog;
