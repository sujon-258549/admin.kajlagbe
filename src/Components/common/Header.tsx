import { Menu } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../ui/SearchInput";
import NotificationDropdown from "../dropdown/NotificationDropdown";
import ProfileDropdown from "../dropdown/ProfileDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const headerSearchValue = searchParams.get("searchTerm") || "";

  const handleSearch = (value: string) => {
    const searchValue = value.trim();
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("searchTerm", searchValue);
    } else {
      params.delete("searchTerm");
    }
    setSearchParams(params);
  };

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
            key={headerSearchValue}
            placeholder="Search department..."
            onSearch={handleSearch}
            defaultValue={headerSearchValue}
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
