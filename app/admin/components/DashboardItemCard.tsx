import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import UpdateLocationForm from "./UpdateLocationForm";

// --- Types
type Location = {
  id: string;
  locationName: string;
  description: string;
  tags: string;
  credit: string;
  customFilename: string;
};

type DashboardItemCardProps = {
  item: Location;
  onDelete: () => Promise<void> | void;
};

// --- Main Component
export default function DashboardItemCard({
  item,
  onDelete,
}: DashboardItemCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemState, setItemState] = useState(item);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // -- Truncation settings
  const DESCRIPTION_CHAR_LIMIT = 150;
  const TAGS_DISPLAY_LIMIT = 3;

  // Helpers
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

  // SweetAlert2 delete confirmation
  const handleDelete = async () => {
    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await onDelete(); // Should be async if possible
        await Swal.fire({
          title: "Deleted!",
          text: "The location has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#059669",
          background: "#fff",
          color: "#374151",
          customClass: { popup: "rounded-xl shadow-2xl" },
        });
      } catch (e: any) {
        await Swal.fire({
          title: "Delete failed",
          text: e?.message || "Could not delete location.",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      }
      setIsDeleting(false);
    }
  };

  // Close ESC for modals
  useEffect(() => {
    if (!editOpen && !showFullDescription) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditOpen(false);
        setShowFullDescription(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editOpen, showFullDescription]);

  // --- Card Layout with Fixed Height ---
  return (
    <>
      <div className="h-full">
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-green-200 flex flex-col h-full">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <div className="flex flex-col flex-1 p-6">
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-200">
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
                  <div>
                    <div
                      className={`flex flex-wrap gap-2 ${
                        showAllTags && shouldShowMoreTags
                          ? "max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100"
                          : ""
                      }`}
                    >
                      {displayedTags.map((tag, idx) => (
                        <span
                          key={idx}
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
                    {shouldShowMoreTags && (
                      <button
                        onClick={() => setShowAllTags((v) => !v)}
                        className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-200 mt-1"
                      >
                        <span>
                          {showAllTags
                            ? "Show less tags"
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

                {/* Description (clamped, fixed height) */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-300 min-h-[56px] max-h-[80px] flex-1 flex flex-col">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {itemState.description}
                  </p>
                  {shouldTruncateDescription && (
                    <button
                      className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 font-medium mt-2 transition-colors duration-200"
                      onClick={() => setShowFullDescription(true)}
                    >
                      <span>See more</span>
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Credit */}
                {itemState.credit && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Photo by: {itemState.credit}</span>
                  </div>
                )}
              </div>
              {/* Image */}
              <div className="lg:w-80 mt-6">
                {itemState.customFilename && !imgErr ? (
                  <div className="relative group/image overflow-hidden rounded-xl">
                    <img
                      src={`/uploads/${itemState.customFilename}`}
                      alt={itemState.locationName}
                      className="w-full h-48 lg:h-56 object-cover transition-transform duration-300 group-hover/image:scale-110"
                      onError={() => setImgErr(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-48 lg:h-56 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-green-300 hover:bg-green-50 transition-colors duration-200">
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
            </div>
            {/* --- Actions Row --- */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button
                className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                      />
                    </svg>
                    <span className="text-sm font-semibold">Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110"
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
                    <span className="text-sm font-semibold">Delete</span>
                  </>
                )}
              </button>
              <button
                className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 shadow-md hover:shadow-lg"
                onClick={() => setEditOpen(true)}
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-12"
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
                <span className="text-sm font-semibold">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description Modal */}
      {showFullDescription && (
        <MiniModal onClose={() => setShowFullDescription(false)}>
          <div
            className="
      bg-white rounded-t-xl max-w-lg md:w-full w-2xs
      shadow-lg flex flex-col 
    "
          >
            {/* Sticky Header */}
            <div
              className="
          sticky top-0 z-10 bg-white rounded-t-xl
          flex items-center justify-between
          px-6 py-4 border-b border-gray-100
        "
              style={{ minHeight: 62 }}
            >
              <h4 className="text-lg font-bold mb-0">Full Description</h4>
              <button
                type="button"
                className="ml-4 text-gray-500 hover:text-green-600 px-3 py-1 rounded-lg transition"
                onClick={() => setShowFullDescription(false)}
                aria-label="Close"
              >
                <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l8 8M6 14L14 6"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Body - clip corners! */}
            <div
              className="
          px-6 pt-2 pb-8
          overflow-y-auto scrollbar-thin scrollbar-thumb-green-200
          max-h-[65vh]
          
        "
              // rounded-b-xl ensures bottom corners are always clipped during scroll
            >
              <p className="text-base text-gray-700 whitespace-pre-line">
                {itemState.description}
              </p>
            </div>
          </div>
          <div
            className="bg-white rounded-b-xl
          flex items-center justify-between
          px-6 py-4 border-b border-gray-100"
          ></div>
        </MiniModal>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <MiniModal onClose={() => setEditOpen(false)}>
          <div className="w-full max-w-xl md:max-w-3xl mx-2 md:mx-auto h-[90vh] max-h-[90vh]  ">
            <UpdateLocationForm
              item={itemState}
              onClose={() => setEditOpen(false)}
              onUpdate={(updated) => {
                setItemState(updated);
                setEditOpen(false);
                setImgErr(false);
              }}
            />
          </div>
        </MiniModal>
      )}
    </>
  );
}

// --- Mini Modal Overlay ---
function MiniModal({
  onClose,
  children,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-1 py-4">
      <div ref={dialogRef} className="relative">
        {children}
      </div>
    </div>
  );
}
