import { useEffect } from "react";
import { useGetLiveActivityFeedQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { useSocket } from "../../../context/SocketContext";

const formatRelative = (input: string | Date) => {
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

const dotColor = (type: string) => {
  if (type === "signup") return "bg-emerald-500";
  if (type === "application") return "bg-indigo-500";
  if (type === "contact") return "bg-amber-500";
  return "bg-gray-400";
};

const RecentActivity = () => {
  const { data, isLoading, refetch } = useGetLiveActivityFeedQuery({
    limit: 8,
  });
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handler = () => refetch();
    socket.on("new-contact", handler);
    socket.on("new-notification", handler);
    socket.on("user-status-change", handler);
    return () => {
      socket.off("new-contact", handler);
      socket.off("new-notification", handler);
      socket.off("user-status-change", handler);
    };
  }, [socket, refetch]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {isLoading && (
        <div className="text-sm text-gray-400">Loading activity…</div>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="text-sm text-gray-400">No recent activity yet.</div>
      )}

      <div className="space-y-6">
        {data?.map((item) => (
          <div key={`${item.type}-${item.id}`} className="flex gap-4 items-start">
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${dotColor(
                item.type,
              )}`}
            >
              {item.type[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm text-gray-800 truncate">{item.label}</p>
              {item.detail && (
                <span className="text-xs text-gray-500 truncate">
                  {item.detail}
                </span>
              )}
              <span className="text-xs text-gray-400 mt-1">
                {formatRelative(item.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
