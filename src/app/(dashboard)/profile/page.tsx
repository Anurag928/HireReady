"use client";

import { motion } from "framer-motion";
import { User, Award, BookOpen, Star, Briefcase } from "lucide-react";
import { slideUp, staggerContainer } from "@/animations";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Profile</h2>
        <p className="text-foreground/60">Manage your public profile and track achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <motion.div variants={slideUp} className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-accent-blue/10 border-4 border-background flex items-center justify-center mb-4 relative overflow-hidden shadow-xl">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-accent-blue" />
              )}
            </div>
            <h3 className="text-xl font-bold">{user?.displayName || "John Doe"}</h3>
            <p className="text-foreground/60 text-sm mb-4">{user?.email || "john.doe@example.com"}</p>
            
            <div className="w-full flex justify-between px-4 py-3 bg-background rounded-xl border border-border">
              <div className="text-center">
                <span className="block text-lg font-bold text-accent-blue">12</span>
                <span className="text-xs text-foreground/60 uppercase tracking-wider">Interviews</span>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <span className="block text-lg font-bold text-accent-purple">89</span>
                <span className="text-xs text-foreground/60 uppercase tracking-wider">Avg Score</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-purple" /> Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Top 5% Performer", "React Master", "7-Day Streak"].map((badge, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-medium border border-accent-purple/20 flex items-center gap-1.5">
                  <Star className="w-3 h-3" fill="currentColor" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div variants={slideUp} className="md:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-card border border-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent-blue" /> Career Goals
              </h3>
              <button className="text-sm text-accent-blue hover:underline">Edit</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="block text-sm text-foreground/60 mb-1">Target Role</span>
                  <span className="font-semibold">Frontend Developer</span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="block text-sm text-foreground/60 mb-1">Experience Level</span>
                  <span className="font-semibold">Mid-Level (2-4 Yrs)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" /> Skills Matrix
              </h3>
              <button className="text-sm text-accent-blue hover:underline">Edit</button>
            </div>
            
            <div className="space-y-6">
              {[
                { name: "React", level: 90 },
                { name: "TypeScript", level: 80 },
                { name: "Next.js", level: 75 },
                { name: "System Design", level: 60 }
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-foreground/60">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent-blue to-accent-purple" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
