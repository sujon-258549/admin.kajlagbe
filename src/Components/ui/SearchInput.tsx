import React, { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search",
  onSearch,
  className = "",
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form className={`max-w-md mx-auto ${className}`} onSubmit={handleSubmit}>
      <label
        htmlFor="search"
        className="block mb-2.5 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full p-2 ps-10 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary placeholder:text-gray-500 focus:outline-none"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white bg-primary hover:bg-primary/90 box-border border border-transparent focus:ring-4 focus:ring-primary/20 font-medium leading-5 rounded-md text-xs px-3 py-1 focus:outline-none transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
