import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMapMarkerAlt,
  faClock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const UpcomingInterviews = () => {
  const interviews = [
    {
      id: 1,
      name: "John Wick",
      job: "Senior Developer",
      time: "10:30 AM",
      date: "Today",
      type: "Virtual",
      status: "Upcoming",
    },
    {
      id: 2,
      name: "Jane Doe",
      job: "UI Designer",
      time: "02:00 PM",
      date: "Today",
      type: "Office",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Michael Ross",
      job: "Data Scientist",
      time: "11:00 AM",
      date: "Tomorrow",
      type: "Virtual",
      status: "Scheduled",
    },
    {
      id: 4,
      name: "Alex Hunter",
      job: "Product Manager",
      time: "04:30 PM",
      date: "Tomorrow",
      type: "Virtual",
      status: "Scheduled",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Upcoming Interviews</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          Full Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-3 transition-colors hover:bg-white hover:border-primary/20"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary border border-gray-100">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-sm opacity-60"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-sm tracking-tight">
                    {interview.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {interview.job}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  interview.status === "In Progress"
                    ? "bg-primary/10 border-primary text-primary animate-pulse"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                {interview.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-1 px-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <FontAwesomeIcon icon={faClock} className="opacity-40" />
                {interview.time}, {interview.date}
              </div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600/70">
                <FontAwesomeIcon
                  icon={interview.type === "Virtual" ? faVideo : faMapMarkerAlt}
                  className="text-[8px]"
                />
                {interview.type}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons for Recruiter */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button className="py-2.5 rounded-xl border border-primary/20 text-primary bg-primary/5 text-xs font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
          <span>+ Schedule New</span>
        </button>
        <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white text-xs font-bold hover:bg-slate-50 transition-all">
          Invite Candidates
        </button>
      </div>
    </div>
  );
};

export default UpcomingInterviews;
