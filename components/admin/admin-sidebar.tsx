"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  ClipboardList,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  CreditCard,
  ExternalLink,
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { getAdminInfo } from "@/lib/actions/admin";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pipeline", href: "/admin/pipeline", icon: Kanban },
    ],
  },
  {
    label: "Data",
    items: [
      { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
      { label: "Bookings", href: "/admin/bookings", icon: Calendar },
      { label: "Sessions", href: "/admin/sessions", icon: MessageSquare },
      { label: "Outlines", href: "/admin/outlines", icon: FileText },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Pricing", href: "/admin/pricing", icon: CreditCard },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [info, setInfo] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    getAdminInfo().then(setInfo);
  }, []);

  const userEmail = info?.email ?? "";
  const role = info?.role ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
          <p className="font-inter-tight text-sm font-semibold text-foreground">
            MVP Gurus
          </p>
          <p className="truncate text-xs text-muted-secondary">{userEmail}</p>
          <Badge
            className={`mt-1 w-fit text-[10px] ${
              role === "super_admin"
                ? "bg-surface-light-purple text-accent-purple border-accent-purple/20"
                : "bg-surface-warm text-primary border-primary/20"
            }`}
          >
            {role.replace("_", " ")}
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={
                          isActive
                            ? "bg-surface-light-purple text-accent-purple hover:bg-surface-light-purple hover:text-accent-purple"
                            : "text-muted-secondary hover:bg-surface-gray hover:text-foreground"
                        }
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-secondary hover:text-foreground transition-colors group-data-[collapsible=icon]:justify-center"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="group-data-[collapsible=icon]:hidden">
            Back to site
          </span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
