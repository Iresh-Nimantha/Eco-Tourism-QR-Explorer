// components/FloatingAddButton.tsx
import React from "react";

interface FABProps {
  onClick: () => void;
}

const FloatingAddButton: React.FC<FABProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-10 right-10 bg-white border border-gray-300 rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl text-gray-400 hover:bg-gray-100 transition"
    aria-label="Add New Item"
  >
    +
  </button>
);

export default FloatingAddButton;
