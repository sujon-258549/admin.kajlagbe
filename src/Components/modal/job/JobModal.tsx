import { Modal, Form, Input, Space } from "antd";
import { useEffect } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import CustomButton from "../../ui/Button";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { TJob } from "../../types";

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editData?: TJob | null;
  isLoading?: boolean;
}

const jobTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
  { label: "Freelance", value: "Freelance" },
];

const experienceOptions = [
  { label: "Fresher (0 year)", value: "Fresher" },
  { label: "1-2 Years", value: "1-2 Years" },
  { label: "3-5 Years", value: "3-5 Years" },
  { label: "5-8 Years", value: "5-8 Years" },
  { label: "8+ Years", value: "8+ Years" },
];

const categoryOptions = [
  { label: "Technology", value: "Technology" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Education", value: "Education" },
  { label: "Finance", value: "Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Design", value: "Design" },
  { label: "Engineering", value: "Engineering" },
  { label: "Operations", value: "Operations" },
];

const subCategoryOptions = [
  { label: "Frontend Developer", value: "Frontend Developer" },
  { label: "Backend Developer", value: "Backend Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "DevOps Engineer", value: "DevOps Engineer" },
  { label: "Data Analyst", value: "Data Analyst" },
  { label: "Product Manager", value: "Product Manager" },
  { label: "QA Engineer", value: "QA Engineer" },
];

const JobModal = ({ open, onClose, onSubmit, editData, isLoading }: JobModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue(editData);
      } else {
        form.resetFields();
        form.setFieldsValue({
          isRemote: false,
          isUrgent: false,
          status: true,
          skills: [""],
        });
      }
    }
  }, [editData, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const cleanedSkills = (values.skills || []).filter((s: string) => s && s.trim() !== "");
      onSubmit({
        ...values,
        skills: cleanedSkills,
      });
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      title={
        <ModalHeader
          title={editData ? "Update Job Post" : "Create Job Post"}
          subTitle={
            editData
              ? "Edit the job posting details."
              : "Fill in the details to publish a new job."
          }
          center={false}
        />
      }
      okText={editData ? "Update" : "Publish"}
      cancelText="Cancel"
      okButtonProps={{
        className: "!bg-primary !border-primary !rounded-lg !font-semibold",
      }}
      cancelButtonProps={{
        className: "!rounded-lg !font-semibold",
      }}
      width={860}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
        initialValues={{ isRemote: false, isUrgent: false, status: true, skills: [""] }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label={<span className="font-semibold text-gray-700">Job Title</span>}
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <CustomInput placeholder="e.g., Senior React Developer" size="md" />
          </Form.Item>

          <Form.Item
            name="company"
            label={<span className="font-semibold text-gray-700">Company</span>}
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <CustomInput placeholder="e.g., Kajlagbe Ltd." size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="location"
            label={<span className="font-semibold text-gray-700">Location</span>}
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <CustomInput placeholder="e.g., Dhaka, Bangladesh" size="md" />
          </Form.Item>

          <Form.Item
            name="type"
            label={<span className="font-semibold text-gray-700">Job Type</span>}
            rules={[{ required: true, message: "Please select job type" }]}
          >
            <CustomSelect options={jobTypeOptions} placeholder="Select job type" size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label={<span className="font-semibold text-gray-700">Category</span>}
            rules={[{ required: true, message: "Please select category" }]}
          >
            <CustomSelect options={categoryOptions} placeholder="Select category" size="md" />
          </Form.Item>

          <Form.Item
            name="subCategory"
            label={<span className="font-semibold text-gray-700">Sub-Category</span>}
            rules={[{ required: true, message: "Please select sub-category" }]}
          >
            <CustomSelect options={subCategoryOptions} placeholder="Select sub-category" size="md" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            name="salaryMin"
            label={<span className="font-semibold text-gray-700">Min Salary (৳)</span>}
            rules={[{ required: true, message: "Required" }]}
          >
            <CustomInput placeholder="e.g., 30000" size="md" />
          </Form.Item>

          <Form.Item
            name="salaryMax"
            label={<span className="font-semibold text-gray-700">Max Salary (৳)</span>}
            rules={[{ required: true, message: "Required" }]}
          >
            <CustomInput placeholder="e.g., 60000" size="md" />
          </Form.Item>

          <Form.Item
            name="experience"
            label={<span className="font-semibold text-gray-700">Experience</span>}
            rules={[{ required: true, message: "Please select experience" }]}
          >
            <CustomSelect options={experienceOptions} placeholder="Select" size="md" />
          </Form.Item>
        </div>

        <Form.Item
          name="deadline"
          label={<span className="font-semibold text-gray-700">Application Deadline</span>}
          rules={[{ required: true, message: "Please enter deadline date" }]}
        >
          <CustomInput placeholder="e.g., 31-03-2026" size="md" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-gray-700">Job Description</span>}
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <CustomInput.TextArea placeholder="Describe the role, responsibilities and benefits..." rows={4} />
        </Form.Item>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 text-sm mb-2">Required Skills</label>
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      style={{ marginBottom: 0, width: "780px" }}
                    >
                      <Input placeholder="Skill, e.g. React.js" className="rounded-lg border-gray-200" />
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
                    Add Skill
                  </CustomButton>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <Form.Item name="isRemote" valuePropName="checked" label={<span className="font-semibold text-gray-700">Remote Job</span>}>
            <CustomSwitch checkedChildren="Yes" unCheckedChildren="No" size="default" />
          </Form.Item>

          <Form.Item name="isUrgent" valuePropName="checked" label={<span className="font-semibold text-gray-700">Urgent Hiring</span>}>
            <CustomSwitch checkedChildren="Yes" unCheckedChildren="No" size="default" />
          </Form.Item>

          <Form.Item name="status" valuePropName="checked" label={<span className="font-semibold text-gray-700">Status</span>}>
            <CustomSwitch checkedChildren="Active" unCheckedChildren="Inactive" size="default" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default JobModal;
