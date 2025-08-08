import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      setIsDesktop(isNowDesktop);
      if (isNowDesktop) setSidebarMobileOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Sidebar
        mobileOpen={sidebarMobileOpen}
        setMobileOpen={setSidebarMobileOpen}
      />

      <div
        className="flex flex-col transition-all duration-600"
        style={{
          marginLeft: isDesktop ? 288 : 0,
          transition: "margin-left 0.6s cubic-bezier(.77,0,.18,1)",
          filter:
            !isDesktop && sidebarMobileOpen ? "blur(2px) brightness(0.8)" : undefined,
          pointerEvents:
            !isDesktop && sidebarMobileOpen ? "none" : undefined,
        }}
      >
        <HeaderBar
          isMobile={!isDesktop}
          onMenuClick={() => setSidebarMobileOpen(true)}
        />
        <main className="flex-1 p-2">{children}</main>
      </div>
    </div>
  );
}
