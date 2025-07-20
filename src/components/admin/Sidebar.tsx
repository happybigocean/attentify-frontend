import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-white text-black rounded-full shadow-lg focus:outline-none block lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Background overlay when mobile menu is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          z-40 bg-gray-900 text-gray-400 shadow-lg transition-all duration-300 ease-in-out
          ${mobileOpen ? "block fixed w-full" : "hidden"}
          lg:fixed lg:block lg:w-56 lg:h-full
        `}
      >
        <div className="flex flex-col h-full">
          <a className="flex items-center w-full px-4 py-3" href="/dashboard">
            <img className="h-12 w-auto" src="/logo.png" alt="Attentify logo" />
          </a>

          <div className="flex-1 w-full px-2 overflow-y-auto max-h-screen">
            {/* Top menu */}
            <div className="flex flex-col items-start w-full mt-3 border-t border-gray-700">
              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-700 hover:text-gray-300 focus:outline-none"
                href="/admin/dashboard"
              >
                <svg
                  className="w-6 h-6 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Home Icon */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5a1 1 0 001-1v-4h2v4a1 1 0 001 1h5a1 1 0 001-1V10"
                  />
                </svg>
                <span className="ml-3 text-base font-medium">Dashboard</span>
              </a>
              
              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-700 hover:text-gray-300 focus:outline-none"
                href="/admin/user"
              >
                <svg
                  className="w-6 h-6 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Updated User Icon: simple user silhouette */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"
                  />
                </svg>
                <span className="ml-3 text-base font-medium">User</span>
              </a>
            </div>
          </div>

          {/* Account (pinned bottom) */}
          <div className="border-t border-gray-700 w-full">
            <a
              className="flex items-center w-full h-12 px-4 hover:bg-gray-800 hover:text-gray-300"
              href="#"
            >
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-3 text-base font-medium">Account</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
