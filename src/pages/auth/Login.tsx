import React from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setUser, type TUser } from "../../redux/features/auth/authSlice";
import { PRIMARY } from "../../config/antdTheme";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: any) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (res.success || res.isLogin) {
        const userData = res.data.user;
        const user: TUser = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role,
        };

        dispatch(setUser({ user, token: res.data.accessToken }));
        message.success(res.message || "Login successful!");
        navigate("/");
      } else {
        message.error(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      message.error(
        err?.data?.message || "Connection failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden border border-gray-400">
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
        className="relative z-10 w-full max-w-[850px] mx-4 bg-white rounded-md overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Branding Section - Using Primary Color */}
        <div
          className="w-full md:w-[45%] p-12 flex flex-col items-center justify-center text-white relative"
          style={{ backgroundColor: PRIMARY }}
        >
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-black mb-4 tracking-tight">
              KajLagbe
            </h1>
            <p className="text-gray-300 text-lg font-medium opacity-90">
              Admin Control Panel
            </p>

            <div className="mt-12 flex justify-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                <LoginOutlined style={{ fontSize: "40px", color: "white" }} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 text-center opacity-30 text-[10px] tracking-widest uppercase">
            Professional Admin Suite
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to continue to your dashboard
            </p>
          </div>

          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              className="mb-5"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                placeholder="Email Address"
                className="h-11 rounded-md border-gray-300 bg-gray-50/30"
              />
            </Form.Item>

            <Form.Item
              name="password"
              className="mb-5"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
                placeholder="Password"
                className="h-11 rounded-md border-gray-300 bg-gray-50/30"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-8">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600 font-medium">
                  Remember me
                </Checkbox>
              </Form.Item>
              <a
                href="#"
                className="text-sm font-bold transition-all"
                style={{ color: PRIMARY }}
              >
                Forgot password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-11 rounded-md border-none font-bold text-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ backgroundColor: PRIMARY }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-xs font-medium">
              &copy; {new Date().getFullYear()} KajLagbe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
