"use client";

import Navbar from "@/components/shared/navbar_submission";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated") {
      setRole(session?.user?.role);
    }
  }, [status, session]);

  const bgClass =
    role === "asisten"
      ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
      : "bg-gradient-to-br from-[#0267FE] to-blue-700";

  // Tentukan path yang tidak ingin menampilkan layout
  const hideLayout = pathname === "/submission"; // bisa tambahkan pengecualian lain jika perlu

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="relative">
          {!hideLayout && (
            <div className={`absolute top-0 left-0 w-full h-72 ${bgClass} z-0 transition-colors duration-300`} />
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
