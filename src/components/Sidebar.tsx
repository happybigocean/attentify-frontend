import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

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
          z-40 text-gray-900 transition-all duration-300 ease-in-out border-r border-gray-300
          ${mobileOpen ? "block fixed w-full" : "hidden"}
          lg:fixed lg:block lg:w-56 lg:h-full
        `}
      >
        <div className="flex flex-col h-full">
          <a className="h-15 flex items-center w-full pl-5 border-b border-gray-300" href="/dashboard">
            <img className="h-10 w-auto" src="/logo.png" alt="Attentify logo" />
          </a>

          <div className="flex-1 w-full px-2 overflow-y-auto max-h-screen">
            {/* Top menu */}
            <div className="flex flex-col items-start w-full mt-2">
              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-100 focus:outline-none"
                href="/dashboard"
              >
                <HomeIcon className="w-6 h-6"/>
                <span className="ml-3 text-base font-medium">Dashboard</span>
              </a>

              <a
                className="relative flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-100 focus:outline-none"
                href="/message"
              >
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6"/>
                <span className="ml-3 text-base font-medium">Message</span>
                <span className="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full" />
              </a>

              { false && (
                <a
                  className="flex items-center w-full h-12 px-4 mt-2 rounded-md transition hover:bg-gray-100  focus:outline-none"
                  href="/order"
                >
                  <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l1.664 12.131A2 2 0 006.65 21h10.7a2 2 0 001.986-1.869L21 7M16 7V5a4 4 0 00-8 0v2M5 7h14" />
                  </svg>
                  <span className="ml-3 text-base font-medium">Order</span>
                </a>
              )}

              {/* Accounts submenu */}
              <div className="w-full">
                <details className="w-full group">
                  <summary className="flex items-center w-full h-12 px-4 mt-2 rounded-md cursor-pointer transition hover:bg-gray-100  list-none focus:outline-none">
                    <Squares2X2Icon className="w-6 h-6"/>
                    <span className="ml-3 text-base font-medium">Accounts</span>
                    <ChevronRightIcon className="ml-auto w-4 h-4 transition-transform duration-200 group-open:rotate-90"/>
                  </summary>
                  <div className="pl-5 py-1 flex flex-col gap-1">
                    <a href="/accounts/gmail" className="flex items-center h-10 px-2 rounded-md hover:bg-gray-100  transition focus:outline-none">
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      <span>Gmail</span>
                    </a>
                    <a href="/accounts/phone" className="flex items-center h-10 px-2 rounded-md hover:bg-gray-100  transition focus:outline-none">
                        <DevicePhoneMobileIcon className="w-5 h-5 mr-2" />
                      <span>Phone</span>
                    </a>
                  </div>
                </details>
              </div>

              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md hover:bg-gray-100  transition focus:outline-none"
                href="/shopify"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                <span className="ml-3 text-base font-medium">Shopify</span>
              </a>
            </div>

            {/* Settings */}
            <div className="flex flex-col items-start w-full mt-2 border-t border-gray-300">
              <a
                className="flex items-center w-full h-12 px-4 mt-2 rounded-md hover:bg-gray-100  transition focus:outline-none"
                href="/settings"
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span className="ml-3 text-base font-medium">Settings</span>
              </a>
            </div>
          </div>

          {/* Account (pinned bottom) */}
          <div className="border-t border-gray-300 w-full relative" ref={accountMenuRef}>
            <button
              className="flex items-center w-full h-12 px-4 hover:bg-gray-100  focus:outline-none relative"
              onClick={() => setAccountOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={accountOpen}
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="ml-3 text-base font-medium truncate max-w-[90px]">{userName}</span>
              <ChevronRightIcon className={`ml-auto w-4 h-4 transition-transform duration-200 ${accountOpen ? "rotate-90" : ""}`}/>
            </button>
            {accountOpen && (
              <div className="absolute bottom-12 left-0 w-full bg-gray-100 border border-gray-300 rounded-md z-50 animate-fade-in">
                <div className="flex flex-col py-2">
                  <div className="px-4 py-2 text-gray-900 font-semibold border-b border-gray-300">
                    {userName}
                  </div>
                  <div className="px-4 py-1 text-sm text-gray-900 border-b border-gray-300">
                    {userRole}
                  </div>
                  <div className="px-4 py-1 text-sm text-gray-900 border-b border-gray-300">
                    {userEmail}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-500 hover:bg-gray-300 hover:text-red-400 transition"
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