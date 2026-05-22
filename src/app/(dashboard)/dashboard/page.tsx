"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import {
  Sparkles, TrendingUp, Target, BookOpen, Clock, FileText,
  Code, Map as MapIcon, Briefcase, Activity, CheckCircle2, ChevronRight, Zap
} from "lucide-react";
import { slideUp, staggerContainer, fadeIn } from "@/animations";
import { useAuth } from "@/contexts/auth-context";
import { onboardingService } from "@/services/onboardingService";
import { UserProfile } from "@/types/user";

// --- Mock / Dynamic Data Handlers ---

const activityFeed = [
  { title: "Completed onboarding profile", time: "2 hours ago", active: true },
  { title: "Target career set", time: "2 hours ago", active: true },
  { title: "Resume analysis pending", time: "In Progress", active: false },
  { title: "AI Skill Gap Analysis", time: "Coming Soon", active: false },
];

const quickActions = [
  { title: "Resume Analyzer", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "AI Mock Interview", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "GitHub Analyzer", icon: Code, color: "text-gray-400", bg: "bg-gray-500/10" },
  { title: "AI Roadmap", icon: MapIcon, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Skill Gap Analysis", icon: Target, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Placement Tracker", icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      onboardingService.getProfile(user.uid).then(p => {
        setProfile(p);
        setLoading(false);
      });
    }
  }, [user]);

  // Derived Dynamic Data
  const displayName = profile?.name || user?.displayName?.split(" ")[0] || "Explorer";
  const targetRole = profile?.targetRole || profile?.role || "Tech Professional";

  const radarData = [
    { subject: 'Frontend', A: profile?.skills?.includes('React') ? 90 : 40, fullMark: 100 },
    { subject: 'Backend', A: profile?.skills?.includes('Flask') || profile?.skills?.includes('Node.js') ? 85 : 45, fullMark: 100 },
    { subject: 'Database', A: profile?.skills?.includes('MongoDB') || profile?.skills?.includes('SQL') ? 80 : 35, fullMark: 100 },
    { subject: 'AI/ML', A: profile?.skills?.includes('Machine Learning') ? 75 : 20, fullMark: 100 },
    { subject: 'Data', A: profile?.skills?.includes('Power BI') || profile?.skills?.includes('Python') ? 85 : 30, fullMark: 100 },
    { subject: 'DSA', A: profile?.skills?.includes('DSA') ? 70 : 40, fullMark: 100 },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20 overflow-hidden">
      {/* Background Grids & Orbs */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* 1. HERO SECTION */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-8 md:p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar & Badges */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-1">
              <div className="w-full h-full rounded-xl bg-background overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-accent-blue/20 text-accent-blue">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border border-border shadow-lg"
            >
              <div className="bg-orange-500/20 p-1.5 rounded-full">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
            </motion.div>
          </div>

          {/* Greeting Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-lg text-foreground/70 font-medium">
              You&apos;re progressing beautifully toward becoming a <span className="text-accent-blue font-bold">{targetRole}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-medium">
                {profile?.experienceLevel || "Level 1"}
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-medium">
                {profile?.preferredDomain || "Tech Domain"}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
                Profile Complete
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. ADVANCED ANALYTICS OVERVIEW */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {[
          { label: "Profile Strength", value: "100%", trend: "+100%", icon: CheckCircle2, color: "text-green-400", border: "hover:border-green-400/30", glow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]" },
          { label: "Skills Logged", value: profile?.skills?.length || 0, trend: "New", icon: BookOpen, color: "text-accent-blue", border: "hover:border-accent-blue/30", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
          { label: "Readiness", value: "TBD", trend: "Needs Resume", icon: Target, color: "text-orange-400", border: "hover:border-orange-400/30", glow: "group-hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]" },
          { label: "Consistency", value: "Day 1", trend: "Streak Started", icon: Activity, color: "text-accent-purple", border: "hover:border-accent-purple/30", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={slideUp}
            className={`p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 flex flex-col relative overflow-hidden group transition-all duration-300 ${stat.border} ${stat.glow} hover:-translate-y-1`}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl bg-background border border-border/50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-foreground/50 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className={`text-xs mt-1 ${stat.trend.includes('+') || stat.trend === 'New' ? 'text-green-400' : 'text-foreground/50'}`}>
                {stat.trend}
              </p>
            </div>
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${stat.color.replace('text', 'bg')}/10 rounded-full blur-[30px] transition-opacity opacity-0 group-hover:opacity-100`} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. AI INSIGHTS & 4. SKILLS VISUALIZATION */}
        <motion.div variants={slideUp} className="lg:col-span-2 space-y-6">

          {/* Skills Radar */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-purple" />
              Skill Distribution
            </h3>
            <p className="text-sm text-foreground/60 mb-6">Your current competency across domains</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-foreground)', opacity: 0.7, fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="var(--color-accent-blue)" fill="var(--color-accent-blue)" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent opacity-50" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-blue" />
              AI Career Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {[
                { title: "Skill Growth", desc: `Your ${profile?.skills?.[0] || 'core'} skill growth is accelerating based on targets.`, delay: 0.1 },
                { title: "Resume Status", desc: "Upload your resume to unlock ATS optimization insights.", delay: 0.2 },
                { title: "Market Fit", desc: `High demand detected for ${targetRole}s in ${profile?.preferredDomain || 'your sector'}.`, delay: 0.3 }
              ].map((insight, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: insight.delay }}
                  key={i}
                  className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent-blue/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-accent-blue" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">{insight.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5. ROADMAP & 7. ACTIVITY */}
        <motion.div variants={slideUp} className="space-y-6">

          {/* Career Roadmap Preview */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-green-400" />
              Path to {targetRole}
            </h3>
            <p className="text-sm text-foreground/60 mb-6">Milestone progression</p>

            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {[
                { title: "Foundations", status: "completed" },
                { title: "Advanced Concepts", status: "current" },
                { title: "Portfolio Building", status: "upcoming" },
                { title: "Interview Prep", status: "upcoming" }
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-background absolute -left-[35px] ${step.status === 'completed' ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                    step.status === 'current' ? 'border-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.4)]' :
                      'border-border'
                    }`}>
                    {step.status === 'completed' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    {step.status === 'current' && <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />}
                  </div>
                  <div className="bg-background/50 border border-border/50 p-3 rounded-lg w-full group-hover:border-accent-blue/30 transition-colors">
                    <h4 className={`text-sm font-medium ${step.status === 'upcoming' ? 'text-foreground/50' : 'text-foreground'}`}>
                      {step.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityFeed.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${activity.active ? 'bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-border'}`} />
                  <div>
                    <p className={`text-sm font-medium ${activity.active ? 'text-foreground' : 'text-foreground/60'}`}>{activity.title}</p>
                    <p className="text-xs text-foreground/40">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. QUICK ACTIONS GRID */}
      <motion.div variants={slideUp} className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-blue" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent-blue/40 hover:bg-accent-blue/5 transition-all group"
            >
              <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
