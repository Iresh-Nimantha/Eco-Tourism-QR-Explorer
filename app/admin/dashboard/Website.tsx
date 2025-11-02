"use client";

import { useRouter } from "next/navigation";
import React from "react";

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
        // Redirect with timestamp to force page refresh
        window.location.href = `/`;
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
      type="button"
      className="group relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-lg hover:bg-slate-50 flex items-center space-x-2"
    >
      {/* SVG icon matching your original */}
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
        />
      </svg>

      <span>Website</span>

      {/* Bottom underline animation */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></div>
    </button>
  );
}
