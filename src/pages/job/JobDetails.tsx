import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Divider, Spin, Badge, List } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBuilding,
  faLocationDot,
  faMoneyBillWave,
  faBriefcase,
  faCheckCircle,
  faClock,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import { useJob } from "../../apihooks/useJob";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetJobById } = useJob();
  const { data: response, isLoading } = useGetJobById(id || "");
  const job = response?.data;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-500">Job not found</h2>
        <CustomButton
          variant="primary"
          className="mt-4"
          onClick={() => navigate("/job/list")}
        >
          Back to List
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management", path: "/job/list" },
          { label: "Job Details" },
        ]}
        title="Job Details"
        extra={
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/job/list")}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back to List
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={() => navigate(`/job/edit/${job.id}`)}
            >
              Edit Job
            </CustomButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-800 m-0">
                    {job.title}
                  </h1>
                  {job.isUrgent && <Badge count="Urgent" style={{ backgroundColor: '#f5222d' }} />}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="text-primary/60" />
                    <span className="font-medium text-gray-700">{job.company || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLocationDot} className="text-primary/60" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary/60" />
                    <Tag color="blue">{job.type || "Full-time"}</Tag>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center min-w-[150px]">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Salary Range</p>
                <div className="flex items-center justify-center gap-1 text-primary">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  <span className="text-xl font-black">
                    ৳{job.salaryMin?.toLocaleString()} - ৳{job.salaryMax?.toLocaleString()}
                  </span>
                </div>
                {job.negotiable && <p className="text-[10px] text-gray-400 mt-1 italic">Negotiable</p>}
              </div>
            </div>

            <Divider />

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-primary" />
                  Description
                </h3>
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </section>

              {job.responsibilities?.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
                    Responsibilities
                  </h3>
                  <List
                    dataSource={job.responsibilities}
                    renderItem={(item: string) => (
                      <List.Item className="border-none py-1 pl-0">
                        <div className="flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </section>
              )}

              {job.requirements?.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
                    Requirements
                  </h3>
                  <List
                    dataSource={job.requirements}
                    renderItem={(item: string) => (
                      <List.Item className="border-none py-1 pl-0">
                        <div className="flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </section>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Summary" className="border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Published On</span>
                <span className="font-medium text-gray-700">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deadline</span>
                <span className="font-medium text-red-500">{job.deadline || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vacancy</span>
                <span className="font-medium text-gray-700">{job.vacancy || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Applicants</span>
                <span className="font-medium text-primary">
                  <FontAwesomeIcon icon={faUserGroup} className="mr-1" />
                  {job.applicantsCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                {job.status ? (
                  <Tag color="success">Active</Tag>
                ) : (
                  <Tag color="error">Inactive</Tag>
                )}
              </div>
            </div>
          </Card>

          {job.benefits?.length > 0 && (
            <Card title="Benefits" className="border-gray-200 bg-emerald-50/30">
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit: string) => (
                  <Tag key={benefit} color="green" className="m-0 border-emerald-100">
                    {benefit}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {job.tags?.length > 0 && (
            <Card title="Tags" className="border-gray-200">
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag: string) => (
                  <Tag key={tag} className="m-0 bg-gray-50 border-gray-100">
                    #{tag}
                  </Tag>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
