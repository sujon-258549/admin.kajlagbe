import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import type { TRole } from "../../types";

type RoleFormValues = {
  role: string;
  description?: string;
  isActive: boolean;
};

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => Promise<boolean>;
  editData?: TRole | null;
}

const RoleModal = ({ open, onClose, onSubmit, editData }: RoleModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
          isActive: editData.isActive,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ isActive: true });
      }
    }
  }, [editData, open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const isSuccess = await onSubmit(values as RoleFormValues);
    if (isSuccess) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <ModalHeader
          title={editData ? "Update Role" : "Create Role"}
          subTitle={
            editData
              ? "Edit the details of the role."
              : "Fill out the details to create a new role."
          }
        />
      }
      okText={editData ? "Update" : "Create"}
      cancelText="Cancel"
      okButtonProps={{
        className: "modal-btn-primary",
      }}
      cancelButtonProps={{
        className: "modal-btn-outline-primary",
      }}
      width={530}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
        initialValues={{ isActive: true }}
      >
        <Form.Item
          name="role"
          label={<span className="font-semibold text-gray-700">Role Name</span>}
          rules={[{ required: true, message: "Please enter role name" }]}
        >
          <CustomInput placeholder="e.g., Administrator, Staff" size="md" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-gray-700">Description</span>}
        >
          <CustomInput.TextArea
            placeholder="Short role description"
            rows={4}
            className="rounded-lg hover:border-primary! focus:border-primary!"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <div className="flex items-center gap-3">
            <CustomSwitch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              size="default"
              checked={editData?.isActive}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleModal;
