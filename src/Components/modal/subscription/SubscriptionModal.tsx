import { Modal, Form, Input, Space } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import CustomButton from "../../ui/Button";
import type { Subscription } from "../../types";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Subscription, "id" | "createdAt">) => void;
  editData?: Subscription | null;
}

const SubscriptionModal = ({
  open,
  onClose,
  onSubmit,
  editData,
}: SubscriptionModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
          activeDays: String(editData.activeDays),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          isRecomended: false,
          isActive: true,
          status: true,
          featured: [""],
        });
      }
    }
  }, [editData, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const cleanedFeatured = (values.featured || []).filter((f: string) => f && f.trim() !== "");
      onSubmit({
        ...values,
        activeDays: Number(values.activeDays),
        featured: cleanedFeatured,
      });
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
          title={editData ? "Update Subscription" : "Create Subscription"}
          subTitle={
            editData
              ? "Edit subscription plan details."
              : "Fill in the details to create a new subscription plan."
          }
          center={false}
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
      width={780}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
        initialValues={{ isRecomended: false, isActive: true, status: true, featured: [""] }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Plan Name</span>}
            rules={[{ required: true, message: "Please enter plan name" }]}
          >
            <CustomInput placeholder="e.g., Basic, Pro, Enterprise" size="md" />
          </Form.Item>

          <Form.Item
            name="slug"
            label={<span className="font-semibold text-gray-700">Slug</span>}
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <CustomInput placeholder="e.g., basic-plan" size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label={<span className="font-semibold text-gray-700">Price</span>}
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <CustomInput placeholder="e.g., 999" size="md" />
          </Form.Item>

          <Form.Item
            name="discount"
            label={<span className="font-semibold text-gray-700">Discount</span>}
            rules={[{ required: true, message: "Please enter discount" }]}
          >
            <CustomInput placeholder="e.g., 10% or 100" size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label={<span className="font-semibold text-gray-700">Duration</span>}
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <CustomInput placeholder="e.g., Monthly, Yearly, 3 Months" size="md" />
          </Form.Item>

          <Form.Item
            name="activeDays"
            label={<span className="font-semibold text-gray-700">Active Days</span>}
            rules={[{ required: true, message: "Please enter active days" }]}
          >
            <CustomInput placeholder="e.g., 30, 365" size="md" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-gray-700">Description</span>}
        >
          <CustomInput.TextArea placeholder="Brief description about this plan..." rows={3} />
        </Form.Item>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 text-sm mb-2">Featured Points</label>
          <Form.List name="featured">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      style={{ marginBottom: 0, width: "600px" }}
                    >
                      <Input placeholder="Feature point" className="rounded-lg border-gray-200" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="text-red-400 hover:text-red-500 text-lg"
                        onClick={() => remove(name)}
                      />
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="mt-2"
                  >
                    Add Feature
                  </CustomButton>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <Form.Item name="isRecomended" valuePropName="checked" label={<span className="font-semibold text-gray-700">Recommended</span>}>
            <CustomSwitch checkedChildren="Yes" unCheckedChildren="No" size="default" />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked" label={<span className="font-semibold text-gray-700">Is Active</span>}>
            <CustomSwitch checkedChildren="Active" unCheckedChildren="Inactive" size="default" />
          </Form.Item>

          <Form.Item name="status" valuePropName="checked" label={<span className="font-semibold text-gray-700">Status</span>}>
            <CustomSwitch checkedChildren="On" unCheckedChildren="Off" size="default" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SubscriptionModal;
