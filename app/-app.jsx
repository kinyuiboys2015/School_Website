"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Foooter/page"; 
import ModernNavbar from "./components/Navbar/page";
import { useEffect } from "react";

const normalizePathname = (value = "/") => {
  try {
    return decodeURIComponent(value).replace(/\/+$/, "") || "/";
  } catch {
    return value.replace(/\/+$/, "") || "/";
  }
};

export default function ClientLayoutWrapper({ children }) {
  const pathname = normalizePathname(usePathname() || "/");

  const isMainDashboard = pathname === "/MainDashboard" || pathname.startsWith("/MainDashboard/");
  const isStudentPortal = pathname === "/pages/StudentPortal";
  const isAdminLogin = ["/pages/Sign In", "/pages/Sign-In", "/pages/adminLogin"].includes(pathname);
  const isPasswordRecovery = ["/pages/forgotpassword", "/pages/resetpassword"].includes(pathname);
  const hideNavbar = isMainDashboard || isStudentPortal || isPasswordRecovery;
  const hideFooter = isMainDashboard || isStudentPortal || isAdminLogin || isPasswordRecovery;

  // Add or remove zoom class based on route
  useEffect(() => {
    if (isMainDashboard) {
      document.documentElement.classList.add("no-zoom");
    } else {
      document.documentElement.classList.remove("no-zoom");
    }
  }, [isMainDashboard]);

  return (
    <>
      {/* Hide public site chrome on protected/full-screen app routes */}
      {!hideNavbar && <ModernNavbar />}

      <main className="min-h-screen">{children}</main>

      {!hideFooter && <Footer />}
    </>
  );
}
