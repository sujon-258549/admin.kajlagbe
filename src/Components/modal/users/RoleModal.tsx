import { Modal, Form } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const RoleModal = ({ open, onClose, onSubmit, editData }: RoleModalProps) => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setIsActive(editData.status === "Active");
    } else {
      form.resetFields();
      setIsActive(true);
    }
  }, [editData, form, open]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, status: isActive ? "Active" : "Inactive" });
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
        className: "!bg-primary !border-primary !rounded-lg !font-semibold",
      }}
      cancelButtonProps={{
        className: "!rounded-lg !font-semibold",
      }}
      width={480}
      centered
    >
      <Form form={form} layout="vertical" className="pt-4">
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-700">Role Name</span>}
          rules={[{ required: true, message: "Please enter role name" }]}
        >
          <CustomInput placeholder="e.g., Administrator, Staff" size="md" />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <div className="flex items-center gap-3">
            <CustomSwitch
              checked={isActive}
              onChange={setIsActive}
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

export default RoleModal;
