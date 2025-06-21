"use client";

import Navbar from "@/components/shared/navbar_tp";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  // Tentukan halaman yang tidak ingin menggunakan layout ini
  const hideLayout = pathname === "/tugas-pendahuluan"; // kamu bisa tambah pengecualian lain di sini

  const bgClass =
    role === "asisten"
      ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
      : "bg-gradient-to-br from-[#0267FE] to-blue-700";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="relative">
          {!hideLayout && (
            <div
              className={`absolute top-0 left-0 w-full h-72 ${bgClass} z-0`}
            ></div>
          )}
          <div className="relative z-10 pt-4">
            {/* Header */}
            {!hideLayout && <Navbar />}
            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </main>
      {!hideLayout && (
        <footer className="text-center text-gray-500 text-xs py-4">
          &copy; 2025 Sistem Informasi Manajemen Praktikum
        </footer>
      )}
    </div>
  );
};

export default Layout;
