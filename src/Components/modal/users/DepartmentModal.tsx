import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";

interface DepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const DepartmentModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: DepartmentModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
            ...editData,
            status: editData.status === "Active"
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true });
      }
    }
  }, [editData, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, status: values.status ? "Active" : "Inactive" });
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
          title={editData ? "Update Department" : "Create Department"}
          subTitle={
            editData
              ? "Edit the details of the department."
              : "Fill out the details to create a new department."
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
      <Form form={form} layout="vertical" className="pt-4" initialValues={{ status: true }}>
        <Form.Item
          name="name"
          label={
            <span className="font-semibold text-gray-700">Department Name</span>
          }
          rules={[{ required: true, message: "Please enter department name" }]}
        >
          <CustomInput placeholder="e.g., Engineering, Marketing" size="md" />
        </Form.Item>

        <Form.Item
          name="status"
          valuePropName="checked"
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <div className="flex items-center gap-3">
            <CustomSwitch
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

export default DepartmentModal;
