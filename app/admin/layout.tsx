import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-white/80 backdrop-blur px-6">
          <SidebarTrigger className="-ml-2 text-muted-secondary hover:text-foreground" />
        </header>
        <main className="bg-surface-gray p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
