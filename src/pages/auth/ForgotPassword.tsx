import React, { useState } from "react";
import { Form, message } from "antd";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import CustomInput from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faCheckCircle,
  faShieldAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { PRIMARY } from "../../config/antdTheme";

const ForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const handleSendOtp = async (values: { email: string }) => {
    try {
      const res = await forgotPassword({ email: values.email }).unwrap();
      if (res) {
        setEmail(values.email);
        message.success("OTP sent to your email!");
        setCurrentStep(1);
      }
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
          dispatch(
            setUser({
              user: {
                id: userData.id,
                name: userData.name || userData.email,
                email: userData.email,
                role: userData.role,
              },
              token,
            }),
          );
          message.success("Password reset successful! Welcome back.");
          navigate("/");
        }
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Invalid OTP or request failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: PRIMARY }}
      ></div>
      <div
        className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: PRIMARY }}
      ></div>

      <div
        style={{ boxShadow: "1px 1px 25px" }}
        className="relative z-10 w-full max-w-[450px] mx-4 bg-white rounded-md overflow-hidden border border-gray-100"
      >
        <div className="p-6 md:p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon
                icon={currentStep === 0 ? faShieldAlt : faLock}
                className="text-primary text-3xl"
              />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {currentStep === 0 ? "Recover Password" : "New Credentials"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              {currentStep === 0
                ? "Enter your email to receive OTP code"
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {currentStep === 0 ? (
            <Form
              layout="vertical"
              onFinish={handleSendOtp}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <CustomInput
                  prefix={
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-300 mr-2"
                    />
                  }
                  placeholder="Email Address"
                  size="md"
                />
              </Form.Item>
              <Button
                variant="primary"
                htmlType="submit"
                loading={isSendingOtp}
                block
                size="lg"
                className="font-bold h-11 mt-2"
              >
                Send OTP Code
              </Button>
              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="text-gray-400 text-xs font-bold hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to Sign In
                </Link>
              </div>
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
                rules={[{ required: true, message: "Please enter the OTP" }]}
              >
                <CustomInput
                  placeholder="Enter OTP Code"
                  size="md"
                  className="tracking-[0.5em] text-center font-black text-xl bg-gray-50"
                  maxLength={6}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Enter new password" },
                  { min: 6, message: "Minimum 6 characters" },
                ]}
              >
                <CustomInput.Password
                  prefix={
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-gray-300 mr-2"
                    />
                  }
                  placeholder="New Password"
                  size="md"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!"),
                      );
                    },
                  }),
                ]}
              >
                <CustomInput.Password
                  prefix={
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-gray-300 mr-2"
                    />
                  }
                  placeholder="Confirm New Password"
                  size="md"
                />
              </Form.Item>

              <div className="flex flex-col gap-3 mt-8">
                <Button
                  variant="primary"
                  htmlType="submit"
                  loading={isResetting}
                  size="lg"
                  block
                  className="font-bold h-11"
                >
                  Reset & Sign In
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(0)}
                  className="border-none text-gray-400 hover:text-primary font-bold text-xs"
                >
                  Change Email address?
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
