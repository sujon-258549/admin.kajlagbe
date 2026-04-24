import React from "react";
import { Modal, Form, message } from "antd";
import { useChangeEmployeePasswordMutation } from "../../../redux/features/employApi/employApi";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../redux/features/auth/authSlice";
import CustomInput from "../../ui/Input";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShieldAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangeEmployeePasswordMutation();

  const handleFinish = async (values: any) => {
    try {
      const res: any = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      if (res.success || res.isLogin || res.data) {
        const userData = res.data?.user || res.data;
        const token = res.data?.accessToken || res.accessToken;

        if (token && userData) {
          dispatch(setUser({ user: userData, token: token }));
        }
        
        message.success("Password updated and session refreshed!");
        form.resetFields();
        onClose();
      }
    } catch (err: any) {
      message.error(
        err?.data?.message ||
          "Failed to update password. Please check your current password.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={
        <FontAwesomeIcon
          icon={faTimes}
          className="text-gray-400 hover:text-rose-500 transition-colors"
        />
      }
      centered
      width={420}
      styles={{
        body: {
          padding: 0,
          margin: 0,
        },
      }}
      className="overflow-hidden rounded-md"
    >
      <div className="">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faLock} className="text-primary text-base" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">Change Password</h2>
            <p className="text-gray-500 text-xs font-medium">Keep your account secure</p>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <FontAwesomeIcon
            icon={faShieldAlt}
            className="text-blue-500 mt-1"
          />
          <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
            Strong passwords include a mix of uppercase, lowercase, numbers, and symbols.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="oldPassword"
            label={
              <span className="font-bold text-gray-700 text-sm">
                Current Password
              </span>
            }
            rules={[
              { required: true, message: "Please enter current password" },
            ]}
          >
            <CustomInput.Password
              placeholder="Enter current password"
              size="md"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={
              <span className="font-bold text-gray-700 text-sm">
                New Password
              </span>
            }
            rules={[
              { required: true, message: "New password is required" },
              { min: 6, message: "Must be at least 6 characters" },
            ]}
          >
            <CustomInput.Password
              placeholder="Enter new password"
              size="md"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span className="font-bold text-gray-700 text-sm">
                Confirm Password
              </span>
            }
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <CustomInput.Password
              placeholder="Confirm new password"
              size="md"
            />
          </Form.Item>

          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              htmlType="submit"
              loading={isLoading}
              className="flex-1 font-bold"
            >
              Update Now
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
