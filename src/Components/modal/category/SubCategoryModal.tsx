import { Modal, Form } from "antd";
import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setStatus(editData.status);
    } else {
      form.resetFields();
      setStatus(true);
    }
  }, [editData, form, open]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, status });
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
        className: "!bg-primary !border-primary !rounded-lg !font-semibold",
      }}
      cancelButtonProps={{
        className: "!rounded-lg !font-semibold",
      }}
      width={600}
      centered
    >
      <Form form={form} layout="vertical" className="pt-4">
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
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <div className="flex items-center gap-3">
            <CustomSwitch
              checked={status}
              onChange={setStatus}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              size="default"
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubCategoryModal;
