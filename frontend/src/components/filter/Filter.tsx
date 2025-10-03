import React, { useState } from "react";

interface FilterProps {
  onSearchChange?: (value: string) => void;
  sortOptions?: { label: string; value: string }[];
  onSortChange?: (value: string) => void;
  sortTitle?: string;
  SearchPlaceholder?: string;
  onClearFilters?: () => void;
}

const Filter: React.FC<FilterProps> = ({
  onSearchChange,
  sortOptions = [],
  onSortChange,
  sortTitle = "Sort By",
  SearchPlaceholder = "Search",
  onClearFilters,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange?.(value);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSortValue("");
    onSearchChange?.("");
    onSortChange?.("");
    onClearFilters?.();
  };

  return (
    <div className="w-full mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        {/* Search - Full width on mobile, limited width on larger screens */}
        <div className="flex-shrink-0 w-full sm:w-auto sm:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="filter-search"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 pr-3 py-2.5
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500
                transition-colors"
              placeholder={`${SearchPlaceholder}...`}
            />
          </div>
        </div>

        {/* Controls - Stack on mobile, side by side on larger screens */}
        <div className="flex gap-2 sm:gap-3">
          {/* Sorting Dropdown */}
          {sortOptions.length > 0 && (
            <div className="flex-1 sm:flex-initial sm:min-w-[160px]">
              <select
                value={sortValue}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  bg-gray-50 text-gray-900 transition-colors cursor-pointer"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">{sortTitle}</option>
                {sortOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 
              bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm
              hover:bg-gray-50 hover:text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 
              dark:hover:bg-gray-700 dark:hover:text-white
              transition-colors whitespace-nowrap flex-shrink-0"
            onClick={handleClearFilters}
          >
            <span className="hidden sm:inline">See all</span>
            <span className="sm:hidden">All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
