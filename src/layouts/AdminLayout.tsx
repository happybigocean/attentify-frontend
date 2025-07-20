import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/admin/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // On desktop, always leave space for sidebar; on mobile, never push content
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) setSidebarMobileOpen(false);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Sidebar
        mobileOpen={sidebarMobileOpen}
        setMobileOpen={setSidebarMobileOpen}
      />
      <main
        className="h-full transition-all duration-600"
        style={{
          marginLeft: isDesktop ? 224 : 0,
          transition: "margin-left 0.6s cubic-bezier(.77,0,.18,1)",
          filter: !isDesktop && sidebarMobileOpen ? "blur(2px) brightness(0.8)" : undefined,
          pointerEvents: !isDesktop && sidebarMobileOpen ? "none" : undefined,
        }}
      >
        {children}
      </main>
    </div>
  );
}