"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AUTH_PAGES = new Set(["/login", "/"]);

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.has(pathname);

  if (isAuthPage) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", padding: "16px", borderRight: "1px solid #e2e8f0" }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, padding: "16px" }}>
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
