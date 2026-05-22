import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Megaphone, Mail, Zap, Bot, MessageSquare, Menu, X, Linkedin, Github } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Prospects", href: "/prospects", icon: Users },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "Emails", href: "/emails", icon: Mail },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ];

  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/prospects")) return "Prospects";
    if (location.startsWith("/campaigns")) return "Campaigns";
    if (location.startsWith("/emails")) return "Emails";
    if (location.startsWith("/ai-assistant")) return "AI Assistant";
    if (location.startsWith("/contact")) return "Contact";
    return "";
  };

  const SidebarContent = () => (
    <>
      <div className="flex flex-col h-full bg-[#080a14] border-r border-white/[0.06] text-zinc-400 w-64 pt-6 pb-4">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 glow-violet">
            <Zap size={20} />
          </div>
          <div>
            <div className="font-semibold text-white tracking-tight text-lg leading-tight">SalesAI</div>
            <div className="text-zinc-500 text-xs">AI Outreach</div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary border-l-2 border-primary glow-violet shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]' : 'border-l-2 border-transparent hover:translate-x-1 hover:text-white hover:bg-white/[0.02]'}`}>
                <item.icon size={18} className={`${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-white'} transition-colors`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 mt-auto">
          <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full glass hover:bg-white/[0.08] transition-colors text-zinc-400 hover:text-white">
            <Linkedin size={18} />
          </a>
          <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full glass hover:bg-white/[0.08] transition-colors text-zinc-400 hover:text-white">
            <Github size={18} />
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] w-full bg-background font-sans text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 z-20">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-64 max-w-sm flex-col bg-[#080a14] transform transition-transform duration-300">
            <SidebarContent />
            <button className="absolute right-[-48px] top-4 flex h-10 w-10 items-center justify-center rounded-full glass text-white" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 glass border-b border-white/[0.06] z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-light text-xl tracking-tight text-white/90">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary glow-violet">
              <Bot size={16} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
          <div className="relative animate-fade-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
