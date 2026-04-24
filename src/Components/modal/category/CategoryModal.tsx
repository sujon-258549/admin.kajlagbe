import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import { toast } from "sonner";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../redux/features/category/categoryApi";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const CategoryModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: CategoryModalProps) => {
  const [form] = Form.useForm();

  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] =
    useUpdateCategoryMutation();

    
  useEffect(() => {
    if (open) {
      if (editData) {
        // Ensuring status is always a boolean
        const normalizedData = {
          ...editData,
          status: Boolean(editData.status)
        };
        form.setFieldsValue(normalizedData);
      } else {
        form.resetFields();
      }
    }
  }, [editData, form, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = {
        ...values,
        status: Boolean(values.status)
      };

      if (editData) {
        await updateCategory({
          id: editData._id || editData.id,
          data: formData,
        }).unwrap();
      } else {
        await addCategory(formData).unwrap();
      }

      toast.success(
        editData
          ? "Category updated successfully"
          : "Category created successfully",
      );

      form.resetFields();
      onClose();

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error("Failed to validate or add/update category:", error);
      if (error?.data?.message || error?.message) {
        toast.error(
          error?.data?.message || error?.message || "Something went wrong!",
        );
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading || updateLoading}
      title={
        <ModalHeader
          title={editData ? "Update Category" : "Create Category"}
          subTitle={
            editData
              ? "Edit the details of the category."
              : "Fill out the details to create a new category."
          }
        />
      }
      okText={editData ? "Update" : "Create"}
      cancelText="Cancel"
      okButtonProps={{
        className: "!bg-primary !border-primary !rounded-sm  !font-semibold",
      }}
      cancelButtonProps={{
        className: "!rounded-sm !font-semibold hover:!bg-primary hover:!border-primary hover:!text-white",
      }}
      width={680}
      centered
    >
      <Form 
        form={form} 
        layout="vertical" 
        className="pt-4"
        initialValues={{ status: true }}
      >
        <Form.Item
          name="name"
          label={
            <span className="font-semibold text-gray-700">Category Name</span>
          }
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <CustomInput placeholder="e.g., Technology, Healthcare" size="md" />
        </Form.Item>

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
            placeholder="Enter category description"
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

export default CategoryModal;
