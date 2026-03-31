import { Modal, Form, Input } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import ModalHeader from "../../common/ModalHeader";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import CustomButton from "../../ui/Button";

export interface Subscription {
  id: string;
  name: string;
  slug: string;
  price: string;
  discount: string;
  duration: string;
  activeDays: number;
  description?: string;
  isRecomended: boolean;
  featured: string[];
  isActive: boolean;
  status: boolean;
  createdAt: string;
}

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
  const [isRecomended, setIsRecomended] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState(true);
  const [featuredList, setFeaturedList] = useState<string[]>([""]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        slug: editData.slug,
        price: editData.price,
        discount: editData.discount,
        duration: editData.duration,
        activeDays: editData.activeDays,
        description: editData.description,
      });
      setIsRecomended(editData.isRecomended);
      setIsActive(editData.isActive);
      setStatus(editData.status);
      setFeaturedList(editData.featured.length > 0 ? editData.featured : [""]);
    } else {
      form.resetFields();
      setIsRecomended(false);
      setIsActive(true);
      setStatus(true);
      setFeaturedList([""]);
    }
  }, [editData, form, open]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const cleanedFeatured = featuredList.filter((f) => f.trim() !== "");
      onSubmit({
        ...values,
        activeDays: Number(values.activeDays),
        isRecomended,
        isActive,
        status,
        featured: cleanedFeatured,
      });
      onClose();
    });
  };

  const addFeature = () => setFeaturedList((prev) => [...prev, ""]);

  const removeFeature = (idx: number) =>
    setFeaturedList((prev) => prev.filter((_, i) => i !== idx));

  const updateFeature = (idx: number, val: string) =>
    setFeaturedList((prev) => prev.map((f, i) => (i === idx ? val : f)));

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
      <Form form={form} layout="vertical" className="pt-4">
        {/* Row 1: Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Plan Name</span>
            }
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

        {/* Row 2: Price + Discount */}
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
            label={
              <span className="font-semibold text-gray-700">Discount</span>
            }
            rules={[{ required: true, message: "Please enter discount" }]}
          >
            <CustomInput placeholder="e.g., 10% or 100" size="md" />
          </Form.Item>
        </div>

        {/* Row 3: Duration + Active Days */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label={
              <span className="font-semibold text-gray-700">Duration</span>
            }
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <CustomInput
              placeholder="e.g., Monthly, Yearly, 3 Months"
              size="md"
            />
          </Form.Item>

          <Form.Item
            name="activeDays"
            label={
              <span className="font-semibold text-gray-700">Active Days</span>
            }
            rules={[{ required: true, message: "Please enter active days" }]}
          >
            <CustomInput placeholder="e.g., 30, 365" size="md" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          name="description"
          label={
            <span className="font-semibold text-gray-700">Description</span>
          }
        >
          <CustomInput.TextArea
            placeholder="Brief description about this plan..."
            rows={3}
          />
        </Form.Item>

        {/* Featured bullets */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 text-sm mb-2">
            Featured Points
          </label>
          <div className="space-y-2">
            {featuredList.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={feat}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  placeholder={`Feature ${idx + 1}, e.g., Unlimited Job Posts`}
                  className="rounded-lg border-gray-200 focus:border-primary"
                />
                {featuredList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <MinusCircleOutlined className="text-lg" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={addFeature}
            icon={<PlusOutlined />}
            className="mt-2"
          >
            Add Feature
          </CustomButton>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Recommended</span>
            }
          >
            <div className="flex items-center gap-3">
              <CustomSwitch
                checked={isRecomended}
                onChange={setIsRecomended}
                checkedChildren="Yes"
                unCheckedChildren="No"
                size="default"
              />
            </div>
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Is Active</span>
            }
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

          <Form.Item
            label={<span className="font-semibold text-gray-700">Status</span>}
          >
            <div className="flex items-center gap-3">
              <CustomSwitch
                checked={status}
                onChange={setStatus}
                checkedChildren="On"
                unCheckedChildren="Off"
                size="default"
              />
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SubscriptionModal;
