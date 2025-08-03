"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import HeaderNav from "./components/HeaderNav";
import SortMenuButton from "./components/SortMenuButton";
import DashboardItemCard from "./components/DashboardItemCard";
import FloatingAddButton from "./components/FloatingAddButton";
import AddLocationForm from "./components/AddLocationForm";
import {
  fetchLocationsFromFirebase,
  deleteLocationFromFirebase,
} from "../firebase/firestoreService";
import Head from "next/head";

// --- Types
type Location = {
  id: string;
  locationName: string;
  tags: string;
  description: string;
  credit: string;
  customFilename: string;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sort, setSort] = useState(""); // name, newest, tags...
  const [search, setSearch] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch locations on mount and after add
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const locations = await fetchLocationsFromFirebase();
      setItems(locations as Location[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async () => {
    setIsSheetOpen(false);
    await fetchLocations();
  };

  // Delete with confirmation (optionally hook up SweetAlert2 inside DashboardItemCard for best UX)
  const handleDelete = async (item: Location) => {
    if (!confirm("Delete this location and its image?")) return;
    setLoading(true);
    const res = await fetch("/api/delete-location", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        customFilename: item.customFilename,
      }),
    });
    if (res.ok) setItems(items.filter((i) => i.id !== item.id));
    else alert("Failed to delete location/image.");
    setLoading(false);
  };

  // ESC to close modal
  useEffect(() => {
    if (!isSheetOpen) return;
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSheetOpen(false);
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [isSheetOpen]);

  // Click-outside to close modal
  useEffect(() => {
    if (!isSheetOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsSheetOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isSheetOpen]);

  // --- Filtering and Sorting ---
  const filteredItems = useMemo(() => {
    let result = items;
    // Search filter (name, tags, desc, credit)
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.locationName.toLowerCase().includes(s) ||
          item.tags?.toLowerCase().includes(s) ||
          item.description?.toLowerCase().includes(s) ||
          item.credit?.toLowerCase().includes(s)
      );
    }
    // Sort
    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.locationName.localeCompare(b.locationName)
      );
    } else if (sort === "newest") {
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    } else if (sort === "oldest") {
      result = [...result].sort((a, b) => a.id.localeCompare(b.id));
    } else if (sort === "tags") {
      result = [...result].sort((a, b) =>
        (a.tags || "").localeCompare(b.tags || "")
      );
    } else if (sort === "credit") {
      result = [...result].sort((a, b) =>
        (a.credit || "").localeCompare(b.credit || "")
      );
    }
    return result;
  }, [items, search, sort]);

  return (
    <>
      <Head>
        <title>Eco Tourism</title>

        <link rel="icon" href="./favicon.png" type="image/png" />
      </Head>
      <div className="min-h-screen min-w-full bg-white relative">
        <HeaderNav />
        {/* Sticky, responsive search + sort bar */}
        <div className="my-6">
          <SortMenuButton
            sort={sort}
            onSortChange={setSort}
            search={search}
            onSearchChange={setSearch}
            count={filteredItems.length}
          />
        </div>

        {/* Spinner Overlay while loading */}
        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-12 w-12 text-green-600 mb-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 100 10v3a8 8 0 01-8-8z"
                />
              </svg>
              <span className="text-green-800 font-semibold text-lg">
                Loading Locations…
              </span>
            </div>
          </div>
        )}

        {/* Cards Grid (hidden while loading) */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-6 mb-24">
            {filteredItems.map((item) => (
              <div key={item.id} className="h-full">
                <DashboardItemCard
                  item={item}
                  onDelete={() => handleDelete(item)}
                />
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg">
                No locations found.
              </div>
            )}
          </div>
        )}

        <FloatingAddButton onClick={() => setIsSheetOpen(true)} />

        {/* Modal Popup for Add Location */}
        {isSheetOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            aria-modal="true"
            role="dialog"
          >
            <div
              ref={modalRef}
              className={`
        relative bg-white rounded-2xl shadow-2xl border border-green-100
        w-[98vw] max-w-4xl
        h-[92vh] max-h-[98vh]
        flex flex-col p-1 sm:p-8
        animate-fadeIn overflow-y-auto no-scrollbar
      `}
              style={{ minWidth: 320, minHeight: 420 }}
              tabIndex={-1}
            >
              <AddLocationForm
                onClose={() => setIsSheetOpen(false)}
                onAdd={handleAdd}
              />
            </div>
          </div>
        )}

        {/* Fade in animation for modals */}
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to   { opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
      </div>
    </>
  );
}
