// components/HeaderBar.tsx
import React from "react";

interface HeaderBarProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function HeaderBar({ onMenuClick, isMobile }: HeaderBarProps) {
  return (
    <header className="flex items-center justify-between px-5 h-15 border-b border-gray-300 bg-white">
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="text-gray-700 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          ☰ {/* You can use an icon like Lucide or Heroicons */}
        </button>
      )}
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div>{/* User menu / notifications can go here */}</div>
    </header>
  );
}
