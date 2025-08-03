"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientNavbar from "@/landing/ClientNavbarWrapper";
import { LocationData } from "@/landing/explore/places-grid/types";
import PlaceCard from "@/landing/explore/places-grid/placeCard";
import { getPlacesByDistrictOrTag } from "@/src/lib/getPlacesByDistrictOrTag";
import { getPlaceData } from "../../../src/lib/getPlaceData";

// --- Share Functions ---
const shareOnTwitter = (title: string, url: string) => {
  const text = `Check out this amazing place: ${title}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

const shareOnWhatsApp = (title: string, url: string) => {
  const text = `Check out this amazing place: ${title} ${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
};

const copyToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Link copied to clipboard!");
    } catch (_) {}
    document.body.removeChild(textArea);
  }
};

const ShareIcons = ({
  placeTitle,
  currentUrl,
}: {
  placeTitle: string;
  currentUrl: string;
}) => {
  return (
    <div className="flex space-x-3 sm:space-x-4">
      {/* Twitter Share Button */}
      <button
        onClick={() => shareOnTwitter(placeTitle, currentUrl)}
        className="p-2 sm:p-2.5 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white transition-all duration-200 shadow-md hover:shadow-lg"
        title="Share on Twitter"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      </button>

      {/* WhatsApp Share Button */}
      <button
        onClick={() => shareOnWhatsApp(placeTitle, currentUrl)}
        className="p-2 sm:p-2.5 bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-white transition-all duration-200 shadow-md hover:shadow-lg"
        title="Share on WhatsApp"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={() => copyToClipboard(currentUrl)}
        className="p-2 sm:p-2.5 bg-gray-300 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
        title="Copy link"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      </button>
    </div>
  );
};

// ------- Main Component -------
type PlaceParamsObj = { placeId: string };
type PlaceProps = {
  params: PlaceParamsObj | Promise<PlaceParamsObj>;
};

export default function PlaceDetail({ params }: PlaceProps) {
  const [unwrappedParams, setUnwrappedParams] = useState<PlaceParamsObj | null>(
    null
  );
  const [place, setPlace] = useState<any>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<LocationData[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  // Unwrap params Promise (Next.js 14+)
  useEffect(() => {
    (async () => {
      if (typeof (params as any).then === "function") {
        setUnwrappedParams(await (params as Promise<PlaceParamsObj>));
      } else {
        setUnwrappedParams(params as PlaceParamsObj);
      }
    })();
  }, [params]);

  // Fetch place & related data when params is ready
  useEffect(() => {
    if (!unwrappedParams) return;

    async function fetchData() {
      if (!unwrappedParams) return;
      const placeData = await getPlaceData(unwrappedParams.placeId);
      setPlace(placeData);

      if (placeData) {
        const related = await getPlacesByDistrictOrTag(
          placeData.district ?? "",
          placeData.tags ?? "",
          unwrappedParams.placeId
        );
        setRelatedPlaces(related);
      }
    }
    fetchData();
    setCurrentUrl(window.location.href);
  }, [unwrappedParams]);

  if (!unwrappedParams) return <div>Loading...</div>;

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 9v2m0 4h.01" />
              <path d="M5.062 19h13.876c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Place Not Found
          </h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            The place ID{" "}
            <span className="font-semibold text-red-500">
              {unwrappedParams.placeId}
            </span>{" "}
            does not exist in our database.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  // Helper for tags
  const getAllTags = (): string => {
    const tags: string[] = [];
    if (place.district) tags.push(place.district);
    if (place.tags) {
      const otherTags = place.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag && tag !== place.district);
      tags.push(...otherTags);
    }
    return tags.join(", ");
  };

  const allTagsString = getAllTags();
  const tagArray = allTagsString ? allTagsString.split(", ") : [];
  const placeTitle = place.locationName || place.name || "Amazing Place";

  return (
    <div className="bg-white min-h-screen">
      <ClientNavbar />

      <article className="pt-[60px] sm:pt-[74px]">
        {/* Hero Image */}
        {place.imageUrl && (
          <div className="w-full relative">
            <div className="w-full min-h-[250px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] relative">
              {place.imageUrl.includes("firebasestorage.googleapis.com") ? (
                <Image
                  src={`/uploads/${place.customFilename}`}
                  alt={place.locationName || place.name || "Place image"}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain bg-gray-100"
                  priority
                />
              ) : (
                <img
                  src={`/uploads/${place.customFilename}`}
                  alt={place.locationName || place.name || "Place image"}
                  className="w-full h-auto object-contain bg-gray-100"
                  loading="lazy"
                  draggable={false}
                />
              )}
            </div>
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight drop-shadow-lg">
                  {place.locationName || place.name}
                </h1>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white/90">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">
                    {tagArray[0] || "Unknown Location"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
          {/* Header for places without images */}
          {!place.imageUrl && (
            <header className="mb-8 sm:mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {place.locationName || place.name}
              </h1>
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-gray-600">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  {tagArray[0] || "Unknown Location"}
                </span>
              </div>
            </header>
          )}

          {/* Description */}
          <article className="prose prose-sm sm:prose-base md:prose-lg prose-gray max-w-none mx-auto">
            {(place.description?.split("\n") ?? []).map(
              (paragraph: string, index: number) =>
                paragraph.trim() && (
                  <p
                    key={index}
                    className="mb-4 sm:mb-6 leading-relaxed text-gray-700 text-sm sm:text-base md:text-lg"
                  >
                    {paragraph}
                  </p>
                )
            )}
          </article>

          {/* Share Section */}
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col gap-4 sm:gap-6">
            <span className="text-gray-600 font-medium text-sm sm:text-base">
              Share this place:
            </span>
            <div className="flex justify-center sm:justify-start">
              <ShareIcons placeTitle={placeTitle} currentUrl={currentUrl} />
            </div>
          </section>
        </div>

        {/* Related Places Section */}
        {relatedPlaces.length > 0 && (
          <section className="bg-gradient-to-br from-gray-50 to-green-50/30 py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  More from {tagArray[0] || "This Area"}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  Discover other amazing places and continue your journey of
                  exploration
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {relatedPlaces.slice(0, 8).map((relatedPlace: LocationData) => (
                  <Link
                    key={relatedPlace.id}
                    href={`/places/${relatedPlace.id}`}
                    className="block transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:ring-offset-2 rounded-2xl"
                    aria-label={`Read about ${relatedPlace.locationName}`}
                    prefetch={false}
                  >
                    <PlaceCard place={relatedPlace} />
                  </Link>
                ))}
              </div>
              {relatedPlaces.length > 8 && (
                <div className="text-center mt-8 sm:mt-12">
                  <Link
                    href="/explore"
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                  >
                    Explore All Places
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
