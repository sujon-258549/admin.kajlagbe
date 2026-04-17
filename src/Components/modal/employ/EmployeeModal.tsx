import { Modal, Form, Select, Input } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import {
  PRISMA_ROLES,
  ROLE_LABELS,
  type EmployeeModalSubmit,
  type EmployeeRow,
  type PrismaRole,
} from "../../types";

const { Option } = Select;

export type Employee = EmployeeRow;

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeModalSubmit) => void | Promise<void>;
  editData?: EmployeeRow | null;
  submitting?: boolean;
}

const normalizeMobile = (phone: string) => phone.replace(/\s+/g, "").trim();

const EmployeeModal = ({
  open,
  onClose,
  onSubmit,
  editData,
  submitting = false,
}: EmployeeModalProps) => {
  const [form] = Form.useForm<EmployeeModalSubmit & { confirmPassword?: string }>();
  const isEdit = !!editData;

  useEffect(() => {
    if (!open) return;
    if (editData) {
      form.setFieldsValue({
        name: editData.name === "—" ? "" : editData.name,
        email: editData.email,
        mobile: editData.phone,
        role: editData.role,
        isActive: editData.status === "Active",
        designation: editData.designation === "—" ? "" : editData.designation,
        department: editData.department === "—" ? "" : editData.department,
        password: undefined,
        confirmPassword: undefined,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        role: "EMPLOYEE" satisfies PrismaRole,
      });
    }
  }, [editData, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const mobile = normalizeMobile(values.mobile);
      const payload: EmployeeModalSubmit = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        mobile,
        role: values.role,
        isActive: values.isActive,
        designation: values.designation?.trim() ?? "",
        department: values.department?.trim() ?? "",
      };
      if (values.password) {
        payload.password = values.password;
      }
      await onSubmit(payload);
      form.resetFields();
    } catch {
      /* validation or API error — parent keeps modal open on failure */
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={submitting}
      title={
        <ModalHeader
          title={isEdit ? "Update Employee" : "Add New Employee"}
          subTitle={
            isEdit
              ? "Edit user account (Prisma User + Profile + WorkInfo fields)."
              : "Creates User (email, password, mobile, role, isActive) plus Profile.name and WorkInfo (designation / department)."
          }
          center={false}
        />
      }
      okText={isEdit ? "Update" : "Create"}
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: "#052e16",
          borderColor: "#052e16",
          fontWeight: 600,
        },
      }}
      width={660}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-2"
        initialValues={{
          isActive: true,
          role: "EMPLOYEE" satisfies PrismaRole,
        }}
      >
        <Form.Item
          name="name"
          label="Full name (Profile.name)"
          rules={[{ required: true, message: "Please enter employee name" }]}
        >
          <CustomInput placeholder="e.g. Sujon Ahmed" size="md" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Email (User.email)"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <CustomInput placeholder="e.g. sujon@example.com" size="md" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile (User.mobile / Profile.mobile)"
            rules={[{ required: true, message: "Please enter mobile number" }]}
          >
            <CustomInput placeholder="e.g. +8801711000001" size="md" />
          </Form.Item>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="password"
              label="Password (User.password)"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "At least 8 characters" },
              ]}
            >
              <Input.Password placeholder="Min. 8 characters" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repeat password" />
            </Form.Item>
          </div>
        )}

        {isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="password"
              label="New password (optional)"
              rules={[
                {
                  min: 8,
                  message: "At least 8 characters",
                },
              ]}
            >
              <Input.Password placeholder="Leave blank to keep current" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const pw = getFieldValue("password");
                    if (!pw && !value) return Promise.resolve();
                    if (!value) {
                      return Promise.reject(
                        new Error("Confirm the new password"),
                      );
                    }
                    if (pw === value) return Promise.resolve();
                    return Promise.reject(
                      new Error("Passwords do not match"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repeat new password" />
            </Form.Item>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="designation"
            label="Designation → WorkInfo.experience"
            rules={[{ required: true, message: "Enter designation" }]}
          >
            <CustomInput placeholder="e.g. Software Engineer" size="md" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department → WorkInfo.workType"
            rules={[{ required: true, message: "Enter department" }]}
          >
            <CustomInput placeholder="e.g. Engineering" size="md" />
          </Form.Item>
        </div>

        <Form.Item
          name="role"
          label="Role (User.role enum)"
          rules={[{ required: true, message: "Select role" }]}
        >
          <CustomSelect placeholder="Select role" size="md">
            {PRISMA_ROLES.map((r) => (
              <Option key={r} value={r}>
                {ROLE_LABELS[r]}
              </Option>
            ))}
          </CustomSelect>
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked" label="Active (User.isActive)">
          <CustomSwitch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
