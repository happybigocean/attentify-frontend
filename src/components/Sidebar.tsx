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
            <img className="h-12 w-auto" src="logo.png" alt="Attentify logo" />
          </a>

          <div className="flex-1 w-full px-2 overflow-y-auto">
            {/* Top menu */}
            <div className="flex flex-col items-start w-full mt-3 border-t border-gray-700">
              <a className="flex items-center w-full h-12 px-4 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="dashboard">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="ml-3 text-base font-medium">Dashboard</span>
              </a>

              <a className="relative flex items-center w-full h-12 px-4 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="/inbox">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="ml-3 text-base font-medium">Inbox</span>
                <span className="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full" />
              </a>

              <a className="flex items-center w-full h-12 px-4 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="/accounts">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M9 10a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                <span className="ml-3 text-base font-medium">Accounts</span>
              </a>
            </div>

            {/* Settings */}
            <div className="flex flex-col items-start w-full mt-2 border-t border-gray-700">
              <a className="flex items-center w-full h-12 px-4 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="/settings">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="ml-3 text-base font-medium">Settings</span>
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
