import { useState } from "react";
import { ChevronDown, Settings, LogOut, User, HelpCircle } from "lucide-react";

interface ProfileDropdownProps {
  onOpen?: () => void; // called when opened (to close other dropdowns)
}

const menuItems = [
  {
    name: "Profiles",
    icon: User,
    subMenu: ["My Account", "Public Profile", "Personal Info"],
  },
  {
    name: "Settings",
    icon: Settings,
    subMenu: ["Security", "Privacy", "Notifications"],
  },
  { name: "Support", icon: HelpCircle, subMenu: undefined },
];

const ProfileDropdown = ({ onOpen }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const toggle = () => {
    if (!isOpen && onOpen) onOpen();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Avatar Trigger */}
      <div
        onClick={toggle}
        className="w-11 h-11 bg-[#e6f4ea] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:scale-105 transition-all"
      >
        <span className="text-[#052e16] font-extrabold text-sm">A</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          onMouseLeave={() => {
            setIsOpen(false);
            setActiveSubMenu(null);
          }}
          className="absolute top-full right-0 mt-[18px] w-56 bg-white rounded-lg border border-gray-200 py-3 overflow-visible animate-in fade-in slide-in-from-top-2 duration-200 z-50"
        >
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-50 mb-2">
            <p className="text-sm font-bold text-gray-800">Admin User</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Super Admin
            </p>
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveSubMenu(item.name)}
            >
              <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-primary/5 hover:text-primary transition-all">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.subMenu && (
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                )}
              </button>

              {/* Sub-menu */}
              {item.subMenu && activeSubMenu === item.name && (
                <div className="absolute right-full top-0 mr-1 w-48 bg-white rounded-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  {item.subMenu.map((sub) => (
                    <button
                      key={sub}
                      className="w-full text-left px-5 py-2 text-sm text-gray-500 hover:text-primary hover:bg-primary/5 transition-all font-semibold"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Logout */}
          <div className="mt-2 pt-2 border-t border-gray-50 px-2 text-rose-500">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold hover:bg-rose-50 rounded-xl transition-all">
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
