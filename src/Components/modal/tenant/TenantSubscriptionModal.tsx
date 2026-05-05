import { Modal, Form, Select, DatePicker } from "antd";
import { useEffect } from "react";
import ModalHeader from "../../common/ModalHeader";
import { toast } from "sonner";
import { useGetAllSubscriptionsQuery } from "../../../redux/features/subscriptionApi/subscriptionApi";
import { useUpdateTenantMutation } from "../../../redux/features/tenant/tenantApi";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

interface TenantSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  tenant: any;
}

const TenantSubscriptionModal = ({
  open,
  onClose,
  tenant,
}: TenantSubscriptionModalProps) => {
  const [form] = Form.useForm();
  const { data: subscriptionsRes, isLoading: subsLoading } = useGetAllSubscriptionsQuery({});
  const [updateTenant, { isLoading: updating }] = useUpdateTenantMutation();

  const subscriptions = subscriptionsRes?.data || [];

  useEffect(() => {
    if (open && tenant) {
      form.setFieldsValue({
        subscriptionId: tenant.subscriptionId,
        subscriptionExpiry: tenant.subscriptionExpiry ? dayjs(tenant.subscriptionExpiry) : null,
      });
    }
  }, [open, tenant, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const res: any = await updateTenant({
        id: tenant.id,
        data: {
          subscriptionId: values.subscriptionId,
          subscriptionExpiry: values.subscriptionExpiry ? values.subscriptionExpiry.toISOString() : null,
        },
      }).unwrap();

      if (res?.success) {
        toast.success("Subscription updated successfully");
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update subscription");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={updating}
      title={
        <ModalHeader
          title="Manage Subscription"
          subTitle={`Assign or update subscription plan for ${tenant?.name}`}
          center={false}
        />
      }
      okText="Update Subscription"
      cancelText="Cancel"
      width={550}
      centered
      okButtonProps={{
        className: "!bg-primary !border-primary !rounded-lg",
      }}
      cancelButtonProps={{
        className: "!rounded-lg",
      }}
    >
      <Form form={form} layout="vertical" className="pt-2">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 leading-none">{tenant?.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{tenant?.email || "No email provided"}</p>
          </div>
        </div>

        <Form.Item
          name="subscriptionId"
          label={<span className="font-semibold text-gray-700">Subscription Plan</span>}
          rules={[{ required: true, message: "Please select a plan" }]}
        >
          <Select
            placeholder="Select a subscription plan"
            loading={subsLoading}
            size="large"
            className="w-full"
            options={subscriptions.map((s: any) => ({
              label: (
                <div className="flex justify-between items-center w-full pr-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-primary font-bold">৳{s.price}</span>
                </div>
              ),
              value: s.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="subscriptionExpiry"
          label={<span className="font-semibold text-gray-700">Expiry Date</span>}
        >
          <DatePicker 
            className="w-full" 
            placeholder="Select expiry date" 
            size="large"
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-2">
          <div className="flex gap-2">
            <div className="text-amber-600 mt-0.5 text-xs font-bold">Note:</div>
            <p className="text-xs text-amber-700 leading-relaxed">
              This action will immediately change the tenant's access rights. Ensure the payment has been verified before updating the subscription status.
            </p>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default TenantSubscriptionModal;
