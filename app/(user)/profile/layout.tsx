"use client";

import Navbar from "@/components/shared/navbar_profile";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const bgClass =
    role === "asisten"
      ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
      : "bg-gradient-to-br from-[#0267FE] to-blue-700";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="relative">
          <div className={`absolute top-0 left-0 w-full h-72 ${bgClass} z-0`}></div>
          <div className="relative z-10 pt-4">
            {/* Header */}
            <Navbar />
            {/* Content */}
            <div className="">{children}</div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-500 text-xs py-4">
        &copy; 2025 Sistem Informasi Manajemen Praktikum
      </footer>
    </div>
  );
};

export default Layout;
