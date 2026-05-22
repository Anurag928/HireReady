"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Palette, User, MonitorSmartphone } from "lucide-react";
import { slideUp, staggerContainer } from "@/animations";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
        <p className="text-foreground/60">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Nav (Desktop) */}
        <div className="hidden md:block col-span-1 space-y-2">
          {[
            { icon: User, label: "Account", active: true },
            { icon: Palette, label: "Appearance", active: false },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Privacy & Security", active: false }
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                item.active 
                  ? "bg-card border border-border font-medium shadow-sm" 
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground border border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Appearance Section */}
          <motion.section variants={slideUp} className="p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent-blue" /> Appearance
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4 text-foreground/80">Theme Preference</label>
                {mounted && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: User },
                      { value: 'dark', label: 'Dark', icon: User },
                      { value: 'system', label: 'System', icon: MonitorSmartphone }
                    ].map(t => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          theme === t.value 
                            ? 'border-accent-blue bg-accent-blue/10 text-accent-blue' 
                            : 'border-border bg-background hover:border-accent-blue/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-foreground/10 mb-2" />
                        <span className="font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Notifications Section */}
          <motion.section variants={slideUp} className="p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent-purple" /> Notifications
            </h3>
            
            <div className="space-y-4">
              {[
                { title: "Weekly Progress Reports", desc: "Receive an email summary of your learning progress." },
                { title: "Interview Reminders", desc: "Get notified 24 hours before a scheduled mock interview." },
                { title: "AI Recommendations", desc: "Alerts when our AI discovers new roles matching your profile." }
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{setting.title}</h4>
                    <p className="text-sm text-foreground/60">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section variants={slideUp} className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-xl font-bold mb-2 text-red-500 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-foreground/60 text-sm mb-6">Irreversible and destructive actions.</p>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/30 bg-background/50">
              <div>
                <h4 className="font-medium text-foreground">Delete Account</h4>
                <p className="text-sm text-foreground/60">Permanently delete your account and all data.</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
