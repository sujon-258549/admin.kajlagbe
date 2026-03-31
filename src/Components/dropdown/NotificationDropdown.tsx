import { useState } from "react";
import { Bell, BriefcaseIcon, UserCheck, CheckCheck } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Application",
    message: "Sujon Ahmed applied for UI Designer",
    time: "2 min ago",
    read: false,
    icon: UserCheck,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
  {
    id: 2,
    title: "Job Post Approved",
    message: "Full Stack Developer post is now live",
    time: "15 min ago",
    read: false,
    icon: BriefcaseIcon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    id: 3,
    title: "Candidate Shortlisted",
    message: "Jane Doe was shortlisted for Designer role",
    time: "1 hour ago",
    read: true,
    icon: UserCheck,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    id: 4,
    title: "New Application",
    message: "Alex Hunter applied for Product Manager",
    time: "3 hours ago",
    read: true,
    icon: UserCheck,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
];

interface NotificationDropdownProps {
  onOpen?: () => void; // called when opened (to close other dropdowns)
}

const NotificationDropdown = ({ onOpen }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const toggle = () => {
    if (!isOpen && onOpen) onOpen();
    setIsOpen((prev) => !prev);
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full right-0 mt-3 w-80 bg-white rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notif.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}
                >
                  <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {notif.time}
                  </span>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-50 text-center">
            <button className="text-xs font-semibold text-primary hover:underline">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
