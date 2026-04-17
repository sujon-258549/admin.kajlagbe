import React, { useId, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
  buttonText?: string;
  autoSearchOnType?: boolean;
  id?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search",
  onSearch,
  onChange,
  className = "",
  value,
  defaultValue = "",
  buttonText = "Search",
  autoSearchOnType = false,
  id,
}) => {
  const generatedId = useId();
  const inputId = id ?? `search-${generatedId}`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputValue = value ?? internalValue;

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    if (autoSearchOnType) {
      onSearch?.(nextValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue);
  };

  return (
    <form className={`max-w-md mx-auto ${className}`} onSubmit={handleSubmit}>
      <label
        htmlFor={inputId}
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
          type="text"
          id={inputId}
          value={inputValue}
          onChange={(e) => updateValue(e.target.value)}
          className="block w-full p-2 ps-10 pe-36 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary placeholder:text-gray-500 focus:outline-none"
          placeholder={placeholder}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => {
                updateValue("");
                onSearch?.("");
              }}
              aria-label="Clear search"
              className="h-7 w-7 rounded-sm -mt-1"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="text-white bg-primary hover:bg-primary/90 box-border border border-transparent focus:ring-4 focus:ring-primary/20 font-medium leading-5 rounded-sm text-xs px-3 py-1 focus:outline-none transition-all"
          >{buttonText}</button>
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
