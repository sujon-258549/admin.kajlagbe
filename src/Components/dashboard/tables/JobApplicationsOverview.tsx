import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faUser,
  faChevronRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

interface Job {
  id: string;
  title: string;
  company: string;
  totalApplicants: number;
  newApplicants: number;
}

interface Applicant {
  id: string;
  name: string;
  jobId: string;
  appliedAt: string;
  status: "New" | "Reviewed" | "Shortlisted";
  avatar: string;
}

const jobPosts: Job[] = [
  {
    id: "j1",
    title: "Senior UI Designer",
    company: "Design Dept.",
    totalApplicants: 45,
    newApplicants: 8,
  },
  {
    id: "j2",
    title: "Full Stack Developer",
    company: "Engineering",
    totalApplicants: 120,
    newApplicants: 24,
  },
  {
    id: "j3",
    title: "Data Analyst",
    company: "Data Science",
    totalApplicants: 88,
    newApplicants: 5,
  },
  {
    id: "j4",
    title: "Product Manager",
    company: "Product",
    totalApplicants: 15,
    newApplicants: 3,
  },
];

const allApplicants: Applicant[] = [
  {
    id: "a1",
    name: "Arif Khan",
    jobId: "j1",
    appliedAt: "2h ago",
    status: "New",
    avatar: "arif",
  },
  {
    id: "a2",
    name: "Sujon Ahmed",
    jobId: "j1",
    appliedAt: "5h ago",
    status: "Reviewed",
    avatar: "sujon",
  },
  {
    id: "a3",
    name: "Jane Doe",
    jobId: "j1",
    appliedAt: "1d ago",
    status: "Shortlisted",
    avatar: "jane",
  },
  {
    id: "a4",
    name: "Michael Ross",
    jobId: "j2",
    appliedAt: "1h ago",
    status: "New",
    avatar: "michael",
  },
  {
    id: "a5",
    name: "Sarah Connor",
    jobId: "j2",
    appliedAt: "3h ago",
    status: "New",
    avatar: "sarah",
  },
  {
    id: "a6",
    name: "Alex Hunter",
    jobId: "j2",
    appliedAt: "6h ago",
    status: "Reviewed",
    avatar: "alex",
  },
  {
    id: "a7",
    name: "John Wick",
    jobId: "j3",
    appliedAt: "30m ago",
    status: "New",
    avatar: "john",
  },
  {
    id: "a8",
    name: "Ella Smith",
    jobId: "j3",
    appliedAt: "2d ago",
    status: "Shortlisted",
    avatar: "ella",
  },
  {
    id: "a9",
    name: "Tom Hardy",
    jobId: "j4",
    appliedAt: "4h ago",
    status: "New",
    avatar: "tom",
  },
];

const statusColors: Record<string, string> = {
  New: "bg-indigo-50 text-indigo-600",
  Reviewed: "bg-amber-50 text-amber-600",
  Shortlisted: "bg-emerald-50 text-emerald-600",
};

const JobApplicationsOverview = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("j1");

  const selectedJob = jobPosts.find((j) => j.id === selectedJobId);
  const applicants = allApplicants.filter((a) => a.jobId === selectedJobId);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Job Applications</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* Job Post Selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {jobPosts.map((job) => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedJobId === job.id
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <FontAwesomeIcon icon={faBriefcase} className="text-[10px]" />
            {job.title}
            {job.newApplicants > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0 text-[9px] font-bold ${
                  selectedJobId === job.id
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                +{job.newApplicants}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Job Summary */}
      {selectedJob && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 mb-5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-900">
              {selectedJob.title}
            </span>
            <span className="text-xs text-gray-400">
              {selectedJob.company} · {selectedJob.totalApplicants} total
              applicants
            </span>
          </div>
          <div className="ml-auto text-right">
            <span className="block text-lg font-bold text-primary">
              {selectedJob.newApplicants}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">New</span>
          </div>
        </div>
      )}

      {/* Applicants List */}
      <div className="space-y-3">
        {applicants.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No applicants yet.
          </p>
        ) : (
          applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 transition-all cursor-pointer group"
            >
              <img
                src={`https://i.pravatar.cc/150?u=${applicant.avatar}`}
                alt={applicant.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-sm text-gray-800 truncate">
                  {applicant.name}
                </span>
                <span className="text-xs text-gray-400">
                  {applicant.appliedAt}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[applicant.status]}`}
              >
                {applicant.status}
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-200 text-xs group-hover:text-primary transition-colors"
              />
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-50">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all">
          <FontAwesomeIcon icon={faUser} />
          Review All
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all">
          <FontAwesomeIcon icon={faCheckCircle} />
          Shortlist Best
        </button>
      </div>
    </div>
  );
};

export default JobApplicationsOverview;
