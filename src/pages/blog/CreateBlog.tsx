import { useEffect, useRef, useState, useMemo } from "react";
import { Form, Card, Tag, message } from "antd";
import { useParams, useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import PageHeader from "../../Components/common/PageHeader";
import CustomInput from "../../Components/ui/Input";
import CustomButton from "../../Components/ui/Button";
import CustomSwitch from "../../Components/ui/Switch";
import MediaLibraryPickerModal from "../../Components/modal/media/MediaLibraryPickerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useBlog, useSingleBlog } from "../../apihooks/useBlog";
import { toast } from "sonner";
import type { TMediaImage } from "../../Components/types";

const CreateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  
  const [content, setContent] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<TMediaImage | null>(null);

  const isEditMode = !!id;
  const { blog, isLoading: isBlogLoading } = useSingleBlog(id || "");
  const { addBlog, updateBlog, isLoading: isMutationLoading } = useBlog();

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your blog content here...',
    minHeight: 400,
    toolbarButtonSize: 'middle',
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
  }), []);

  useEffect(() => {
    if (isEditMode && blog) {
      form.setFieldsValue({
        ...blog,
        tags: blog.tags?.join(", "),
      });
      setContent(blog.content || "");
      if (blog.cover) {
        setSelectedCover(blog.cover);
      }
    }
  }, [blog, isEditMode, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        content,
        coverId: selectedCover?.id || null,
        tags: values.tags ? values.tags.split(",").map((t: string) => t.trim()) : [],
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
        subTitle={isEditMode ? `Editing: ${blog?.title || "..."}` : "Share your thoughts with the world"}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-gray-200">
              <Form.Item
                name="title"
                label={<span className="font-semibold text-gray-700 text-lg">Blog Title</span>}
                rules={[{ required: true, message: "Title is required" }]}
              >
                <CustomInput placeholder="Enter a catchy title..." size="lg" className="text-xl font-bold" />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700">Content</span>}
                required
              >
                <div className="border border-gray-200 rounded-md overflow-hidden min-h-[400px]">
                  <JoditEditor
                    ref={editorRef}
                    value={content}
                    config={config}
                    onBlur={newContent => setContent(newContent)}
                  />
                </div>
              </Form.Item>
            </Card>

            <Card title={<span className="text-gray-700 font-bold">SEO & Metadata</span>} className="shadow-sm border-gray-200">
              <Form.Item
                name="excerpt"
                label={<span className="font-semibold text-gray-700">Excerpt / Short Summary</span>}
              >
                <CustomInput.TextArea placeholder="A brief summary for search results..." rows={3} />
              </Form.Item>
              
              <Form.Item
                name="slug"
                label={<span className="font-semibold text-gray-700">Custom URL Slug (Optional)</span>}
              >
                <CustomInput placeholder="e.g. my-awesome-blog-post" />
              </Form.Item>
            </Card>
          </div>

          {/* Sidebar area */}
          <div className="space-y-6">
            <Card title={<span className="text-gray-700 font-bold">Publishing</span>} className="shadow-sm border-gray-200">
              <Form.Item
                name="isPublished"
                valuePropName="checked"
                label={<span className="font-semibold text-gray-700">Status</span>}
              >
                <CustomSwitch
                  checkedChildren="Published"
                  unCheckedChildren="Draft"
                  size="default"
                />
              </Form.Item>

              <Form.Item
                name="category"
                label={<span className="font-semibold text-gray-700">Category</span>}
              >
                <CustomInput placeholder="e.g. Technology, Lifestyle" />
              </Form.Item>

              <Form.Item
                name="tags"
                label={<span className="font-semibold text-gray-700">Tags</span>}
                help="Separate tags with commas"
              >
                <CustomInput placeholder="e.g. react, nodejs, web" />
              </Form.Item>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <CustomButton
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-lg"
                  loading={isMutationLoading}
                  icon={<FontAwesomeIcon icon={faSave} />}
                >
                  {isEditMode ? "Update Post" : "Publish Blog"}
                </CustomButton>
              </div>
            </Card>

            <Card 
              title={<span className="text-gray-700 font-bold">Cover Image</span>} 
              className="shadow-sm border-gray-200"
              extra={
                <button 
                  type="button" 
                  onClick={() => setIsMediaModalOpen(true)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Choose
                </button>
              }
            >
              <div 
                className="aspect-video rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group"
                onClick={() => setIsMediaModalOpen(true)}
              >
                {selectedCover ? (
                  <div className="relative w-full h-full">
                    <img src={selectedCover.url} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-medium">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-300 mb-2" />
                    <span className="text-gray-400 text-sm">Click to select cover</span>
                  </>
                )}
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
