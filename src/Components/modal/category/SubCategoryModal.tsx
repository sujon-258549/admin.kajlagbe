import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";

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

  useEffect(() => {
    if (open) {
      if (editData) {
        const normalizedData = {
          ...editData,
          status: Boolean(editData.status)
        };
        form.setFieldsValue(normalizedData);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true });
      }
    }
  }, [editData, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formData = {
        ...values,
        status: Boolean(values.status)
      };
      onSubmit(formData);
      form.resetFields();
      onClose();
    });
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
      width={680}
      centered
    >
      <Form form={form} layout="vertical" className="pt-4" initialValues={{ status: true }}>
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
            rules={[{ required: true, message: "Please enter slug" }]}
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
