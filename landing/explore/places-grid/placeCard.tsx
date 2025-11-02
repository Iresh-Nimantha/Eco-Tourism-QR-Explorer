import React from "react";
import { LocationData } from "./types";

type Props = {
  place: LocationData;
  onViewDetails?: (place: LocationData) => void;
};

export default function PlaceCard({ place, onViewDetails }: Props) {
  // Determine image source
  const isFirebaseStorage =
    place.customFilename.startsWith("https://firebasestorage.googleapis.com") ||
    place.customFilename.includes("firebasestorage.googleapis.com");

  const imageSrc = isFirebaseStorage
    ? place.customFilename
    : `/uploads/${place.customFilename}`;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent click, if any
    if (onViewDetails) onViewDetails(place);
  };
  const GITHUB_REPO = "Iresh-Nimantha/test-img-upload";
  const GITHUB_BRANCH = "main";
  const GITHUB_IMAGES_PATH = "images";

  function getGithubImageUrl(filename: string) {
    return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGES_PATH}/${filename}`;
  }
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 ease-in-out overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={getGithubImageUrl(place.customFilename)}
          alt={place.locationName}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          draggable={false}
        />

        {/* Subtle overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-green-700 transition-colors duration-200"
            title={place.locationName}
          >
            {place.locationName}
          </h3>
          <p
            className="text-sm text-gray-600 line-clamp-3 leading-relaxed"
            title={place.description}
          >
            {place.description}
          </p>
        </div>

        {/* Stylish Green Button */}
        <button
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-200 ease-in-out border border-green-500/20"
        >
          <span>Read more</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
