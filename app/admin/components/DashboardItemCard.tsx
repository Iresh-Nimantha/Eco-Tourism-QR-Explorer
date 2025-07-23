import React, { useState, useEffect } from "react";
import UpdateLocationForm from "./UpdateLocationForm";

type DashboardItemCardProps = {
  item: {
    id: string;
    locationName: string;
    description: string;
    tags: string;
    credit: string;
    customFilename: string;
  };
  onDelete: () => void;
  onUpdate: (updatedItem: any) => void;
};

export default function DashboardItemCard({
  item,
  onDelete,
  onUpdate,
}: DashboardItemCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemState, setItemState] = useState(item);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Load SweetAlert2 on component mount
  useEffect(() => {
    if (!window.Swal) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.7.32/sweetalert2.all.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Constants for truncation
  const DESCRIPTION_CHAR_LIMIT = 150;
  const TAGS_DISPLAY_LIMIT = 3;

  // Helper functions
  const shouldTruncateDescription =
    itemState.description &&
    itemState.description.length > DESCRIPTION_CHAR_LIMIT;
  const tagsArray = itemState.tags
    ? itemState.tags.split(",").map((tag) => tag.trim())
    : [];
  const shouldShowMoreTags = tagsArray.length > TAGS_DISPLAY_LIMIT;
  const displayedTags = showAllTags
    ? tagsArray
    : tagsArray.slice(0, TAGS_DISPLAY_LIMIT);

  const getTruncatedDescription = () => {
    if (!itemState.description) return "";
    if (showFullDescription || !shouldTruncateDescription)
      return itemState.description;
    return itemState.description.substring(0, DESCRIPTION_CHAR_LIMIT) + "...";
  };

  // SweetAlert2 delete confirmation
  const handleDelete = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "Delete Location?",
        text: `Are you sure you want to delete "${itemState.locationName}"? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        color: "#374151",
        customClass: {
          popup: "rounded-xl shadow-2xl",
          confirmButton: "rounded-lg font-semibold",
          cancelButton: "rounded-lg font-semibold",
        },
      }).then((result: any) => {
        if (result.isConfirmed) {
          setIsDeleting(true);
          onDelete();
          window.Swal.fire({
            title: "Deleted!",
            text: "The location has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#059669",
            customClass: {
              popup: "rounded-xl shadow-2xl",
              confirmButton: "rounded-lg font-semibold",
            },
          });
        }
      });
    } else {
      // Fallback
      if (
        confirm(`Are you sure you want to delete "${itemState.locationName}"?`)
      ) {
        setIsDeleting(true);
        onDelete();
      }
    }
  };

  const handleUpdate = (updatedItem: any) => {
    setItemState(updatedItem);
    setEditOpen(false);
    setImgErr(false);
    onUpdate(updatedItem);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-green-200">
        {/* Green accent bar */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>

        <div className="p-6">
          <div className="flex flex-col gap-4">
            {/* Image Section */}
            <div className="w-full">
              {itemState.customFilename && !imgErr ? (
                <div className="relative group/image overflow-hidden rounded-xl">
                  <img
                    src={`/uploads/${itemState.customFilename}`}
                    alt={itemState.locationName}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover/image:scale-110"
                    onError={() => setImgErr(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-green-300 hover:bg-green-50 transition-colors duration-200">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium">No image available</p>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-200 line-clamp-2">
                    {itemState.locationName}
                  </h3>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {tagsArray.length > 0 && (
                  <div className="space-y-2">
                    <div
                      className={`flex flex-wrap gap-2 ${
                        showAllTags && shouldShowMoreTags
                          ? "max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100"
                          : ""
                      }`}
                    >
                      {displayedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 flex-shrink-0"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Show More Tags Button */}
                    {shouldShowMoreTags && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                      >
                        <span>
                          {showAllTags
                            ? `Show less tags`
                            : `+${
                                tagsArray.length - TAGS_DISPLAY_LIMIT
                              } more tags`}
                        </span>
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            showAllTags ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {itemState.description && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-300">
                  <div
                    className={`text-gray-700 text-sm leading-relaxed ${
                      showFullDescription && shouldTruncateDescription
                        ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100"
                        : ""
                    }`}
                  >
                    <p>{getTruncatedDescription()}</p>
                  </div>

                  {/* Show More Description Button */}
                  {shouldTruncateDescription && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="mt-2 inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                    >
                      <span>
                        {showFullDescription ? "Show less" : "Show more"}
                      </span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${
                          showFullDescription ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Credit */}
              {itemState.credit && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Credit: {itemState.credit}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    disabled={isDeleting}
                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <svg
                        className="w-4 h-4 mr-1 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>

                {/* View Details Button */}
                <button className="inline-flex items-center text-xs text-gray-500 hover:text-green-600 transition-colors duration-200">
                  <span className="mr-1">View Details</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {editOpen && (
        <UpdateLocationForm
          item={itemState}
          onUpdate={handleUpdate}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
