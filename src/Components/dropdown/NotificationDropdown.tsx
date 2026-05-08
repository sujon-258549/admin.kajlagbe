import { useState, useEffect } from "react";
import { Bell, BriefcaseIcon, CheckCheck, MessageSquare, ChevronDown } from "lucide-react";
import { useNotification } from "../../apihooks/useNotification";
import { useSocket } from "../../context/SocketContext";
import formatDate from "../utils/dateFormate";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationDropdownProps {
  onOpen?: () => void;
}

/**
 * Synth a short two-tone "tun" using Web Audio API.
 * Browsers block audio without prior user interaction — fail-soft.
 */
const playNotificationSound = () => {
  try {
    const AudioCtx =
      typeof window !== "undefined"
        ? window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        : undefined;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const beep = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.18, now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };

    beep(880, 0, 0.12);
    beep(660, 0.13, 0.18);

    setTimeout(() => ctx.close(), 600);
  } catch (err) {
    console.warn("[Notification] sound play failed:", err);
  }
};

const NotificationDropdown = ({ onOpen }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { notifications, refetch, markAllRead, updateNotification } = useNotification();
  const { socket } = useSocket();

  // Filter out deleted and only take unread for the badge, but show all in list
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    if (socket) {
      const onNew = () => {
        refetch();
        playNotificationSound();
      };
      socket.on("new-notification", onNew);

      return () => {
        socket.off("new-notification", onNew);
      };
    }
  }, [socket, refetch]);

  const toggle = () => {
    if (!isOpen && onOpen) onOpen();
    setIsOpen((prev) => !prev);
    if (isOpen) setExpandedId(null); // Reset expansion when closing dropdown
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({}).unwrap();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    // Toggle accordion
    setExpandedId(expandedId === notif.id ? null : notif.id);

    // Mark as read if not already
    if (!notif.isRead) {
      try {
        await updateNotification({ id: notif.id, data: { isRead: true } }).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "CONTACT":
        return { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" };
      case "JOB":
        return { icon: BriefcaseIcon, color: "text-emerald-500", bg: "bg-emerald-50" };
      default:
        return { icon: Bell, color: "text-indigo-500", bg: "bg-indigo-50" };
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full right-0 mt-3 w-80 bg-white rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-xs font-semibold">
                No notifications
              </div>
            ) : (
              notifications.map((notif: any) => {
                const { icon: Icon, color, bg } = getIcon(notif.type);
                const isExpanded = expandedId === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex flex-col transition-colors cursor-pointer hover:bg-gray-50 ${
                      !notif.isRead ? "bg-blue-50/20" : ""
                    } ${isExpanded ? "bg-gray-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-gray-800">
                            {notif.type || "Notification"}
                          </p>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                        <p className={`text-xs text-gray-500 mt-0.5 leading-relaxed ${isExpanded ? "" : "truncate"}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 ml-12">
                            <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                              <p className="text-xs text-gray-600 leading-normal">
                                {notif.message}
                              </p>
                              {notif.type === "CONTACT" && (
                                <button className="mt-2 text-[10px] font-bold text-primary hover:underline">
                                  View Contact Details →
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
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
