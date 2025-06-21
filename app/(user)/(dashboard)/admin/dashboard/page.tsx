"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut, Users, FileText } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  console.log("🚀 ~ AdminDashboard ~ session:", session)

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  // Card click handlers
  const handleManageUsers = () => {
    router.push("/admin/users")
  }

  const handleManagePraktikum = () => {
    router.push("/admin/praktikum")
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali, Admin 👋</p>
          </div>
          
          <div className="flex items-center gap-4">
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
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 flex flex-col items-start text-left ">
                  {session?.user?.name || "User"}
                  <br />
                  {session?.user?.nim || "User"}

                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-4">
                <div className="flex flex-col gap-2 p-1 bg-white">
                  <Button
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      router.push("/profile")
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
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Menu Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Manajemen User"
            description="Kelola data user seperti menambah dan mengedit akun pengguna."
            icon={<Users className="w-6 h-6 text-blue-500" />}
            bgColor="bg-blue-100"
            onClick={handleManageUsers}
          />

          <Card
            title="Manajemen Praktikum"
            description="Kelola data praktikum seperti menambah dan mengedit praktikum."
            icon={<FileText className="w-6 h-6 text-green-500" />}
            bgColor="bg-green-100"
            onClick={handleManagePraktikum}
          />
        </section>
      </div>
    </main>
  )
}

function Card({
  title,
  description,
  icon,
  bgColor,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  bgColor: string
  onClick?: () => void
}) {
  return (
    <div
      className={`p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 ${bgColor} cursor-pointer hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white rounded-full shadow">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  )
}