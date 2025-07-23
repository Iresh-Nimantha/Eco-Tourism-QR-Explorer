"use client";
import React, { useEffect, useState } from "react";
import HeaderNav from "./components/HeaderNav";
import SortMenuButton from "./components/SortMenuButton";
import DashboardItemCard from "./components/DashboardItemCard";
import FloatingAddButton from "./components/FloatingAddButton";
import AddLocationForm from "./components/AddLocationForm";
import { fetchLocationsFromFirebase } from "../firebase/firestoreService";

type Location = {
  id: string;
  locationName: string;
  tags: string;
  description: string;
  credit: string;
  customFilename: string;
  createdAt?: string;
};

type SortOption = "name-asc" | "name-desc" | "date-newest" | "date-oldest";

export default function AdminDashboard() {
  const [items, setItems] = useState<Location[]>([]);
  const [filteredItems, setFilteredItems] = useState<Location[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    // Filter and sort items whenever items, sortBy, or searchQuery changes
    let filtered = items;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.locationName.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.toLowerCase().includes(query) ||
          item.credit.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.locationName.localeCompare(b.locationName);
        case "name-desc":
          return b.locationName.localeCompare(a.locationName);
        case "date-newest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "date-oldest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredItems(sorted);
  }, [items, sortBy, searchQuery]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const locations = await fetchLocationsFromFirebase();
      setItems(locations as Location[]);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Failed to fetch locations. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } else {
        alert("Failed to fetch locations");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSheetOpen(false);
    await fetchLocations();
  };

  const handleDelete = async (item: Location) => {
    try {
      const res = await fetch("/api/delete-location", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          customFilename: item.customFilename,
        }),
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== item.id));
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Failed to delete location. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } else {
        alert("Failed to delete location/image.");
      }
    }
  };

  const handleUpdate = (updatedItem: Location) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(5, 150, 105, 0.1) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content/Main */}
      <div className="relative z-10">
        <HeaderNav />
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Location Dashboard
                </h1>
                <p className="text-green-700 font-medium">
                  {filteredItems.length} of {items.length}{" "}
                  {items.length === 1 ? "location" : "locations"}
                  {searchQuery && " (filtered)"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 lg:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sort Button */}
                <SortMenuButton currentSort={sortBy} onSortChange={setSortBy} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
                  <p className="text-green-700 font-medium">
                    Loading locations...
                  </p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-green-600"
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
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? "No matching locations" : "No locations yet"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "Try adjusting your search terms or clear the search to see all locations."
                      : "Get started by adding your first location. Click the green plus button to begin."}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="transform transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DashboardItemCard
                      item={item}
                      onDelete={() => handleDelete(item)}
                      onUpdate={handleUpdate}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isSheetOpen && (
          <FloatingAddButton onClick={() => setIsSheetOpen(true)} />
        )}
      </div>

      {/* Add Modal - Full Screen */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full h-full overflow-y-auto">
            <AddLocationForm
              onClose={() => setIsSheetOpen(false)}
              onAdd={handleAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
}
