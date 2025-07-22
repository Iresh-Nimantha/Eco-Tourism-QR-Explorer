"use client";
import React, { useEffect, useState } from "react";
import HeaderNav from "./components/HeaderNav";
import SortMenuButton from "./components/SortMenuButton";
import DashboardItemCard from "./components/DashboardItemCard";
import FloatingAddButton from "./components/FloatingAddButton";
import AddLocationForm from "./components/AddLocationForm";
import {
  fetchLocationsFromFirebase,
  deleteLocationFromFirebase,
} from "../firebase/firestoreService"; // adjust path

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const locations = await fetchLocationsFromFirebase();
    setItems(locations as Location[]);
  };

  const handleAdd = async () => {
    setIsSheetOpen(false);
    // Optionally: refetch all, or push the result if returned
    await fetchLocations();
  };

  const handleDelete = async (item: Location) => {
    if (!confirm("Delete this location and its image?")) return;

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
      alert("Failed to delete location/image.");
    }
  };

  // You can make handleEdit for modal-based editing if you wish!

  return (
    <div className="min-h-screen min-w-full bg-white relative">
      {!isSheetOpen ? (
        <>
          <HeaderNav />
          <div className="my-6">
            <SortMenuButton />
          </div>
          <div className="space-y-4 mb-24">
            {items.map((item) => (
              <DashboardItemCard
                key={item.id}
                item={item}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
          <FloatingAddButton onClick={() => setIsSheetOpen(true)} />
        </>
      ) : (
        // Overlay full screen sheet/modal
        <div className="fixed inset-0 z-50 w-screen h-screen flex bg-white">
          <div className="max-w-xl w-full m-auto px-0">
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
