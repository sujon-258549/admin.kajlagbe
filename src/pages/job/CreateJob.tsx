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
  faLightbulb,
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

  const { createJob, updateJob, useGetJobById } = useJob();
  const { data: jobData, isLoading: isJobLoading } = useGetJobById(id || "", {
    skip: !isEditMode,
  });

  const { categories } = useCategory();
  const { subCategories } = useSubCategory();

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditMode && jobData) {
      form.setFieldsValue({
        ...jobData,
        deadline: jobData.deadline
          ? dayjs(jobData.deadline, "DD-MM-YYYY")
          : null,
      });
      setDescription(jobData.description || "");
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
                <Col span={12}>
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
                <Col span={12}>
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
              </Row>
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
                    <InputNumber className="w-full!" placeholder="Min" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="salaryMax" label="Max Salary">
                    <InputNumber className="w-full!" placeholder="Max" />
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

            <Card className="border mt-4! border-gray-200 ">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Settings & Visibility</span>
              </div>
              <Divider className="my-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="deadline" label="Application Deadline">
                  <DatePicker
                    className="w-full!"
                    format="DD-MM-YYYY"
                    placeholder="Select Deadline"
                  />
                </Form.Item>

                <Form.Item name="vacancy" label="Vacancy">
                  <InputNumber
                    className="w-full!"
                    placeholder="Number of openings"
                  />
                </Form.Item>
              </div>

              <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl min-h-[48px]">
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
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl min-h-[48px]">
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
                <div className="flex items-center justify-between gap-2 border border-gray-100 p-2 rounded-xl min-h-[48px]">
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

            <div className="mt-6!">
              <CustomButton
                variant="primary"
                size="lg"
                block
                htmlType="submit"
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
