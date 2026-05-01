import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import MediaLibraryImageUploader from "../../ui/MediaLibraryImageUploader";

interface SubCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: any;
  categories: { label: string; value: string }[];
}

const SubCategoryModal = ({
  open,
  onClose,
  onSubmit,
  editData,
  categories,
}: SubCategoryModalProps) => {
  const [form] = Form.useForm();
  const imageUrl = Form.useWatch("url", form);

  useEffect(() => {
    if (open) {
      if (editData) {
        const normalizedData = {
          ...editData,
          status: Boolean(editData.status),
          url: editData.image || editData.url || "",
          imageId: editData.imageId || ""
        };
        form.setFieldsValue(normalizedData);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true });
      }
    }
  }, [editData, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        status: Boolean(values.status),
      };
      await onSubmit(formData);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("SubCategory handleOk error:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <ModalHeader
          title={editData ? "Update SubCategory" : "Create SubCategory"}
          subTitle={
            editData
              ? "Edit the details of the subcategory."
              : "Fill out the details to create a new subcategory."
          }
        />
      }
      okText={editData ? "Update" : "Create"}
      cancelText="Cancel"
      okButtonProps={{
        className: "!bg-primary !border-primary !rounded-sm !font-semibold",
      }}
      cancelButtonProps={{
        className: "!rounded-sm !font-semibold hover:!bg-primary hover:!border-primary hover:!text-white",
      }}
      width={780}
      centered
      styles={{
        header: { padding: "16px 24px 12px", margin: 0 },
        body: { maxHeight: "min(78vh, calc(100vh - 220px))", overflowY: "auto", padding: "12px 24px 24px" },
        footer: { padding: "14px 24px 18px", borderTop: "1px solid #f0f0f0" },
      }}
    >
      <Form form={form} layout="vertical" className="pt-2" initialValues={{ status: true }}>
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-800 mb-3">SubCategory Image</p>
          <Form.Item name="url" noStyle>
            <MediaLibraryImageUploader
              value={imageUrl}
              onChange={(url, id) => {
                form.setFieldsValue({ url, imageId: id });
              }}
            />
          </Form.Item>
          <Form.Item name="imageId" className="hidden">
            <CustomInput />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
          name="categoryId"
          label={
            <span className="font-semibold text-gray-700">Parent Category</span>
          }
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <CustomSelect
            options={categories}
            placeholder="Select a parent category"
            size="md"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label={
            <span className="font-semibold text-gray-700">
              SubCategory Name
            </span>
          }
          rules={[{ required: true, message: "Please enter subcategory name" }]}
        >
          <CustomInput
            placeholder="e.g., Frontend Developer, Nurse"
            size="md"
          />
        </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="slug"
            label={<span className="font-semibold text-gray-700">Slug</span>}
          >
            <CustomInput placeholder="e.g., technology" size="md" />
          </Form.Item>

          <Form.Item
            name="icon"
            label={<span className="font-semibold text-gray-700">Icon</span>}
          >
            <CustomInput placeholder="e.g., briefcase" size="md" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label={
            <span className="font-semibold text-gray-700">Description</span>
          }
        >
          <CustomInput.TextArea
            placeholder="Enter subcategory description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="status"
          valuePropName="checked"
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <CustomSwitch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            size="default"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubCategoryModal;
