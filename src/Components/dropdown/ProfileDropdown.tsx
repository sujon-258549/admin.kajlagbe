import { useState } from "react";
import { ChevronDown, Settings, LogOut, User, HelpCircle, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetMyDataQuery, useLogoutMutation } from "../../redux/features/auth/authApi";
import { Image, message } from "antd";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../modal/profile/ChangePasswordModal";
import { motion, AnimatePresence } from "framer-motion";
import { canActions } from "../../utils/sidebar";

interface ProfileDropdownProps {
  onOpen?: () => void;
}

interface MenuItem {
  name: string;
  icon: any;
  path?: string;
  action?: string;
  module?: string;
  actionRequired?: string;
  subMenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Account",
    icon: User,
    subMenu: [
      { name: "My Profile", icon: User, path: "/profile", module: "Profile Management", action: "View" },
      { name: "Edit Profile", icon: User, path: "/profile/edit", module: "Profile Management", action: "Edit" },
      { name: "Change Password", icon: Lock, action: "password", module: "Profile Management", actionRequired: "Change Password" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    module: "Settings",
    action: "View",
    subMenu: [
      { name: "Security", icon: Settings, path: "/settings/security" },
      { name: "Notifications", icon: Settings, path: "/settings/notifications" },
    ],
  },
  { name: "Support", icon: HelpCircle },
];

const ProfileDropdown = ({ onOpen }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  const { data: myData } = useGetMyDataQuery(undefined, {
    skip: !currentUser,
  });

  const user = myData?.data;
  const permissions = user?.role?.permissions || [];
  
  const displayName = user?.profile?.name || user?.name || "Admin User";
  const displayEmail = user?.email || "";
  const displayRole = user?.role?.role || user?.role || "Super Admin";
  const displayPhoto = user?.profile?.photo || user?.photo;

  const toggle = () => {
    if (!isOpen && onOpen) onOpen();
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(logout());
      message.success("Logged out successfully");
      navigate("/login");
    } catch {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleMenuClick = (item: { path?: string; action?: string }) => {
    if (item.action === "password") {
      setIsPasswordModalOpen(true);
      setIsOpen(false);
      return;
    }
    if (item.path) {
      navigate(item.path);
      setIsOpen(false);
    }
  };

  // Filter menu items based on permissions
  const filteredMenuItems = (menuItems as MenuItem[]).filter((item: MenuItem) => {
    if (!item.module) return true;
    return canActions(permissions, item.module, item.action || "View", user?.email);
  }).map((item: MenuItem) => ({
    ...item,
    subMenu: item.subMenu?.filter((sub: MenuItem) => {
       if (!sub.module) return true;
       return canActions(permissions, sub.module, sub.actionRequired || sub.action || "View", user?.email);
    })
  })).filter(item => !item.subMenu || item.subMenu.length > 0);

  return (
    <div className="relative">
      <div
        onClick={toggle}
        className="w-11 h-11 bg-[#e6f4ea] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-hidden shadow-sm"
      >
        {displayPhoto ? (
          <Image
            src={displayPhoto}
            alt={displayName}
            preview={false}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#052e16] font-extrabold text-sm">
            {displayName[0]?.toUpperCase()}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseLeave={() => {
              setIsOpen(false);
              setActiveSubMenu(null);
            }}
            className="absolute top-full right-0 mt-4 w-72 bg-white rounded-lg border border-gray-300 py-3 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl"
          >
            <div className="px-6 py-4 border-b border-gray-300 mb-3">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                        {displayName[0]}
                      </div>
                    )}
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                    <p className="text-[11px] text-gray-400 truncate font-medium">{displayEmail}</p>
                 </div>
              </div>
              <div className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest w-fit border border-primary/5">
                {displayRole.replace("_", " ")}
              </div>
            </div>

            <div className="px-2 space-y-1">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative px-2"
                  onMouseEnter={() => setActiveSubMenu(item.name)}
                >
                  <button 
                    onClick={() => !item.subMenu && handleMenuClick({})}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                      activeSubMenu === item.name ? "bg-primary/5 text-primary" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${activeSubMenu === item.name ? "text-primary" : "text-gray-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.subMenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeSubMenu === item.name ? "-rotate-90 opacity-100" : "opacity-30"}`} />
                    )}
                  </button>

                  <AnimatePresence>
                    {item.subMenu && activeSubMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="absolute right-full top-0 mr-2 w-56 bg-white rounded-lg border border-gray-300 py-2 shadow-2xl z-[60]"
                      >
                        {item.subMenu.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => handleMenuClick(sub)}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-500 hover:text-primary hover:bg-primary/5 transition-all font-bold rounded-lg"
                          >
                            <sub.icon className="w-3.5 h-3.5 opacity-60" />
                            <span>{sub.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 px-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>Logout Account</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileDropdown;
