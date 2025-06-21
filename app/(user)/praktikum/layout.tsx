"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const hiddenRoutes = [
    "/modul",
    "/praktikum/prak-lab-sister/prak-eldas/admin",
    "/praktikum/prak-lab-sister/prak-sdl/admin",
  ];

  const hideNavbar = hiddenRoutes.some((route) => pathname.includes(route));

  const role = session?.user?.role;

  // Tentukan class background berdasarkan role
const bgClass =
  role === "asisten"
    ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
    : "bg-gradient-to-br from-[#0267FE] to-blue-700";
    
  if (hideNavbar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="relative">
          <div className={`absolute top-0 left-0 w-full h-72 ${bgClass} overflow-hidden z-0`}></div>
          <div className="relative z-10 pt-4">
            <Navbar />
            <div className="px-8 py-12">{children}</div>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-xs py-4">
        © 2025 Sistem Informasi Manajemen Praktikum
      </footer>
    </div>
  );
};

export default Layout;
