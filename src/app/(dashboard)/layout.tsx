"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  Video, 
  User, 
  Settings, 
  LogOut, 
  Bot, 
  Bell,
  Search,
  Zap,
  Cpu
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { IntelligenceHistoryPanel } from "@/app/(dashboard)/resume/components/IntelligenceHistoryPanel";
import { BrainCircuit } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, dbUser, authInitialized } = useAuth();
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  useEffect(() => {
    if (authInitialized) {
      // Temporarily disabled for demonstration
    }
  }, [authInitialized, user, dbUser, router, pathname]);

  const isDemo = true;
  if (!authInitialized && !isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 animate-pulse" />
             <Bot className="w-16 h-16 text-blue-500 relative z-10" />
          </div>
          <div className="space-y-2 text-center">
             <h2 className="text-xl font-black uppercase tracking-[0.4em] text-foreground">Initializing</h2>
             <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">Connecting to neural core...</p>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", href: "/resume", icon: FileText, badge: "AI" },
    { name: "AI Roadmap", href: "/roadmap", icon: Map },
    { name: "AI Mock Interview", href: "/mock-interview", icon: Video },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#050816] text-zinc-900 dark:text-white selection:bg-blue-500/30 overflow-hidden transition-colors duration-300">
      
      {/* 🏛️ ADAPTIVE SIDEBAR */}
      <aside className="w-72 border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#0b1220]/80 flex flex-col hidden lg:flex relative z-50 shadow-[20px_0_50px_rgba(0,0,0,0.02)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300">
        
        {/* Logo Hub */}
        <div className="h-24 flex items-center px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity" />
              <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-500 relative z-10" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black uppercase tracking-[0.3em] leading-none text-zinc-900 dark:text-white">CareerPilot</span>
               <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mt-1">Intelligence OS</span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Visual only) */}
        <div className="px-6 mb-8">
           <div className="relative group">
              <div className="absolute inset-0 bg-black/[0.03] dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 transition-all group-hover:border-black/20 dark:group-hover:border-white/20" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
              <input 
                 readOnly 
                 placeholder="Search command..." 
                 className="w-full bg-transparent pl-11 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
              />
           </div>
        </div>

        {/* Navigation Grid */}
        <nav className="flex-1 px-4 space-y-1 overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-blue-50 dark:bg-cyan-500/20 shadow-sm dark:shadow-none border border-blue-200 dark:border-cyan-400/30"
                    : "hover:bg-black/[0.04] dark:hover:bg-white/5 border border-transparent"
                  }`}
              >
                {isActive && (
                   <motion.div 
                     layoutId="navGlow"
                     className="absolute inset-0 bg-gradient-to-r from-blue-500/10 dark:from-blue-500/5 to-transparent rounded-2xl opacity-100"
                   />
                )}
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-blue-600 text-white dark:bg-cyan-500 dark:text-black" : "bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:bg-black/10 dark:group-hover:bg-white/20"}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? "text-blue-700 dark:text-cyan-300" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1"}`}>
                    {item.name}
                  </span>
                </div>

                {item.badge && (
                   <div className={`relative z-10 px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${isActive ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-300 dark:border-cyan-400/30' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400'}`}>
                      {item.badge}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Hub (Bottom) */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 space-y-3">
          <Link 
            href="/profile"
            className="flex items-center gap-3 px-2 hover:bg-black/5 dark:hover:bg-white/5 py-1.5 rounded-2xl transition-all"
          >
             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-black border border-black/10 dark:border-white/10 overflow-hidden p-0.5">
                <div className="w-full h-full rounded-lg bg-white dark:bg-black flex items-center justify-center font-black text-[10px] text-zinc-900 dark:text-white uppercase">
                   {dbUser?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-widest truncate text-zinc-900 dark:text-white">{dbUser?.name || "Access Granted"}</div>
                <div className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest truncate">View Profile</div>
             </div>
          </Link>
          
          <button
            onClick={logout}
            className="group flex items-center gap-3 px-4 py-2.5 w-full rounded-2xl text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          >
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 group-hover:bg-rose-500 group-hover:text-white transition-all">
               <LogOut className="w-3 h-3" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f8fafc] dark:bg-transparent">
        
        {/* Dynamic Header Hub */}
        <header className="h-20 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-3xl flex items-center justify-between px-10 z-50 transition-colors duration-300 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 lg:hidden">
               <Bot className="w-6 h-6 text-blue-600 dark:text-blue-500" />
               <span className="text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-white">CareerPilot <span className="text-blue-600 dark:text-blue-500">AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-zinc-500 dark:text-white/40 font-black uppercase tracking-widest text-[10px]">
               <span className="text-blue-600 dark:text-blue-500">System</span> 
               <span>/</span> 
               <span className="text-zinc-900 dark:text-white">{pathname.split('/').pop() || 'Terminal'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
             {pathname === "/resume" && (
                <button
                   onClick={() => setIsHistoryOpen(true)}
                   className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/[0.06] border border-black/10 dark:border-white/10 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)] transition-all active:scale-95"
                >
                   <BrainCircuit className="w-4 h-4 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                   <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300">Intelligence History</span>
                </button>
             )}
             <div className="flex items-center gap-4">
                <button className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                   <Bell className="w-4 h-4" />
                   <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full border-2 border-white dark:border-black" />
                </button>
                <ThemeToggle />
             </div>
          </div>
        </header>

        {/* Intelligence History Drawer */}
        <IntelligenceHistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

        {/* The Stage */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Global Ambient Glow - Adaptive */}
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/[0.02] dark:bg-blue-500/5 blur-[200px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-500/[0.02] dark:bg-purple-500/5 blur-[200px] pointer-events-none" />
          
          <div className="p-8 lg:p-12 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
