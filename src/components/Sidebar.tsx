import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface User {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  // Get user from localStorage
  let user: User | null = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }
  const userName = user?.name || "Account";
  const userRole = user?.role || "";
  const userEmail = user?.email || "";

  // Account menu state
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close account menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
                href="/dashboard"
              >
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="ml-3 text-base font-medium">Dashboard</span>
              </a>

              <a
                className="relative flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-700 hover:text-gray-300 focus:outline-none"
                href="/message"
              >
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="ml-3 text-base font-medium">Message</span>
                <span className="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full" />
              </a>

              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-700 hover:text-gray-300 focus:outline-none"
                href="/order"
              >
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l1.664 12.131A2 2 0 006.65 21h10.7a2 2 0 001.986-1.869L21 7M16 7V5a4 4 0 00-8 0v2M5 7h14" />
                </svg>
                <span className="ml-3 text-base font-medium">Order</span>
              </a>

              {/* Accounts submenu */}
              <div className="w-full">
                <details className="w-full group">
                  <summary className="flex items-center w-full h-12 px-4 mt-2 rounded-md cursor-pointer transition hover:bg-gray-700 hover:text-gray-300 list-none focus:outline-none">
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M9 10a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    <span className="ml-3 text-base font-medium">Accounts</span>
                    <svg className="ml-auto w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </summary>
                  <div className="pl-5 py-1 flex flex-col gap-1">
                    <a href="/accounts/gmail" className="flex items-center h-10 px-2 rounded-md hover:bg-gray-700 hover:text-gray-300 transition focus:outline-none">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                      </svg>
                      <span>Gmail</span>
                    </a>
                    <a href="/accounts/phone" className="flex items-center h-10 px-2 rounded-md hover:bg-gray-700 hover:text-gray-300 transition focus:outline-none">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v3a2 2 0 01-.59 1.41l-1.3 1.3a16 16 0 006.59 6.59l1.3-1.3A2 2 0 0116 14h3a2 2 0 012 2v2a2 2 0 01-2 2A18 18 0 013 5z"/>
                        </svg>
                      <span>Phone</span>
                    </a>
                  </div>
                </details>
              </div>

              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md hover:bg-gray-700 hover:text-gray-300 transition focus:outline-none"
                href="/shopify"
              >
                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M8.5 10L6 26c-.1.6.3 1 .9 1h18.2c.6 0 1-.4.9-1L24 10H8.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M11 10V7a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M19 16c0-1.1-.9-2-2-2s-2 .9-2 2 .9 1.5 2 2 2 .9 2 2-.9 2-2 2-2-.9-2-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                <span className="ml-3 text-base font-medium">Shopify</span>
              </a>
            </div>

            {/* Settings */}
            <div className="flex flex-col items-start w-full mt-2 border-t border-gray-700">
              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md hover:bg-gray-700 hover:text-gray-300 transition focus:outline-none"
                href="/settings"
              >
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="ml-3 text-base font-medium">Settings</span>
              </a>
            </div>
          </div>

          {/* Account (pinned bottom) */}
          <div className="border-t border-gray-700 w-full relative" ref={accountMenuRef}>
            <button
              className="flex items-center w-full h-12 px-4 hover:bg-gray-800 hover:text-gray-300 focus:outline-none relative"
              onClick={() => setAccountOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={accountOpen}
            >
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-3 text-base font-medium truncate max-w-[90px]">{userName}</span>
              <svg
                className={`ml-auto w-4 h-4 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {accountOpen && (
              <div className="absolute bottom-12 left-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in">
                <div className="flex flex-col py-2">
                  <div className="px-4 py-2 text-gray-300 font-semibold border-b border-gray-700">
                    {userName}
                  </div>
                  <div className="px-4 py-1 text-sm text-gray-400 border-b border-gray-700">
                    {userRole}
                  </div>
                  <div className="px-4 py-1 text-sm text-gray-400 border-b border-gray-700">
                    {userEmail}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-500 hover:bg-gray-700 hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}