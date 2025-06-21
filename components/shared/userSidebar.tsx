"use client";

import {
  ChevronDown,
  LucideProps,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import SelectLabDropdown from "./selectLabDropdown";


interface MenuItem {
  title: string;
  url: string;
  icon: string | ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  activeUrl: string[];
  subMenu?: {
    title: string;
    url: string;
    icon: string | ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    activeUrl: string[];
  }[];
}

// Menu items dengan emoji icons
const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: "🖥️", // Desktop computer
    activeUrl: ["/admin/dashboard"],
  },
  {
    title: "Manajemen Pengguna",
    url: "/admin/users",
    icon: "👥", // Users
    activeUrl: ["/admin/users", "/admin/users/create"],
  },
  {
    title: "Manajemen Praktikum",
    url: "/admin/praktikum",
    icon: "🏠", // Home
    activeUrl: ["/admin/praktikum"],
  },
  {
    title: "Praktikum",
    url: "/",
    icon: "💻", // Laptop
    activeUrl: ["/"],
  },
  {
    title: "Submission",
    url: "/submission",
    icon: "📤", // Upload
    activeUrl: ["/submission"],
  },
  {
    title: "Tugas Pendahuluan",
    url: "/tugas-pendahuluan",
    icon: "📄", // Chart
    activeUrl: ["/tugas_pendahuluan"],
  },
];

const UserSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const activeMenus = items
      .filter(
        (item) =>
          item.subMenu &&
          item.subMenu.some((sub) => pathname.startsWith(sub.url))
      )
      .map((item) => item.title);

    setOpenItems(activeMenus);
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const filteredItems =
    session?.user?.role === "admin"
      ? items.filter(
          (item) =>
            item.title === "Manajemen Praktikum" ||
            item.title === "Manajemen Pengguna" ||
            item.title === "Dashboard" ||
            item.title === "Manajemen Modul"
        )
      : items.filter(
          (item) =>
            item.title !== "Manajemen Praktikum" &&
            item.title !== "Manajemen Pengguna" &&
            item.title !== "Dashboard" &&
            item.title !== "Manajemen Modul"
        );

  if (!session) {
    return (
      <div className="w-64 h-screen bg-white p-6 flex flex-col gap-4 animate-pulse">
        <div className="h-12 w-12 bg-muted-foreground/30 rounded-full mb-4" />
        <div className="h-8 bg-muted-foreground/20 rounded-md" />
        <div className="h-8 bg-muted-foreground/20 rounded-md" />
        <div className="h-8 bg-muted-foreground/20 rounded-md" />
        <div className="mt-auto h-10 bg-muted-foreground/30 rounded-md" />
      </div>
    );
  }

  const renderIcon = (icon: string | ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) => {
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    } else {
      const IconComponent = icon;
      return <IconComponent />;
    }
  };

  return (
    <Sidebar className="bg-white">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-28 p-4 flex flex-col items-center justify-center text-white">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h1 className="text-2xl font-bold">SIMP</h1>
            </div>
            <h5 className="mt-1">SI Manajemen Praktikum</h5>
          </SidebarGroupLabel>

          <SidebarGroupContent className="p-4">
            {!pathname.startsWith("/admin") &&
              session.user.role !== "admin" && (
                <div className="">
                  <h5 className="text-sm text-yellow-300">Pilih Laboratorium</h5>
                  <SelectLabDropdown />
                </div>
              )}
            <h1 className="border-b border-b-blue-400 mt-4"></h1>
            <SidebarMenu className="py-6">
              {filteredItems.map((item) => {
                const isActive = item.activeUrl.some(
                  (url) => typeof url === "string" && pathname.startsWith(url)
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.subMenu?.length ? (
                      <Collapsible
                        open={openItems.includes(item.title)}
                        onOpenChange={() => toggleMenu(item.title)}
                        className="group/collapsible"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {renderIcon(item.icon)}
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subMenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <a href={subItem.url}>
                                    {renderIcon(subItem.icon)}
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={item.url}>
                          {renderIcon(item.icon)}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="bg-white hover:bg-red-600 text-red-700 hover:text-white"
          onClick={() => {
            signOut({
              callbackUrl: "/login",
            });
          }}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;