import { useParams, useNavigate } from "react-router-dom";
import { Tag, Spin, Avatar, Modal, Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faPhone,
  faBriefcase,
  faFilePdf,
  faCheckCircle,
  faTimesCircle,
  faTrash,
  faClock,
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import { useApplication } from "../../apihooks/useApplication";
import formatDate from "../../Components/utils/dateFormate";
import { toast } from "sonner";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetApplicationById, updateApplication, deleteApplication } =
    useApplication();
  const { data: response, isLoading } = useGetApplicationById(id || "");
  const application = response?.data;

  const handleUpdateStatus = async (status: string) => {
    try {
      const res: any = await updateApplication({
        id: id,
        data: { applyStatus: status },
      }).unwrap();
      if (res?.success) {
        toast.success(`Application marked as ${status.toLowerCase()}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Application",
      content: "Are you sure you want to delete this application permanently?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          const res: any = await deleteApplication(id).unwrap();
          if (res?.success) {
            toast.success("Application deleted successfully");
            navigate("/job/applications");
          }
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete application");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-gray-400 animate-pulse font-medium">
            Loading applicant dossier...
          </p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Empty description="Application not found" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "green";
      case "REJECTED":
        return "red";
      case "PENDING":
        return "orange";
      default:
        return "blue";
    }
  };

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management", path: "/job/list" },
          { label: "Applications", path: "/job/applications" },
          { label: "Application Details" },
        ]}
        title="Application Details"
        extra={
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back
            </CustomButton>
            <CustomButton
              variant="danger-outline"
              size="sm"
              onClick={handleDelete}
              icon={<FontAwesomeIcon icon={faTrash} />}
            >
              Delete
            </CustomButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Applicant Profile & Status */}
        <div className="lg:col-span-1">
          {/* Applicant Info Panel */}
          <div className="border border-gray-200 rounded-lg bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden relative mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center py-8">
              <Avatar
                size={120}
                className="border-4 border-white/10 bg-white/5 mb-4"
                src={application.user?.profile?.photo}
              >
                {application.user?.profile?.name?.charAt(0) || "U"}
              </Avatar>
              <h2 className="text-2xl font-bold m-0 text-white">
                {application.user?.profile?.name || "Unknown User"}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                {application.user?.email}
              </p>

              <Tag
                color={getStatusColor(application.applyStatus)}
                className="m-0 px-4 py-1 rounded-full font-bold uppercase tracking-wider border-none text-[10px]"
              >
                {application.applyStatus}
              </Tag>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-slate-200 m-0">
                    {application.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">
                    Phone Number
                  </p>
                  <p className="text-sm font-medium text-slate-200 m-0">
                    {application.user?.profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sky-400">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">
                    Applied On
                  </p>
                  <p className="text-sm font-medium text-slate-200 m-0">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-gray-100 text-center">
              <h4 className="m-0 font-bold text-slate-800 text-xs uppercase tracking-[0.2em]">
                Take Action
              </h4>
            </div>
            <div className="p-6 space-y-3">
              <CustomButton
                variant="primary"
                className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                onClick={() => handleUpdateStatus("ACCEPTED")}
                icon={<FontAwesomeIcon icon={faCheckCircle} />}
                disabled={application.applyStatus === "ACCEPTED"}
              >
                Accept Candidate
              </CustomButton>
              <CustomButton
                variant="danger-outline"
                className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                onClick={() => handleUpdateStatus("REJECTED")}
                icon={<FontAwesomeIcon icon={faTimesCircle} />}
                disabled={application.applyStatus === "REJECTED"}
              >
                Reject Candidate
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Right Column: Content & Details */}
        <div className="lg:col-span-2">
          {/* Main Application Panel */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px] mb-6">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-xl border border-gray-200">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 m-0">
                    Application Dossier
                  </h3>
                  <p className="text-slate-500 m-0 text-sm">
                    Reviewing for position:{" "}
                    <span className="text-primary font-bold">
                      {application.job?.title}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Cover Letter Section */}
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span className="w-6 h-px bg-slate-200" /> Cover Letter
                  </h4>
                  <div 
                    className="bg-slate-50/50 p-6 rounded-lg border border-gray-200 text-slate-700 leading-relaxed text-sm prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: application.coverLetter || "No cover letter provided." }}
                  />
                </section>

                {/* Apply Note Section */}
                {application.applyNote && (
                  <section>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      <span className="w-6 h-px bg-slate-200" /> Additional
                      Notes
                    </h4>
                    <div className="bg-sky-50/30 p-6 rounded-lg border border-gray-200 text-slate-700 text-sm">
                      {application.applyNote}
                    </div>
                  </section>
                )}

                {/* Resume Section */}
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span className="w-6 h-px bg-slate-200" /> Candidate Resume
                  </h4>
                  {application.resume ? (
                    <div className="bg-rose-50/30 p-8 rounded-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-rose-50 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-rose-500 text-3xl group-hover:scale-110 transition-transform">
                          <FontAwesomeIcon icon={faFilePdf} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 m-0">
                            Resume_Document.pdf
                          </p>
                          <p className="text-xs text-slate-500 m-0">
                            Curriculum Vitae • PDF Document
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CustomButton
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-slate-200 hover:border-primary font-bold"
                          onClick={() =>
                            window.open(application.resume, "_blank")
                          }
                          icon={<FontAwesomeIcon icon={faEye} />}
                        >
                          View
                        </CustomButton>
                        <CustomButton
                          variant="primary"
                          size="sm"
                          className="rounded-lg font-bold"
                          onClick={() =>
                            window.open(application.resume, "_blank")
                          }
                          icon={<FontAwesomeIcon icon={faDownload} />}
                        >
                          Download
                        </CustomButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-gray-200">
                      <p className="text-slate-400 m-0 italic">
                        No resume document uploaded.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>

          {/* Job Reference Link */}
          <div
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/job/details/${application.jobId}`)}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-center text-slate-400">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 m-0 text-sm">
                    Target Position
                  </h5>
                  <p className="text-xs text-slate-500 m-0">
                    {application.job?.title} • View Job Posting
                  </p>
                </div>
              </div>
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-slate-300 rotate-180"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
