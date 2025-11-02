import React from "react";

const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Tags", value: "tags" },
  { label: "Credit", value: "credit" },
];

type SortMenuButtonProps = {
  sort: string;
  onSortChange: (s: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  count: number;
};

export default function SortMenuButton({
  sort,
  onSortChange,
  search,
  onSearchChange,
  count,
}: SortMenuButtonProps) {
  return (
    <div
      className="
        sticky top-0 z-30 w-full
        flex flex-col md:flex-row
        justify-center items-center gap-3
        bg-white/95 backdrop-blur-md
        border-b border-green-100 shadow-sm
        py-3 px-4 md:px-8
        transition
      "
      style={{ minHeight: 64 }}
    >
      {/* Location Count */}
      <div className="mb-1 md:mb-0 md:mr-4 flex-shrink-0 flex items-center text-sm sm:text-base font-semibold text-green-700">
        <svg
          className="w-5 h-5 mr-1 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2M8 7a4 4 0 118 0 4 4 0 01-8 0z"
          />
        </svg>
        {count} {count === 1 ? "location" : "locations"}
      </div>

      {/* Search input */}
      <div className="w-full md:max-w-sm">
        <input
          type="text"
          placeholder="Search anything…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full border border-green-200 bg-gray-50
            px-4 py-2 rounded-lg
            text-base text-gray-700
            placeholder:text-gray-400
            focus:ring-2 focus:ring-green-100 focus:border-green-500
            outline-none
            shadow-sm
            transition
          "
          aria-label="Search Locations"
        />
      </div>

      {/* Sort menu */}
      <div className="w-full md:w-auto">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="
            w-full md:w-auto
            border border-green-200
            rounded-full
            px-6 py-2
            text-gray-700 font-semibold
            bg-white
            shadow-sm
            transition
            hover:bg-green-50 focus:ring-2 focus:ring-green-100 focus:border-green-500
            outline-none
            cursor-pointer
          "
          aria-label="Sort Locations"
        >
          <option value="">Sort by…</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
