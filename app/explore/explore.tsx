"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // adjust path as needed
import { LocationData } from "../../landing/explore/places-grid/types";
import PlaceCard from "../../landing/explore/places-grid/placeCard";
import Footer from "../../landing/Footer";
import Navbar from "../../landing/Navbar";
import LoadingSpinner from "../../landing/explore/LoadingSpinner";

export default function ExplorePage() {
  const [places, setPlaces] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTagRaw = searchParams?.get("tag") ?? null; // string | null
  const normalizedTag = urlTagRaw ? urlTagRaw.toLowerCase() : null;

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(4);
      else if (window.innerWidth < 1024) setItemsPerPage(6);
      else setItemsPerPage(8);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        const data: LocationData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<LocationData, "id">),
        }));
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Function to clear the tag filter from URL
  const clearTagFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() ?? "");
    newSearchParams.delete("tag");
    const basePath = window.location.pathname;

    router.push(
      `${basePath}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }`
    );
  };

  // Filter places by tag if tag query param exists
  const tagFilteredPlaces =
    normalizedTag && normalizedTag.length > 0
      ? places.filter(
          (place) => place.tags?.toLowerCase().includes(normalizedTag) ?? false
        )
      : places;

  // Filter by search term (name, description, tags)
  const filteredPlaces = tagFilteredPlaces.filter((place) => {
    if (!searchTerm.trim()) return true;
    const searchTokens = searchTerm.toLowerCase().trim().split(/\s+/);
    return searchTokens.every((token) => {
      const inName = place.locationName?.toLowerCase().includes(token) ?? false;
      const inDescription =
        place.description?.toLowerCase().includes(token) ?? false;
      const inTags = place.tags?.toLowerCase().includes(token) ?? false;
      return inName || inDescription || inTags;
    });
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlaces = filteredPlaces.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="pt-0 overflow-auto hide-scrollbar h-screen">
      <Navbar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-green-50/30">
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Explore Places
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing destinations and hidden gems around the world
            </p>
          </div>

          {/* Active Tag Filter with Close Button */}
          {normalizedTag && (
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 font-semibold px-6 py-3 rounded-full shadow-lg ring-2 ring-green-200 select-none">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg capitalize">{normalizedTag}</span>
                {/* Close button */}
                <button
                  onClick={clearTagFilter}
                  aria-label="Clear tag filter"
                  className="ml-4 rounded-full p-0.5 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  type="button"
                >
                  <svg
                    className="w-4 h-4 text-green-800"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              <input
                type="search"
                aria-label="Search places by name, description, or tags"
                placeholder="Search by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium bg-white"
              />
            </div>
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Found{" "}
                <span className="font-semibold text-green-700">
                  {filteredPlaces.length}
                </span>{" "}
                {filteredPlaces.length === 1 ? "place" : "places"} matching "
                {searchTerm}"
              </p>
            </div>
          )}

          {/* Place Cards Grid */}
          {paginatedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={`/places/${place.id}`}
                  className="transform hover:scale-[1.02] transition-transform duration-300"
                  prefetch={false}
                >
                  <PlaceCard place={place} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No places found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse all available
                  places.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav
                className="inline-flex items-center space-x-2 bg-white rounded-2xl shadow-lg p-2"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200"
                  aria-label="Previous Page"
                >
                  ← Prev
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === idx + 1
                          ? "bg-green-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={
                        currentPage === idx + 1 ? "page" : undefined
                      }
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200"
                  aria-label="Next Page"
                >
                  Next →
                </button>
              </nav>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
