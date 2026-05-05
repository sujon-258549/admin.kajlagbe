import { Drawer, Form, Select, DatePicker, Divider, Tag } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import { useGetAllTenantsQuery } from "../../../redux/features/tenant/tenantApi";
import { useGetAllSubscriptionsQuery } from "../../../redux/features/subscriptionApi/subscriptionApi";
import { useUpdateEmployeeMutation } from "../../../redux/features/employApi/employApi";
import dayjs from "dayjs";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBriefcase, faCalendarAlt, faCreditCard } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

interface UserSubscriptionDrawerProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const UserSubscriptionDrawer = ({
  open,
  onClose,
  user,
}: UserSubscriptionDrawerProps) => {
  const [form] = Form.useForm();
  const { data: tenantsRes, isLoading: tenantsLoading } = useGetAllTenantsQuery({});
  const { data: subsRes, isLoading: subsLoading } = useGetAllSubscriptionsQuery({});
  const [updateUser, { isLoading: updating }] = useUpdateEmployeeMutation();

  const tenants = tenantsRes?.data || [];
  const subscriptions = subsRes?.data || [];

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        tenantId: user.tenantId,
        subscriptionId: user.subscriptionId,
        subscriptionExpiry: user.subscriptionExpiry ? dayjs(user.subscriptionExpiry) : null,
        division: user.address?.division,
        district: user.address?.district,
        address: user.address?.address,
      });
    }
  }, [open, user, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        id: user.id,
        data: {
          user: {
            email: values.email,
            mobile: values.mobile,
            tenantId: values.tenantId,
            subscriptionId: values.subscriptionId,
            subscriptionExpiry: values.subscriptionExpiry ? values.subscriptionExpiry.toISOString() : null,
          },
          profile: {
            name: values.name,
          },
          address: {
            division: values.division,
            district: values.district,
            address: values.address,
          }
        },
      };

      const res: any = await updateUser(payload).unwrap();
      if (res) {
        toast.success("User subscription and info updated successfully");
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  return (
    <Drawer
      title={
        <ModalHeader
          title="User Subscription & Brand"
          subTitle="Manage user's subscription, brand association, and basic details."
          center={false}
        />
      }
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      extra={
        <div className="flex gap-2">
           <button 
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleUpdate}
             disabled={updating}
             className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
           >
             {updating ? "Saving..." : "Save Changes"}
           </button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="pb-10">
        <Divider plain className="!mt-8 !mb-4">
           <span className="flex items-center gap-2 text-primary font-bold uppercase text-xs">
             <FontAwesomeIcon icon={faUser} /> Basic Information
           </span>
        </Divider>
        
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <CustomInput placeholder="Full Name" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <CustomInput placeholder="Email" />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
            <CustomInput placeholder="Mobile" />
          </Form.Item>
        </div>

        <Divider plain className="!mt-8 !mb-4">
           <span className="flex items-center gap-2 text-primary font-bold uppercase text-xs">
             <FontAwesomeIcon icon={faBriefcase} /> Brand Association
           </span>
        </Divider>

        <Form.Item name="tenantId" label="Assign Brand (Tenant)">
          <CustomSelect placeholder="Select Brand" loading={tenantsLoading}>
            {tenants.map((t: any) => (
              <Option key={t.id} value={t.id}>{t.name}</Option>
            ))}
          </CustomSelect>
        </Form.Item>

        <Divider plain className="!mt-8 !mb-4">
           <span className="flex items-center gap-2 text-primary font-bold uppercase text-xs">
             <FontAwesomeIcon icon={faCreditCard} /> Subscription Plan
           </span>
        </Divider>

        <Form.Item name="subscriptionId" label="Subscription Plan">
          <CustomSelect placeholder="Select Plan" loading={subsLoading}>
            {subscriptions.map((s: any) => (
              <Option key={s.id} value={s.id}>
                <div className="flex justify-between items-center w-full pr-2">
                  <span>{s.name}</span>
                  <Tag color="purple">৳{s.price}</Tag>
                </div>
              </Option>
            ))}
          </CustomSelect>
        </Form.Item>

        <Form.Item name="subscriptionExpiry" label="Subscription Expiry">
          <DatePicker className="w-full" format="DD-MM-YYYY" placeholder="Select Expiry Date" />
        </Form.Item>

        <Divider plain className="!mt-8 !mb-4">
           <span className="flex items-center gap-2 text-primary font-bold uppercase text-xs">
             <FontAwesomeIcon icon={faCalendarAlt} /> Address Details
           </span>
        </Divider>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="division" label="Division">
            <CustomInput placeholder="Division" />
          </Form.Item>
          <Form.Item name="district" label="District">
            <CustomInput placeholder="District" />
          </Form.Item>
        </div>
        <Form.Item name="address" label="Full Address">
          <CustomInput placeholder="Full Address" />
        </Form.Item>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
           <p className="text-[11px] text-blue-700 leading-relaxed">
             <span className="font-bold">Pro Tip:</span> Changing the brand association will move the user's data access context. Subscription changes take effect immediately.
           </p>
        </div>
      </Form>
    </Drawer>
  );
};

export default UserSubscriptionDrawer;
