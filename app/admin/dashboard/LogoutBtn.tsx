// components/LogoutButton.tsx
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import "../../globals.css"; // Ensure global styles are applied
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }

        const timestamp = Date.now();

        // Force page refresh and redirect
        window.location.href = `/admin/login?t=${timestamp}`;
      }
    } catch (error) {
      console.error("Logout failed:", error);

      const timestamp = Date.now();
      window.location.href = `/admin/login?t=${timestamp}`;
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
