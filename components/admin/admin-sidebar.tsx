"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Folder,
  MessageSquare,
  Briefcase,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/sidebar";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: Folder },
  { title: "Experience", href: "/admin/experiences", icon: Briefcase },
  { title: "Technologies", href: "/admin/technologies", icon: Layers },
  { title: "Messages", href: "/admin/messages", icon: MessageSquare },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50 h-16 justify-center items-center">
          <Logo width={40} height={40}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
