// components/HeaderBar.tsx
import React from "react";
import { usePageTitle } from "../context/PageTitleContext";

interface HeaderBarProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function HeaderBar({ onMenuClick, isMobile }: HeaderBarProps) {
    const { title } = usePageTitle();

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
            <p className="text-md font-semibold">{title}</p>
            <div>{/* User menu / notifications can go here */}</div>
        </header>
    );
}
