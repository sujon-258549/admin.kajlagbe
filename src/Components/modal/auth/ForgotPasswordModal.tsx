import React, { useState } from "react";
import { Modal, Form, message, Steps } from "antd";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../../redux/features/auth/authApi";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../ui/Input";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faLock,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async (values: { email: string }) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      setEmail(values.email);
      message.success("OTP sent to your email!");
      setCurrentStep(1);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      const res: any = await resetPassword({
        email,
        otp: values.otp,
        password: values.password,
      }).unwrap();

      if (res.success || res.isLogin || res.data) {
        const userData = res.data?.user || res.data;
        const token = res.data?.accessToken || res.accessToken;

        if (token && userData) {
          // Auto-login after successful reset
          dispatch(setUser({ 
            user: {
              id: userData.id,
              name: userData.name || userData.email,
              email: userData.email,
              role: userData.role,
            }, 
            token 
          }));
          
          message.success("Password reset successful! Welcome back.");
          form.resetFields();
          setCurrentStep(0);
          onClose();
          navigate("/"); // Navigate to dashboard
        }
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Invalid OTP or request failed.");
    }
  };

  const steps = [
    { title: "Verify Email", icon: faEnvelope },
    { title: "Reset", icon: faKey },
  ];

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        setTimeout(() => setCurrentStep(0), 500);
      }}
      footer={null}
      closeIcon={
        <FontAwesomeIcon
          icon={faTimes}
          className="text-gray-400 hover:text-rose-500 transition-colors"
        />
      }
      centered
      width={450}
      styles={{ body: { padding: 0 } }}
      className="overflow-hidden rounded-md"
    >
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon 
              icon={currentStep === 0 ? faEnvelope : faLock} 
              className="text-primary text-2xl" 
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentStep === 0 ? "Forgot Password?" : "Set New Password"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {currentStep === 0 
              ? "Enter your email to receive a 6-digit OTP code" 
              : `We've sent a code to ${email}`}
          </p>
        </div>

        <Steps
          current={currentStep}
          responsive={false}
          className="mb-8 px-4"
          items={steps.map((item) => ({
            title: <span className="text-xs font-bold">{item.title}</span>,
            icon: <FontAwesomeIcon icon={item.icon} className="text-[10px]" />,
          }))}
        />

        {currentStep === 0 ? (
          <Form layout="vertical" onFinish={handleSendOtp} requiredMark={false}>
            <Form.Item
              name="email"
              label={<span className="font-bold text-gray-700">Email Address</span>}
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <CustomInput
                prefix={<FontAwesomeIcon icon={faEnvelope} className="text-gray-300 mr-2" />}
                placeholder="e.g. sujon@example.com"
                size="md"
              />
            </Form.Item>
            <Button
              variant="primary"
              htmlType="submit"
              loading={isSendingOtp}
              block
              size="lg"
              className="font-bold mt-2"
            >
              Send OTP Code
            </Button>
          </Form>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleResetPassword}
            requiredMark={false}
          >
            <Form.Item
              name="otp"
              label={<span className="font-bold text-gray-700">6-Digit OTP</span>}
              rules={[{ required: true, message: "Please enter the OTP" }]}
            >
              <CustomInput
                placeholder="0 0 0 0 0 0"
                size="md"
                className="tracking-[0.5em] text-center font-black text-lg"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-bold text-gray-700">New Password</span>}
              rules={[
                { required: true, message: "Enter new password" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <CustomInput.Password
                prefix={<FontAwesomeIcon icon={faLock} className="text-gray-300 mr-2" />}
                placeholder="Enter strong password"
                size="md"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="font-bold text-gray-700">Confirm Password</span>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <CustomInput.Password
                prefix={<FontAwesomeIcon icon={faCheckCircle} className="text-gray-300 mr-2" />}
                placeholder="Repeat new password"
                size="md"
              />
            </Form.Item>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(0)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="primary"
                htmlType="submit"
                loading={isResetting}
                size="md"
                className="flex-1 font-bold"
              >
                Reset Password
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
