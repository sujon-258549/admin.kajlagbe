const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: "Arif Khan",
      action: "posted a new job",
      target: "Senior React Developer",
      time: "2 mins ago",
      type: "job",
    },
    {
      id: 2,
      user: "Sujon Ahmed",
      action: "shortlisted",
      target: "Jane Doe",
      time: "15 mins ago",
      type: "candidate",
    },
    {
      id: 3,
      user: "System",
      action: "sent interview invite to",
      target: "Michael Ross",
      time: "1 hour ago",
      type: "system",
    },
    {
      id: 4,
      user: "Sarah Connor",
      action: "updated the status of",
      target: "Data Analyst",
      time: "3 hours ago",
      type: "job",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start">
            <img
              src={`https://i.pravatar.cc/150?u=${activity.user}`}
              alt={activity.user}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col">
              <p className="text-sm text-gray-800">
                <span className="font-bold">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-semibold text-primary">
                  {activity.target}
                </span>
              </p>
              <span className="text-xs text-gray-400 mt-1">
                {activity.time}
              </span>
            </div>
            {/* Visual Indicator */}
            <div
              className={`ml-auto w-1.5 h-1.5 rounded-full mt-2 ${
                activity.type === "job"
                  ? "bg-indigo-500"
                  : activity.type === "candidate"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
              }`}
            />
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-2 text-sm font-semibold text-primary/80 hover:text-primary transition-colors border-t border-gray-50 pt-4">
        View Full Audit Log
      </button>
    </div>
  );
};

export default RecentActivity;
