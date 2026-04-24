import { Modal, Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import type { TWorkType } from "../../types";

type WorkTypeFormValues = {
  name: string;
  description?: string;
  isActive: boolean;
};

interface WorkTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: WorkTypeFormValues) => Promise<boolean>;
  editData?: TWorkType | null;
}

const WorkTypeModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: WorkTypeModalProps) => {
  const [form] = Form.useForm();
  const isActive = Form.useWatch("isActive", form);

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          name: editData.name,
          description: editData.description,
          isActive: editData.isActive,
        });
      } else {
        form.resetFields();
        // Force set isActive to true for new entries
        form.setFieldsValue({ isActive: true });
      }
    }
  }, [editData, open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const isSuccess = await onSubmit(values as WorkTypeFormValues);

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
          title={editData ? "Update Work Type" : "Create Work Type"}
          subTitle={
            editData
              ? "Edit the details of the work type."
              : "Fill out the details to create a new work type."
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
      width={580}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
        initialValues={{ isActive: true }}
      >
        <Form.Item
          name="name"
          label={
            <span className="font-semibold text-gray-700">Work Type Name</span>
          }
          rules={[{ required: true, message: "Please enter work type name" }]}
        >
          <CustomInput placeholder="e.g., Full-time, Part-time, Contract" size="md" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-gray-700">Description</span>}
        >
          <CustomInput.TextArea
            placeholder="Short work type description"
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
              checked={isActive}
              onChange={(checked) => form.setFieldValue("isActive", checked)}
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

export default WorkTypeModal;
