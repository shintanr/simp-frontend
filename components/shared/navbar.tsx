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
  const session = useSession();
  return (
    <header className="flex justify-between  shadow-xl items-center px-8 py-4 text-white">
      <h1 className="text-xl font-bold"></h1>
      <nav className="flex items-center space-x-6">
        <Link href="/" className="flex items-center gap-1">
          🖥️ Praktikum
        </Link>
         <Link
          href={`/praktikum/${praktikumId}/presensi`}
          className={cn(
            "flex items-center gap-1",
            pathname == `/praktikum/${praktikumId}/presensi` &&
              "font-semibold border-b-2 border-yellow-400"
          )}
        >
          📝 Presensi
        </Link>
        <Link
          href={`/praktikum/${praktikumId}/penilaian`}
          className={cn(
            "flex items-center gap-1",
            pathname == `/praktikum/${praktikumId}/penilaian` &&
              "font-semibold border-b-2 border-yellow-300"
          )}
        >
          📊 Penilaian
        </Link>
            <Link
              href={`/praktikum/${praktikumId}/modul`}
              className={cn(
                "flex items-center gap-1",
                pathname === `/praktikum/${praktikumId}/modul` &&
                  "font-semibold border-b-2 border-yellow-400"
              )}
            >
              📘 Modul
            </Link>
        
        <Link
            href={`/tugas-pendahuluan`}
            className={cn(
              "flex items-center gap-1",
              pathname === `/praktikum/${praktikumId}/submission` &&
                "font-semibold border-b-2 border-yellow-400"
            )}
          >
             📄 Tugas Pendahuluan
          </Link>
        <Link
            href={`/submission`}
            className={cn(
              "flex items-center gap-1",
              pathname === `/praktikum/${praktikumId}/submission` &&
                "font-semibold border-b-2 border-yellow-400"
            )}
          >
            📥 Submission
          </Link>
         
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
            <PopoverTrigger>{session.data?.user?.name}</PopoverTrigger>
            <PopoverContent className="w-56 mt-4">
              <div className="flex flex-col gap-2 p-1 bg-white">
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </Button>
                <Button
                  className="w-full"
                  variant={"outline"}
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
