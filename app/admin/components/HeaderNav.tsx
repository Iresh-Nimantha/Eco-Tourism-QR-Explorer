import React, { useState } from "react";

export default function HeaderNav() {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // SweetAlert2 confirmation for logout
    if (window.Swal) {
      window.Swal.fire({
        title: "Logout Confirmation",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
        background: "#f8fafc",
        customClass: {
          popup: "rounded-xl shadow-xl",
          title: "text-gray-800 font-semibold",
          content: "text-gray-600",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
            confirmButtonColor: "#10b981",
            timer: 2000,
            showConfirmButton: false,
            background: "#f8fafc",
            customClass: {
              popup: "rounded-xl shadow-xl",
            },
          });
          // Here you would redirect to login page
          // window.location.href = '/login';
        }
      });
    } else {
      // Fallback if SweetAlert2 is not loaded
      if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!");
        // window.location.href = '/login';
      }
    }
  };

  return (
    <>
      {/* SweetAlert2 CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.7.32/sweetalert2.all.min.js"></script>

      <nav className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-green-200 px-6 py-4 mb-8 rounded-lg shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Dashboard Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <a
              href="/"
              onClick={() => handleLinkClick("website")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                activeLink === "website"
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-green-700 hover:bg-green-100 hover:text-green-800"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
                <span>Website</span>
              </div>
            </a>

            <a
              href="/admin"
              onClick={() => handleLinkClick("locations")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                activeLink === "locations"
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-green-700 hover:bg-green-100 hover:text-green-800"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>View Locations</span>
              </div>
            </a>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-red-200 hover:border-red-300"
            >
              <div className="flex items-center space-x-2">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>

        {/* Active indicator line */}
        <div className="mt-2 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-50"></div>
      </nav>
    </>
  );
}
