import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import { toast } from "sonner";
import {
  useAddTenantMutation,
  useUpdateTenantMutation,
} from "../../../redux/features/tenant/tenantApi";

interface TenantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  editData?: any;
}

const TenantModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: TenantModalProps) => {
  const [form] = Form.useForm();

  const [addTenant, { isLoading }] = useAddTenantMutation();
  const [updateTenant, { isLoading: updateLoading }] =
    useUpdateTenantMutation();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
          isActive: Boolean(editData.isActive),
        });
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
        isActive: Boolean(values.isActive)
      };

      if (editData) {
        await updateTenant({
          id: editData.id,
          data: formData,
        }).unwrap();
      } else {
        await addTenant(formData).unwrap();
      }

      toast.success(
        editData
          ? "Tenant updated successfully"
          : "Tenant created successfully",
      );

      form.resetFields();
      onClose();

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error("Failed to validate or add/update tenant:", error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
      );
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
          title={editData ? "Update Tenant" : "Create Tenant"}
          subTitle={
            editData
              ? "Edit the details of the tenant/company."
              : "Fill out the details to onboard a new company."
          }
        />
      }
      okText={editData ? "Update" : "Create"}
      cancelText="Cancel"
      width={780}
      centered
    >
      <Form 
        form={form} 
        layout="vertical" 
        className="pt-2"
        initialValues={{ isActive: true }}
      >
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-700">Company Name</span>}
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <CustomInput placeholder="e.g., Tech Solutions Ltd." size="md" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="slug"
            label={<span className="font-semibold text-gray-700">Slug</span>}
          >
            <CustomInput placeholder="e.g., tech-solutions" size="md" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700">Business Email</span>}
            rules={[{ type: "email", message: "Please enter a valid email" }]}
          >
            <CustomInput placeholder="e.g., contact@tech.com" size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label={<span className="font-semibold text-gray-700">Phone Number</span>}
          >
            <CustomInput placeholder="e.g., +88017..." size="md" />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
            label={<span className="font-semibold text-gray-700">Active Status</span>}
          >
            <CustomSwitch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              size="default"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label={<span className="font-semibold text-gray-700">Office Address</span>}
        >
          <CustomInput.TextArea placeholder="Enter full address" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TenantModal;
