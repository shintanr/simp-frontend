"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState("Sistem Tertanam & Robotika");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest("#dropdownContainer")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col justify-between p-4">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-6 mt-8">
        <Image src="https://ugc.production.linktr.ee/wDJz56aeTbK1fX6Xhr8t_CSagowYHYDXjdslc" alt="Logo" width={80} height={80} />
      </div>

      <div>
        {/* Dropdown Laboratorium */}
        <div className="relative mb-4" id="dropdownContainer">
          <button
            id="dropdownBtn"
            className="w-full flex justify-between items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{selectedLab}</span>
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <ul className="absolute mt-2 w-full bg-white shadow-md rounded-lg overflow-hidden">
              {["Sistem Tertanam & Robotika", "Rekayasa Perangkat Lunak", "Jaringan Komputer", "Multimedia"].map((lab) => (
                <li
                  key={lab}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedLab(lab);
                    setDropdownOpen(false);
                  }}
                >
                  {lab}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {[
            { href: "#", img: "/Praktikum.svg", label: "Praktikum" },
            { href: "#", img: "/calendar.svg", label: "Jadwal Praktikum" },
            { href: "#", img: "/presensi.svg", label: "Presensi" },
            { href: "#", img: "/submission.svg", label: "Submission" },
            { href: "#", img: "/penilaian.svg", label: "Penilaian" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
              <Image src={item.img} alt={item.label} width={20} height={20} className="mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Account Setting & Logout */}
      <div className="mt-10">
        <Link href="#" className="flex items-center text-gray-600 px-4 py-2 hover:bg-gray-200 rounded-lg">
          <Image src="/account.svg" alt="Account Setting" width={20} height={20} className="mr-2" />
          Account Setting
        </Link>
        <Link href="#" className="flex items-center text-gray-600 px-4 py-2 hover:bg-gray-200 rounded-lg">
          <Image src="/logout.svg" alt="Logout" width={20} height={20} className="mr-2" />
          Log out
        </Link>
      </div>
    </aside>
  );
}
