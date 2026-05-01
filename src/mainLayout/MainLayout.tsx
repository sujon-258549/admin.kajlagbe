import { useState, useEffect } from "react";
import Header from "../Components/common/Header";
import Sidebar from "../Components/common/Sidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { useSocket } from "../context/SocketContext";
import { toast } from "sonner";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for contact messages
      socket.on("new-contact", (data: any) => {
        toast(`📩 নতুন মেসেজ এসেছে!`, {
          description: `${data.firstName} একটি মেসেজ পাঠিয়েছেন: "${data.subject || "সাধারণ জিজ্ঞাসা"}"`,
          duration: 5000,
        });
      });

      // Listen for system notifications
      socket.on("new-notification", (data: any) => {
        toast(`🔔 সিস্টেম নোটিফিকেশন`, {
          description: data.message,
          duration: 4000,
        });
      });

      return () => {
        socket.off("new-contact");
        socket.off("new-notification");
      };
    }
  }, [socket]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Toaster position="bottom-right" richColors theme="system" />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"} pl-0`}
      >
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
