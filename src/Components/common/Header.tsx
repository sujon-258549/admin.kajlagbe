import { Menu } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import NotificationDropdown from "../dropdown/NotificationDropdown";
import ProfileDropdown from "../dropdown/ProfileDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const handleSearch = (value: string) => console.log(value);

  return (
    <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left: Toggle & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-1.5 hover:bg-gray-200 rounded-sm transition-colors border border-gray-200 shrink-0 flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-gray-500" />
        </button>

        <div className="w-full hidden md:block">
          <SearchInput
            placeholder="Search keywords..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
