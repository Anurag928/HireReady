"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import { deleteUserAccount } from "@/api";
import { 
  User, Palette, Bell, Shield, MonitorSmartphone, LogOut, 
  Trash2, AlertTriangle, Monitor, Smartphone, Moon, Sun, Monitor as MonitorIcon, Check, Loader2, Mail, Calendar, Key, CheckCircle2
} from "lucide-react";
import { slideUp, staggerContainer } from "@/animations";

export default function SettingsPage() {
  const { user, dbUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State for Settings Toggles
  const [notifications, setNotifications] = useState({
    weeklyReports: true,
    interviewReminders: true,
    aiRecommendations: false,
    roadmapUpdates: true,
    resumeAlerts: false,
    featureAnnouncements: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
  ];

  const handleSignOut = async () => {
    // Show toast for a moment, then logout which hard redirects
    setToastMessage("Successfully signed out. Redirecting...");
    setTimeout(() => {
      logout();
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE MY ACCOUNT" || !user?.uid) return;
    
    setIsDeleting(true);
    try {
      await deleteUserAccount(user.uid);
      setToastMessage("Account deleted. Redirecting...");
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
      alert("An error occurred while deleting your account. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[85vh] w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 pb-24">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shadow-lg backdrop-blur-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-[100]" 
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#050816] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Deleting your account permanently removes your <strong className="text-foreground">Profile, Resume History, Roadmaps, Mock Interviews, and Analytics</strong>. This action cannot be undone.
                </p>

                <div className="w-full bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Type to confirm</p>
                  <input 
                    type="text" 
                    placeholder="DELETE MY ACCOUNT"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmationText !== "DELETE MY ACCOUNT" || isDeleting}
                    className="w-full px-6 py-4 rounded-xl font-bold bg-red-500 text-white disabled:bg-red-500/30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Deleting Data...</>
                    ) : (
                      <><Trash2 className="w-5 h-5" /> Permanently Delete Account</>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="w-full px-6 py-4 rounded-xl font-bold bg-transparent text-muted-foreground hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* LEFT NAVIGATION (Desktop Sidebar / Mobile Horizontal Tabs) */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        
        {/* Page Title (Desktop only) */}
        <div className="hidden md:block mb-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your experience</p>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden overflow-x-auto custom-scrollbar pb-2 -mx-4 px-4">
          <div className="flex gap-2 w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-foreground text-background shadow-md" 
                      : "bg-card/40 border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left ${
                  isActive 
                    ? "bg-background shadow-sm border border-border text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "text-accent-blue" : "opacity-70"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>


      {/* RIGHT CONTENT PANEL */}
      <div className="flex-1 flex flex-col gap-8 w-full min-w-0">
        
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-[2rem] p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-foreground">{user?.email?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{dbUser?.name || user?.displayName || "Anonymous User"}</h2>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Mail className="w-4 h-4" /> {user?.email}
              </div>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-black uppercase tracking-wider w-max">
                {dbUser?.target_role || "Career Seeker"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 relative z-10 bg-card/50 p-4 rounded-2xl border border-border w-full md:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Strength</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[84%]" />
              </div>
              <span className="text-xl font-black text-foreground">84%</span>
            </div>
          </div>
        </motion.div>


        {/* Dynamic Content Sections */}
        <AnimatePresence mode="wait">
          
          {/* ================================= ACCOUNT SECTION ================================= */}
          {activeTab === "account" && (
            <motion.section key="account" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-md">
                <h3 className="text-xl font-black mb-6 text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-accent-blue" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Full Name</label>
                    <div className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground">{dbUser?.name || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Email Address</label>
                    <div className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground">{user?.email || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Target Role</label>
                    <div className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground">{dbUser?.target_role || "Not specified"}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Career Track</label>
                    <div className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground">Technology</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 pt-6 border-t border-border">
                  <button className="px-6 py-3 rounded-xl font-bold bg-foreground text-background hover:opacity-90 transition-opacity w-full md:w-auto text-center">
                    Edit Profile Details
                  </button>
                  <button className="px-6 py-3 rounded-xl font-bold bg-transparent border border-border text-foreground hover:bg-muted transition-colors w-full md:w-auto text-center">
                    View Public Profile
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================= APPEARANCE SECTION ================================= */}
          {activeTab === "appearance" && (
            <motion.section key="appearance" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-md">
                <h3 className="text-xl font-black mb-2 text-foreground flex items-center gap-2">
                  <Palette className="w-5 h-5 text-accent-purple" /> Interface Theme
                </h3>
                <p className="text-sm text-muted-foreground mb-8">Customize the look and feel of your workspace. Changes apply instantly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean and bright.' },
                    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes.' },
                    { id: 'system', label: 'System Sync', icon: MonitorIcon, desc: 'Follows OS preference.' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`relative group p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 overflow-hidden ${
                        theme === t.id 
                          ? 'border-accent-purple bg-accent-purple/10 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                          : 'border-border bg-card hover:border-accent-purple/50 hover:bg-accent-purple/5'
                      }`}
                    >
                      {theme === t.id && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-accent-purple rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`p-4 rounded-full transition-colors ${theme === t.id ? 'bg-accent-purple text-white' : 'bg-muted text-foreground group-hover:bg-accent-purple/20 group-hover:text-accent-purple'}`}>
                        <t.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="font-black text-foreground block">{t.label}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold mt-1 block">{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </motion.section>
          )}

          {/* ================================= NOTIFICATIONS ================================= */}
          {activeTab === "notifications" && (
            <motion.section key="notifications" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-md">
                <h3 className="text-xl font-black mb-2 text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-500" /> Communication Preferences
                </h3>
                <p className="text-sm text-muted-foreground mb-8">Control what updates you receive from HireReady.</p>
                
                <div className="space-y-2">
                  {[
                    { key: "weeklyReports", title: "Weekly Progress Reports", desc: "Receive an email summary of your learning progress." },
                    { key: "interviewReminders", title: "Interview Reminders", desc: "Get notified 24 hours before a scheduled mock interview." },
                    { key: "aiRecommendations", title: "AI Recommendations", desc: "Alerts when our AI discovers new roles matching your profile." },
                    { key: "roadmapUpdates", title: "Roadmap Updates", desc: "Notifications when your dynamic roadmap adjusts to market changes." },
                    { key: "resumeAlerts", title: "Resume Analysis Alerts", desc: "Updates on your ATS scoring improvements." },
                    { key: "featureAnnouncements", title: "New Feature Announcements", desc: "Stay informed about platform updates." }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-card border border-border hover:border-border/80 transition-colors">
                      <div className="pr-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">{setting.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{setting.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [setting.key]: !prev[setting.key as keyof typeof notifications] }))}
                        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${notifications[setting.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-muted'}`}
                      >
                        <motion.div 
                          initial={false}
                          animate={{ x: notifications[setting.key as keyof typeof notifications] ? 24 : 2 }}
                          className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                  <button className="px-6 py-3 rounded-xl font-bold bg-foreground text-background hover:scale-105 transition-all shadow-lg w-full md:w-auto">
                    Save Preferences
                  </button>
                </div>
              </div>

            </motion.section>
          )}

          {/* ================================= PRIVACY & SECURITY ================================= */}
          {activeTab === "privacy" && (
            <motion.section key="privacy" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-md">
                <h3 className="text-xl font-black mb-6 text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" /> Security Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Key className="w-6 h-6" /></div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Email Verification</span>
                      <span className="text-sm font-black text-foreground flex items-center gap-1.5">Verified <CheckCircle2 className="w-4 h-4 text-emerald-500" /></span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-zinc-500/10 text-zinc-500"><Calendar className="w-6 h-6" /></div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Account Created</span>
                      <span className="text-sm font-black text-foreground">{dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2 shadow-sm border border-black/5">
                        <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Google</h4>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border border-dashed">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center p-2 shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">GitHub</h4>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted text-[10px] font-black uppercase tracking-wider transition-colors">
                      Connect
                    </button>
                  </div>
                </div>
              </div>

            </motion.section>
          )}

          {/* ================================= ACTIVE SESSIONS & DANGER ZONE ================================= */}
          {activeTab === "sessions" && (
            <motion.section key="sessions" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 bg-white/[0.85] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-md">
                <h3 className="text-xl font-black mb-6 text-foreground flex items-center gap-2">
                  <MonitorSmartphone className="w-5 h-5 text-accent-blue" /> Active Sessions
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-accent-blue/5 border border-accent-blue/20">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-accent-blue/10 text-accent-blue"><Monitor className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm flex items-center gap-2">Chrome - Windows <span className="px-2 py-0.5 rounded-md bg-accent-blue text-white text-[9px] uppercase tracking-widest">Current</span></h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Last active: Just now • IP: 192.168.1.1</p>
                      </div>
                    </div>
                  </div>
                  

                </div>

                <div className="flex flex-col md:flex-row gap-4 border-t border-border pt-6">
                  <button className="px-6 py-3 rounded-xl font-bold bg-transparent border border-border text-foreground hover:bg-muted transition-colors w-full md:w-auto">
                    Sign Out Other Devices
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="px-6 py-3 rounded-xl font-bold bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full md:w-auto"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="rounded-3xl p-6 md:p-8 bg-red-500/5 border border-red-500/20 shadow-md">
                <h3 className="text-xl font-black mb-2 text-red-500 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-foreground/70 mb-6">Irreversible and destructive actions.</p>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border border-red-500/30 bg-background/50">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm mb-1">Permanently Delete Account</h4>
                    <p className="text-xs text-foreground/60 leading-relaxed max-w-lg">
                      Once you delete your account, there is no going back. Please be certain.
                      All your roadmaps, resumes, mock interview scores, and settings will be permanently erased.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="shrink-0 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all w-full md:w-auto flex items-center justify-center gap-2 shadow-sm border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </div>

            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
