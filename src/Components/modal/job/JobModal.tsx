import { Modal, Form, Input } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import CustomButton from "../../ui/Button";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  subCategory: string;
  salaryMin: string;
  salaryMax: string;
  experience: string;
  deadline: string;
  description: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  status: boolean;
  createdAt: string;
}

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Job, "id" | "createdAt">) => void;
  editData?: Job | null;
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

const JobModal = ({ open, onClose, onSubmit, editData }: JobModalProps) => {
  const [form] = Form.useForm();
  const [isRemote, setIsRemote] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [status, setStatus] = useState(true);
  const [skills, setSkills] = useState<string[]>([""]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        title: editData.title,
        company: editData.company,
        location: editData.location,
        type: editData.type,
        category: editData.category,
        subCategory: editData.subCategory,
        salaryMin: editData.salaryMin,
        salaryMax: editData.salaryMax,
        experience: editData.experience,
        deadline: editData.deadline,
        description: editData.description,
      });
      setIsRemote(editData.isRemote);
      setIsUrgent(editData.isUrgent);
      setStatus(editData.status);
      setSkills(editData.skills.length > 0 ? editData.skills : [""]);
    } else {
      form.resetFields();
      setIsRemote(false);
      setIsUrgent(false);
      setStatus(true);
      setSkills([""]);
    }
  }, [editData, form, open]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const cleanedSkills = skills.filter((s) => s.trim() !== "");
      onSubmit({
        ...values,
        isRemote,
        isUrgent,
        status,
        skills: cleanedSkills,
      });
      onClose();
    });
  };

  const addSkill = () => setSkills((prev) => [...prev, ""]);
  const removeSkill = (idx: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  const updateSkill = (idx: number, val: string) =>
    setSkills((prev) => prev.map((s, i) => (i === idx ? val : s)));

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
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
      <Form form={form} layout="vertical" className="pt-4">
        {/* Row 1: Title + Company */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label={
              <span className="font-semibold text-gray-700">Job Title</span>
            }
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

        {/* Row 2: Location + Type */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="location"
            label={
              <span className="font-semibold text-gray-700">Location</span>
            }
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <CustomInput placeholder="e.g., Dhaka, Bangladesh" size="md" />
          </Form.Item>

          <Form.Item
            name="type"
            label={
              <span className="font-semibold text-gray-700">Job Type</span>
            }
            rules={[{ required: true, message: "Please select job type" }]}
          >
            <CustomSelect
              options={jobTypeOptions}
              placeholder="Select job type"
              size="md"
            />
          </Form.Item>
        </div>

        {/* Row 3: Category + SubCategory */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label={
              <span className="font-semibold text-gray-700">Category</span>
            }
            rules={[{ required: true, message: "Please select category" }]}
          >
            <CustomSelect
              options={categoryOptions}
              placeholder="Select category"
              size="md"
            />
          </Form.Item>

          <Form.Item
            name="subCategory"
            label={
              <span className="font-semibold text-gray-700">Sub-Category</span>
            }
            rules={[{ required: true, message: "Please select sub-category" }]}
          >
            <CustomSelect
              options={subCategoryOptions}
              placeholder="Select sub-category"
              size="md"
            />
          </Form.Item>
        </div>

        {/* Row 4: Salary Range + Experience */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            name="salaryMin"
            label={
              <span className="font-semibold text-gray-700">
                Min Salary (৳)
              </span>
            }
            rules={[{ required: true, message: "Required" }]}
          >
            <CustomInput placeholder="e.g., 30000" size="md" />
          </Form.Item>

          <Form.Item
            name="salaryMax"
            label={
              <span className="font-semibold text-gray-700">
                Max Salary (৳)
              </span>
            }
            rules={[{ required: true, message: "Required" }]}
          >
            <CustomInput placeholder="e.g., 60000" size="md" />
          </Form.Item>

          <Form.Item
            name="experience"
            label={
              <span className="font-semibold text-gray-700">Experience</span>
            }
            rules={[{ required: true, message: "Please select experience" }]}
          >
            <CustomSelect
              options={experienceOptions}
              placeholder="Select"
              size="md"
            />
          </Form.Item>
        </div>

        {/* Deadline */}
        <Form.Item
          name="deadline"
          label={
            <span className="font-semibold text-gray-700">
              Application Deadline
            </span>
          }
          rules={[{ required: true, message: "Please enter deadline date" }]}
        >
          <CustomInput placeholder="e.g., 31-03-2026" size="md" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label={
            <span className="font-semibold text-gray-700">Job Description</span>
          }
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <CustomInput.TextArea
            placeholder="Describe the role, responsibilities and benefits..."
            rows={4}
          />
        </Form.Item>

        {/* Skills */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 text-sm mb-2">
            Required Skills
          </label>
          <div className="space-y-2">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(idx, e.target.value)}
                  placeholder={`Skill ${idx + 1}, e.g., React.js, Node.js`}
                  className="rounded-lg border-gray-200 focus:border-primary"
                />
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
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
            onClick={addSkill}
            icon={<PlusOutlined />}
            className="mt-2"
          >
            Add Skill
          </CustomButton>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Remote Job</span>
            }
          >
            <CustomSwitch
              checked={isRemote}
              onChange={setIsRemote}
              checkedChildren="Yes"
              unCheckedChildren="No"
              size="default"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Urgent Hiring</span>
            }
          >
            <CustomSwitch
              checked={isUrgent}
              onChange={setIsUrgent}
              checkedChildren="Yes"
              unCheckedChildren="No"
              size="default"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Status</span>}
          >
            <CustomSwitch
              checked={status}
              onChange={setStatus}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              size="default"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default JobModal;
