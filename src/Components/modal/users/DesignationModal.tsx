import { Modal, Form, Select } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";

const { Option } = Select;

interface DesignationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const DesignationModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: DesignationModalProps) => {
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
          title={editData ? "Update Designation" : "Create Designation"}
          subTitle={
            editData
              ? "Edit the details of the designation."
              : "Fill out the details to create a new designation."
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
          label={
            <span className="font-semibold text-gray-700">
              Designation Name
            </span>
          }
          rules={[{ required: true, message: "Please enter designation name" }]}
        >
          <CustomInput placeholder="e.g., Manager, Sales Executive" size="md" />
        </Form.Item>

        <Form.Item
          name="role"
          label={<span className="font-semibold text-gray-700">Role</span>}
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <CustomSelect placeholder="Select Role" size="md">
            <Option value="Admin">Admin</Option>
            <Option value="Manager">Manager</Option>
            <Option value="Employee">Employee</Option>
            <Option value="Support">Support</Option>
          </CustomSelect>
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

export default DesignationModal;
