"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Praktikum } from "@/types/praktikum";
import Link from "next/link";
import FormModalAddPracticum from "./FormModalAddPracticum";
import { signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

// Type definitions
interface HeaderProps {
  selectedLab: string | null;
}

interface MainContentProps {
  praktikum: Praktikum[];
}

interface PraktikumListProps {
  praktikum: Praktikum[];
  selectedLab: string;
}

// Header component
const Header = ({ selectedLab }: HeaderProps) => {
  const session = useSession();
  const router = useRouter();

  const handleProfileClick = (): void => {
    router.push("/profile");
  };

  const handleSignOut = (): void => {
    signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <div className="flex justify-between items-center shadow-md border-b border-gray-300 pb-4 px-4 sm:px-6 md:px-10 lg:px-14 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {selectedLab || "Dashboard"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Sistem Informasi Manajemen Praktikum
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200">
          <Image 
            src="/profile-dummy.png" 
            alt="Profile" 
            fill
            className="rounded-full object-cover" 
          />
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
            <FaUser size={8} className="sm:hidden" />
            <FaUser size={10} className="hidden sm:block" />
          </div>
        </div>
        <Popover>
          <PopoverTrigger className="text-sm sm:text-base">
            {session.data?.user?.name || "User"}
          </PopoverTrigger>
          <PopoverContent className="w-48 sm:w-56 mt-4">
            <div className="flex flex-col gap-2 p-1 bg-white">
              <Button
                className="w-full"
                onClick={handleProfileClick}
              >
                Profile
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleSignOut}
              >
                Keluar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

// Main content component
const MainContent = ({ praktikum }: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 md:p-10 lg:p-14">
      {praktikum.length > 0 &&
        praktikum.map((module: Praktikum, index: number) => (
          <Link
            key={`praktikum-${module.id_praktikum || index}`}
            href={`/praktikum/${module.id_praktikum}/presensi`}
          >
            <Card className="w-full overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-24 sm:h-28">
                <Image
                  src="https://images.unsplash.com/photo-1553273883-a8938f89f492?q=80&w=2108&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={`Praktikum ${module.name}`}
                  fill
                  className="object-cover rounded-t-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 rounded-t-md" />
              </div>
              <CardContent>
                <h2 className="text-base font-semibold text-gray-800 mb-1 -mt-2 line-clamp-2">
                  {module.name}
                </h2>
                <p className="text-gray-500 text-xs pb-6">
                  {module.modul || "No module description"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      <div className="col-span-1">
        <FormModalAddPracticum />
      </div>
    </div>
  );
};

// Main component
function PraktikumList({ praktikum, selectedLab }: PraktikumListProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header selectedLab={selectedLab} />
      <MainContent praktikum={praktikum} />
    </div>
  );
}

export default PraktikumList;