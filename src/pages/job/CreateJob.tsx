import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Card,
  Divider,
  Space,
  Input,
  InputNumber,
  Row,
  Col,
  Spin,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faPlus,
  faTrash,
  faBriefcase,
  faBuilding,
  faLocationDot,
  faMoneyBillWave,
  faInfoCircle,
  faListCheck,
  faGraduationCap,
  faUserTie,
  faLink,
  faTag,
  faClock,
  faPhone,
  faEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import CustomInput from "../../Components/ui/Input";
import CustomSelect from "../../Components/ui/Select";
import CustomSwitch from "../../Components/ui/Switch";
import RichTextEditor from "../../Components/ui/RichTextEditor";
import { useJob } from "../../apihooks/useJob";
import { useCategory } from "../../apihooks/useCategory";
import { useSubCategory } from "../../apihooks/useSubCategory";
import { toast } from "sonner";

const CreateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  const { createJob, updateJob, useGetJobById, isLoading } = useJob();
  const { data: jobData, isLoading: isJobLoading } = useGetJobById(id || "", {
    skip: !isEditMode,
  });

  const { categories } = useCategory();
  const { subCategories } = useSubCategory();

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditMode && jobData?.data) {
      const data = jobData.data;
      form.setFieldsValue({
        ...data,
        deadline: data.deadline ? dayjs(data.deadline, "DD-MM-YYYY") : null,
      });
      setDescription(data.description || "");
    } else if (!isEditMode) {
      form.resetFields();
      form.setFieldsValue({
        status: true,
        isUrgent: false,
        isPublished: true,
        type: "Full-time",
        responsibilities: [""],
        requirements: [""],
        benefits: [""],
      });
    }
  }, [isEditMode, jobData, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        description,
        deadline: values.deadline
          ? dayjs(values.deadline).format("DD-MM-YYYY")
          : null,
      };

      if (isEditMode) {
        const res: any = await updateJob({ id, data: payload }).unwrap();
        if (res?.success) {
          toast.success("Job updated successfully");
          navigate("/job/list");
        }
      } else {
        const res: any = await createJob(payload).unwrap();
        if (res?.success) {
          toast.success("Job posted successfully");
          navigate("/job/list");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isEditMode && isJobLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management", path: "/job/list" },
          { label: isEditMode ? "Edit Job" : "Create Job" },
        ]}
        title={isEditMode ? "Edit Job Posting" : "Create New Job"}
        extra={
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/job/list")}
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Back to List
          </CustomButton>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: true,
          isUrgent: false,
          isPublished: true,
          type: "Full-time",
        }}
      >
        <div className="">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faBriefcase} />
                <span>Basic Information</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="title"
                  label="Job Title"
                  rules={[{ required: true, message: "Enter job title" }]}
                >
                  <CustomInput placeholder="e.g. Senior Backend Developer" />
                </Form.Item>
                <Form.Item name="slug" label="Job Slug">
                  <CustomInput placeholder="e.g. senior-backend-developer" />
                </Form.Item>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="company" label="Company Name">
                    <CustomInput
                      placeholder="e.g. Kajlagbe Ltd."
                      prefix={
                        <FontAwesomeIcon
                          icon={faBuilding}
                          className="text-gray-400"
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true }]}
                  >
                    <CustomInput
                      placeholder="e.g. Dhaka, Bangladesh"
                      prefix={
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="text-gray-400"
                        />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="categoryId" label="Category">
                    <CustomSelect
                      options={categories?.map((c: any) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                      placeholder="Select Category"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="subCategoryId" label="Sub-Category">
                    <CustomSelect
                      options={subCategories?.map((c: any) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                      placeholder="Select Sub-Category"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="industry" label="Industry">
                    <CustomInput placeholder="e.g. IT, Banking" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="vacancy" label="Vacancy">
                  <InputNumber
                    className="w-full!"
                    placeholder="No. of openings"
                  />
                </Form.Item>
                <Form.Item name="jobNature" label="Job Nature">
                  <CustomSelect
                    options={[
                      { label: "On-site", value: "On-site" },
                      { label: "Remote", value: "Remote" },
                      { label: "Hybrid", value: "Hybrid" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="experience" label="Experience">
                  <CustomInput
                    placeholder="e.g. 2-3 years"
                    prefix={
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className="text-gray-400"
                      />
                    }
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="education" label="Education">
                  <CustomInput
                    placeholder="e.g. B.Sc in CSE"
                    prefix={
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="text-gray-400"
                      />
                    }
                  />
                </Form.Item>
                <Form.Item name="gender" label="Gender">
                  <CustomSelect
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Both", value: "Both" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="ageRange" label="Age Range">
                  <CustomInput placeholder="e.g. 25-35 years" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Form.Item name="skills" label="Skills (e.g. React, Node.js)">
                  <CustomSelect mode="tags" placeholder="Add skills" />
                </Form.Item>
                <Form.Item name="tools" label="Tools (e.g. Docker, Git)">
                  <CustomSelect mode="tags" placeholder="Add tools" />
                </Form.Item>
                <Form.Item
                  name="languages"
                  label="Languages (e.g. English, Bengali)"
                >
                  <CustomSelect mode="tags" placeholder="Add languages" />
                </Form.Item>
              </div>
            </Card>

            <Card className="border !mt-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faBuilding} />
                <span>Company Details & Contact</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="email" label="Contact Email">
                  <CustomInput
                    prefix={
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-gray-400"
                      />
                    }
                    placeholder="hr@company.com"
                  />
                </Form.Item>
                <Form.Item name="phone" label="Contact Phone">
                  <CustomInput
                    prefix={
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-gray-400"
                      />
                    }
                    placeholder="+880..."
                  />
                </Form.Item>
                <Form.Item name="website" label="Website">
                  <CustomInput
                    prefix={
                      <FontAwesomeIcon
                        icon={faGlobe}
                        className="text-gray-400"
                      />
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="address" label="Full Address">
                  <CustomInput.TextArea
                    rows={2}
                    placeholder="Full office address..."
                  />
                </Form.Item>
                <Form.Item name="companySize" label="Company Size">
                  <CustomSelect
                    options={[
                      { label: "1-10 Employees", value: "1-10" },
                      { label: "11-50 Employees", value: "11-50" },
                      { label: "51-200 Employees", value: "51-200" },
                      { label: "201-500 Employees", value: "201-500" },
                      { label: "500+ Employees", value: "500+" },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="founded" label="Founded In">
                  <CustomInput placeholder="e.g. 2010" />
                </Form.Item>
                <Form.Item name="ceoName" label="CEO Name">
                  <CustomInput placeholder="CEO Name" />
                </Form.Item>
                <Form.Item name="contactPerson" label="Contact Person">
                  <CustomInput placeholder="HR Manager Name" />
                </Form.Item>
              </div>
            </Card>

            <Card className="border mt-4! border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Job Description</span>
              </div>
              <Divider className="my-3" />

              <Form.Item label="Detailed Description" required>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe the job role, environment, and expectations..."
                  height={400}
                />
              </Form.Item>

              <Form.Item
                name="shortDescription"
                label="Short Summary (for list view)"
              >
                <CustomInput.TextArea
                  rows={3}
                  placeholder="Brief summary of the job..."
                />
              </Form.Item>
            </Card>

            <Card className="border border-gray-200 mt-4!">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faListCheck} />
                <span>Requirements & Responsibilities</span>
              </div>
              <Divider className="my-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Responsibilities">
                  <Form.List name="responsibilities">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name]}
                              style={{ width: "100%", minWidth: "400px" }}
                            >
                              <Input placeholder="Add a responsibility..." />
                            </Form.Item>
                            <CustomButton
                              variant="danger-outline"
                              size="icon-sm"
                              onClick={() => remove(name)}
                              icon={<FontAwesomeIcon icon={faTrash} />}
                            />
                          </Space>
                        ))}
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => add()}
                          icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                          Add Responsibility
                        </CustomButton>
                      </>
                    )}
                  </Form.List>
                </Form.Item>

                <Form.Item label="Requirements">
                  <Form.List name="requirements">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name]}
                              style={{ width: "100%", minWidth: "400px" }}
                            >
                              <Input placeholder="Add a requirement..." />
                            </Form.Item>
                            <CustomButton
                              variant="danger-outline"
                              size="icon-sm"
                              onClick={() => remove(name)}
                              icon={<FontAwesomeIcon icon={faTrash} />}
                            />
                          </Space>
                        ))}
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => add()}
                          icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                          Add Requirement
                        </CustomButton>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </div>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6 mt-4!">
            <Card className="border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span>Salary & Benefits</span>
              </div>
              <Divider className="my-3" />

              <Form.Item name="type" label="Job Type">
                <CustomSelect
                  options={[
                    { label: "Full-time", value: "Full-time" },
                    { label: "Part-time", value: "Part-time" },
                    { label: "Contract", value: "Contract" },
                    { label: "Internship", value: "Internship" },
                    { label: "Freelance", value: "Freelance" },
                  ]}
                />
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="salaryMin" label="Min Salary">
                    <InputNumber className="w-full!" placeholder="Min" min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="salaryMax"
                    label="Max Salary"
                    dependencies={["salaryMin"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("salaryMin") <= value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Max salary must be greater than min salary")
                          );
                        },
                      }),
                    ]}
                  >
                    <InputNumber className="w-full!" placeholder="Max" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="negotiable" valuePropName="checked">
                <CustomSwitch
                  checkedChildren="Negotiable"
                  unCheckedChildren="Fixed"
                />
              </Form.Item>

              <Form.Item label="Benefits">
                <Form.List name="benefits">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex gap-2 mb-2">
                          <Form.Item
                            {...restField}
                            name={[name]}
                            className="mb-0 flex-1"
                          >
                            <Input placeholder="Benefit..." />
                          </Form.Item>
                          <CustomButton
                            variant="danger-outline"
                            size="icon-sm"
                            onClick={() => remove(name)}
                            icon={<FontAwesomeIcon icon={faTrash} />}
                          />
                        </div>
                      ))}
                      <CustomButton
                        variant="dashed"
                        size="sm"
                        onClick={() => add()}
                        block
                      >
                        Add Benefit
                      </CustomButton>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Card>

            <Card className="border !mt-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faClock} />
                <span>Working Hours & Environment</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="workingHours" label="Working Hours">
                  <CustomInput placeholder="e.g. 9 AM - 6 PM" />
                </Form.Item>
                <Form.Item name="weekend" label="Weekend">
                  <CustomInput placeholder="e.g. Friday, Saturday" />
                </Form.Item>
                <Form.Item name="remotePolicy" label="Remote Policy">
                  <CustomInput placeholder="e.g. 2 days remote/week" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="workStartTime" label="Work Start Time">
                  <CustomInput placeholder="e.g. 09:00 AM" />
                </Form.Item>
                <Form.Item name="workTimeLimit" label="Work Time Limit">
                  <CustomInput placeholder="e.g. 8 Hours" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="department" label="Department">
                  <CustomInput placeholder="e.g. Engineering" />
                </Form.Item>
                <Form.Item name="reportingTo" label="Reporting To">
                  <CustomInput placeholder="e.g. CTO" />
                </Form.Item>
                <Form.Item name="teamSize" label="Team Size">
                  <InputNumber
                    className="w-full!"
                    placeholder="No. of team members"
                  />
                </Form.Item>
              </div>
            </Card>

            <Card className="border !mt-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faTag} />
                <span>Additional Benefits & Settings</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="lunchFacility" label="Lunch Facility">
                  <CustomInput placeholder="e.g. Partially Subsidized" />
                </Form.Item>
                <Form.Item name="salaryReview" label="Salary Review">
                  <CustomInput placeholder="e.g. Yearly" />
                </Form.Item>
                <Form.Item name="festivalBonus" label="Festival Bonus">
                  <CustomInput placeholder="e.g. 2 per year" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl">
                  <span className="text-gray-600 text-sm">
                    Performance Bonus
                  </span>
                  <Form.Item
                    name="performanceBonus"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <CustomSwitch />
                  </Form.Item>
                </div>
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl">
                  <span className="text-gray-600 text-sm">
                    Health Insurance
                  </span>
                  <Form.Item
                    name="healthInsurance"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <CustomSwitch />
                  </Form.Item>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="visaSponsorship" valuePropName="checked">
                  <CustomSwitch
                    checkedChildren="Visa Sponsorship"
                    unCheckedChildren="No Visa Sponsorship"
                  />
                </Form.Item>
                <Form.Item name="relocationAssistance" valuePropName="checked">
                  <CustomSwitch
                    checkedChildren="Relocation Assistance"
                    unCheckedChildren="No Relocation Assistance"
                  />
                </Form.Item>
              </div>
            </Card>

            <Card className="border !mt-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Post Visibility & Deadline</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Form.Item name="deadline" label="Application Deadline">
                  <DatePicker
                    className="w-full!"
                    format="DD-MM-YYYY"
                    placeholder="Select Deadline"
                  />
                </Form.Item>
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl h-[48px] mt-7">
                  <span className="text-gray-600 text-sm leading-none">
                    Urgent Hiring
                  </span>
                  <Form.Item
                    name="isUrgent"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <CustomSwitch />
                  </Form.Item>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl h-[48px]">
                  <span className="text-gray-600 text-sm leading-none">
                    Published Status
                  </span>
                  <Form.Item
                    name="isPublished"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <CustomSwitch />
                  </Form.Item>
                </div>
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl h-[48px]">
                  <span className="text-gray-600 text-sm leading-none">
                    Active Status
                  </span>
                  <Form.Item
                    name="status"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <CustomSwitch />
                  </Form.Item>
                </div>
              </div>
            </Card>

            <Card className="border !mt-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faTag} />
                <span>SEO & Internal Info</span>
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="internalId" label="Internal ID">
                  <CustomInput placeholder="Internal company ID" />
                </Form.Item>
                <Form.Item name="referenceCode" label="Reference Code">
                  <CustomInput placeholder="Job reference code" />
                </Form.Item>
              </div>
              <Form.Item name="keywords" label="SEO Keywords (comma separated)">
                <CustomSelect mode="tags" placeholder="Add keywords" />
              </Form.Item>
              <Form.Item
                name="metaDescription"
                label="Meta Description (for Google)"
              >
                <CustomInput.TextArea
                  rows={3}
                  placeholder="SEO Meta description..."
                />
              </Form.Item>
              <Form.Item
                name="applicationLink"
                label="External Application Link (if any)"
              >
                <CustomInput
                  prefix={
                    <FontAwesomeIcon icon={faLink} className="text-gray-400" />
                  }
                  placeholder="https://..."
                />
              </Form.Item>
            </Card>

            <div className="mt-6!">
              <CustomButton
                variant="primary"
                size="lg"
                block
                htmlType="submit"
                loading={isLoading}
                icon={<FontAwesomeIcon icon={faSave} />}
              >
                {isEditMode ? "Update Job Posting" : "Publish Job Post"}
              </CustomButton>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateJob;
