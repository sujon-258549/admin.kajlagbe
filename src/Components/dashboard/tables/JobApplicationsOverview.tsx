import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faUser,
  faChevronRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import type { FilterType } from "../../types";
import { useGetJobsWithApplicantsQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

const statusColors: Record<string, string> = {
  New: "bg-indigo-50 text-indigo-600",
  Reviewed: "bg-amber-50 text-amber-600",
  Shortlisted: "bg-emerald-50 text-emerald-600",
};

const formatRelative = (input: string) => {
  const date = new Date(input);
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

interface Props {
  externalFilter?: FilterType;
}

const JobApplicationsOverview = ({ externalFilter }: Props) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data: jobs = [], isLoading } = useGetJobsWithApplicantsQuery({
    range,
    limit: 6,
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0]?.id ?? null);
    }
    if (selectedJobId && !jobs.find((j) => j.id === selectedJobId)) {
      setSelectedJobId(jobs[0]?.id ?? null);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const applicants = selectedJob?.applicants ?? [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Job Applications</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400">Loading jobs…</p>
      )}

      {!isLoading && jobs.length === 0 && (
        <p className="text-sm text-gray-400">
          No jobs with applicants in this period.
        </p>
      )}

      {jobs.length > 0 && (
        <>
          <div className="flex gap-2 flex-wrap mb-6">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
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

          {selectedJob && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-100 mb-5">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
                <span className="text-[10px] text-gray-400 font-medium">
                  Unread
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {applicants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No applicants yet.
              </p>
            ) : (
              applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 transition-all cursor-pointer group"
                >
                  <img
                    src={
                      applicant.photo ||
                      `https://i.pravatar.cc/150?u=${applicant.name}`
                    }
                    alt={applicant.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-800 truncate">
                      {applicant.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatRelative(applicant.appliedAt)}
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

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-50">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all">
              <FontAwesomeIcon icon={faUser} />
              Review All
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all">
              <FontAwesomeIcon icon={faCheckCircle} />
              Shortlist Best
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobApplicationsOverview;
