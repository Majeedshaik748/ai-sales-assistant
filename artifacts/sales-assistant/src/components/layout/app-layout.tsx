import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Megaphone, Mail, Zap } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Prospects", href: "/prospects", icon: Users },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "Emails", href: "/emails", icon: Mail },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans">
        <Sidebar variant="sidebar" collapsible="none" className="w-64 border-r border-border bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex h-16 items-center flex-row gap-2 border-b border-border/10">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Zap size={18} />
            </div>
            <span className="font-serif font-bold tracking-tight text-lg">SalesAI</span>
          </SidebarHeader>
          <SidebarContent className="p-2 py-4">
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`mb-1 font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md">
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex-1 overflow-auto bg-muted/30">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
