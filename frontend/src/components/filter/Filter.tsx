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
    <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-4 mb-2">
      {/* Search */}
      <div className="w-full md:w-1/3">
        <form className="flex items-center">
          <div className="relative w-full">
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
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 
                     0 1110.89 3.476l4.817 4.817a1 1 
                     0 01-1.414 1.414l-4.816-4.816A6 
                     6 0 012 8z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="filter-search"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={`${SearchPlaceholder}...`}
            />
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2">
        {/* Sorting Dropdown */}
        {sortOptions.length > 0 && (
          <div className="w-full md:w-auto">
            <select
              value={sortValue}
              className="w-full md:w-auto px-3 py-2 text-sm rounded-lg border border-gray-300 
                dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none 
                focus:ring-2 focus:ring-primary-500"
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

        <button
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          onClick={handleClearFilters}
        >
          <span className="hidden sm:inline">See all</span>
          <span className="sm:hidden">All</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;
