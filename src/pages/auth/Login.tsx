import React from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setUser, type TUser } from "../../redux/features/auth/authSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: any) => {
    const hide = message.loading("Logging in...", 0);
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (res.success) {
        const user: TUser = {
          id: res.data.id,
          name: res.data.profile?.name || res.data.email,
          email: res.data.email,
          role: res.data.role?.role || res.data.role,
        };

        dispatch(setUser({ user, token: res.data.token || res.token }));
        message.success("Login successful!");
        navigate("/");
      } else {
        message.error(res.message || "Login failed");
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong. Please try again.");
    } finally {
      hide();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Illustration or Brand */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">KajLagbe</h1>
            <p className="text-blue-100 text-lg">Admin Control Panel</p>
            <div className="mt-8">
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border border-white/20">
                <LoginOutlined style={{ fontSize: '40px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
          </div>

          <Form
            name="login_form"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Email Address" 
                className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 font-bold text-lg"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} KajLagbe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
