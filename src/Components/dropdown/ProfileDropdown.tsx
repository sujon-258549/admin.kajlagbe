import { useState } from "react";
import { ChevronDown, Settings, LogOut, User, HelpCircle, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetMyDataQuery, useLogoutMutation } from "../../redux/features/auth/authApi";
import { Image, message } from "antd";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../modal/profile/ChangePasswordModal";

interface ProfileDropdownProps {
  onOpen?: () => void; // called when opened (to close other dropdowns)
}

const menuItems = [
  {
    name: "Account",
    icon: User,
    subMenu: [
      { name: "My Profile", icon: User, path: "/profile" },
      { name: "Edit Profile", icon: User, path: "/profile/edit" },
      { name: "Change Password", icon: Lock, action: "password" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    subMenu: [
      { name: "Security", icon: Settings, path: "/settings/security" },
      { name: "Notifications", icon: Settings, path: "/settings/notifications" },
    ],
  },
  { name: "Support", icon: HelpCircle, subMenu: undefined },
];

const ProfileDropdown = ({ onOpen }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  // Fetch real-time user data
  const { data: myData } = useGetMyDataQuery(undefined, {
    skip: !currentUser,
  });

  // Backend structure: res.data is the user object
  const user = myData?.data;
  
  // Extract display info
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
      // Call backend to clear the cookie
      await logoutApi(undefined).unwrap();
      // Clear Redux state and localStorage
      dispatch(logout());
      message.success("Logged out successfully");
      navigate("/login");
    } catch {
      // Even if API fails, clear local session
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

  return (
    <div className="relative">
      {/* Avatar Trigger */}
      <div
        onClick={toggle}
        className="w-11 h-11 bg-[#e6f4ea] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:scale-105 transition-all overflow-hidden"
      >
        {displayPhoto ? (
          <Image
            src={displayPhoto}
            alt={displayName}
            preview={false}
            className="w-full h-full object-cover border border-gray-300 rounded-full"
          />
        ) : (
          <span className="text-[#052e16] font-extrabold text-sm">
            {displayName[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          onMouseLeave={() => {
            setIsOpen(false);
            setActiveSubMenu(null);
          }}
          className="absolute top-full right-0 mt-[18px] w-64 bg-white rounded-lg border border-gray-200 py-3 overflow-visible animate-in fade-in slide-in-from-top-2 duration-200 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
        >
          {/* User Info Header */}
          <div className="px-5 py-3 border-b border-gray-50 mb-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                      {displayName[0]}
                    </div>
                  )}
               </div>
               <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{displayEmail}</p>
               </div>
            </div>
            <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest w-fit">
              {displayRole.replace("_", " ")}
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveSubMenu(item.name)}
            >
              <button 
                onClick={() => !item.subMenu && handleMenuClick({})}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span>{item.name}</span>
                </div>
                {item.subMenu && (
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                )}
              </button>

              {/* Sub-menu */}
              {item.subMenu && activeSubMenu === item.name && (
                <div className="absolute right-full top-0 mr-1 w-52 bg-white rounded-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-right-2 duration-200 shadow-xl">
                  {item.subMenu.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleMenuClick(sub)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 transition-all font-semibold"
                    >
                      <sub.icon className="w-3.5 h-3.5 opacity-60" />
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Logout */}
          <div className="mt-2 pt-2 border-t border-gray-50 px-2 text-rose-500">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileDropdown;
