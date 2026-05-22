"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Map, Video, User, Settings, LogOut, Bot, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { onboardingService } from "@/services/onboardingService";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, dbUser, authInitialized } = useAuth();

  useEffect(() => {
    if (authInitialized && (!user || !dbUser)) {
      router.replace("/login");
    } else if (authInitialized && dbUser && !dbUser.onboarding_completed) {
      router.replace("/onboarding");
    }
  }, [authInitialized, user, dbUser, router]);

  if (!authInitialized || !user || !dbUser || !dbUser.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full"
          />
          <p className="text-foreground/60 font-medium animate-pulse">Initializing CareerPilot AI...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", href: "/resume", icon: FileText },
    { name: "Career Roadmap", href: "/roadmap", icon: Map },
    { name: "Mock Interviews", href: "/mock-interview", icon: Video },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-accent-blue/10 p-1.5 rounded-lg group-hover:bg-accent-blue/20 transition-colors">
              <Bot className="w-5 h-5 text-accent-blue" />
            </div>
            <span className="font-bold tracking-tight">
              CareerPilot <span className="text-accent-blue">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? "bg-accent-blue/10 text-accent-blue font-medium"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold md:hidden">CareerPilot AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-foreground/5 transition-colors">
              <Bell className="w-5 h-5 text-foreground/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </button>
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center border border-accent-purple/50">
              <span className="text-sm font-medium text-accent-purple">
                {user?.displayName ? user.displayName.charAt(0) : "U"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-2 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-blue/5 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
