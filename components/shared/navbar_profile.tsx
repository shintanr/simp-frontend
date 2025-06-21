"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const praktikumId = params.id;
  const { data: session } = useSession();

  // Function to handle praktikum navigation based on role
  const handlePraktikumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <header className="flex justify-between shadow-xl items-center px-8 py-4 text-white">
      <h1 className="text-xl font-bold"></h1>
      <nav className="flex items-center space-x-6">
        <button 
          onClick={handlePraktikumClick}
          className="flex items-center gap-1 hover:text-gray-200 transition-colors"
        >
          🖥️ {session?.user?.role === "admin" ? "Dashboard" : "Praktikum"}
        </button>
        
        <div className="flex items-center gap-2 ml-6">
          <div className="relative w-10 h-10 rounded-full bg-gray-200">
            <Image 
              src="/profile-dummy.png" 
              alt="Profile" 
              width={40} 
              height={40} 
              className="rounded-full" 
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-gray-200 ">
                {session?.user?.name || "User"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 mt-4">
              <div className="flex flex-col gap-2 p-1 bg-white">
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                >
                  Keluar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  );
}