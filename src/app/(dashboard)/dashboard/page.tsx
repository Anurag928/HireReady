"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import {
  Sparkles, TrendingUp, Target, BookOpen, Clock, FileText,
  Code, Map as MapIcon, Briefcase, Activity, CheckCircle2, ChevronRight, Zap,
  AlertCircle
} from "lucide-react";
import { slideUp, staggerContainer, fadeIn } from "@/animations";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardMetrics } from "@/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getDashboardMetrics(user.uid).then(res => {
        if (res.data?.success) {
          setMetrics(res.data.data);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Failed to fetch dashboard metrics", err);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Failed to load Dashboard</h2>
        <p className="text-foreground/60 mt-2">Please try refreshing the page or check your connection.</p>
      </div>
    );
  }

  const {
    profile,
    profile_strength,
    missing_sections,
    readiness_score,
    readiness_status,
    career_insight,
    market_alignment,
    market_trend,
    top_skill_gap,
    roadmap_percentage,
    roadmap_progress,
    mock_interview,
    resume_intelligence,
    github_intelligence,
    activities
  } = metrics;

  const displayName = profile?.name || "Explorer";
  const targetRole = profile?.targetRole || "Tech Professional";

  // Dynamic radar data mapping profile skills to categories
  const radarData = [
    { subject: 'Frontend', A: profile?.skills?.some((s: string) => ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JS', 'TypeScript'].includes(s)) ? 90 : 20, fullMark: 100 },
    { subject: 'Backend', A: profile?.skills?.some((s: string) => ['Node', 'Flask', 'Django', 'Spring', 'Go'].includes(s)) ? 85 : 20, fullMark: 100 },
    { subject: 'Database', A: profile?.skills?.some((s: string) => ['SQL', 'Mongo', 'Postgres'].includes(s)) ? 80 : 20, fullMark: 100 },
    { subject: 'AI/ML', A: profile?.skills?.some((s: string) => ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch'].includes(s)) ? 75 : 20, fullMark: 100 },
    { subject: 'Cloud', A: profile?.skills?.some((s: string) => ['AWS', 'GCP', 'Azure', 'Docker'].includes(s)) ? 70 : 20, fullMark: 100 },
    { subject: 'DSA', A: profile?.skills?.some((s: string) => ['DSA', 'Algorithms'].includes(s)) ? 70 : 20, fullMark: 100 },
  ];

  const quickActions = [
    { title: "Resume Analyzer", status: resume_intelligence ? `ATS: ${resume_intelligence.ats_score}%` : "Upload Resume", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", href: "/resume" },
    { title: "AI Mock Interview", status: mock_interview ? `Score: ${mock_interview.latest_score}` : "Start Interview", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10", href: "/mock-interview" },
    { title: "AI Roadmap", status: roadmap_progress ? `${roadmap_progress.completed_milestones}/${roadmap_progress.total_milestones} Done` : "Generate Path", icon: MapIcon, color: "text-green-500", bg: "bg-green-500/10", href: "/roadmap" },
    { title: "GitHub Analyzer", status: github_intelligence?.connected ? "Connected" : "Not Connected", icon: Code, color: "text-gray-400", bg: "bg-gray-500/10", href: "/profile" },
    { title: "Skill Gap Analysis", status: `${missing_sections.length} Gaps`, icon: Target, color: "text-orange-500", bg: "bg-orange-500/10", href: "/profile" },
    { title: "Placement Tracker", status: "Coming Soon", icon: Activity, color: "text-red-500", bg: "bg-red-500/10", href: "/dashboard" },
  ];

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
        className="relative z-10 p-8 md:p-10 rounded-3xl bg-white/[0.85] dark:bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 opacity-50 transition-opacity duration-700" />

        <div className="relative flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-accent-blue font-semibold tracking-wide uppercase text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              AI Career Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex flex-wrap items-center gap-3">
              <span>
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">HireReady</span>
              </span>
              <span>👋</span>
            </h1>
            <p className="text-lg text-foreground/70 font-medium max-w-3xl mt-1">
              Your personal career intelligence workspace.
            </p>
          </div>

          {/* 6-Grid Metrics Display */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Current Position */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50">
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Current Position</p>
              <p className="text-sm font-semibold leading-tight break-words" title={profile.currentPosition}>{profile.currentPosition}</p>
            </div>

            {/* Target Role */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50">
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Target Role</p>
              <p className="text-sm font-semibold leading-tight break-words text-accent-blue" title={profile.targetRole}>{profile.targetRole}</p>
            </div>

            {/* Career Readiness */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent-blue/10 rounded-full blur-xl" />
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Career Readiness</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{readiness_score > 0 ? `${readiness_score}%` : 'N/A'}</span>
              </div>
              <p className="text-[10px] text-foreground/50 mt-0.5">{readiness_score > 0 ? readiness_status : 'Not Available'}</p>
            </div>

            {/* Market Alignment */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent-purple/10 rounded-full blur-xl" />
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Market Match</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{readiness_score > 0 ? `${market_alignment}%` : 'N/A'}</span>
              </div>
              <p className="text-[10px] text-foreground/50 mt-0.5">{readiness_score > 0 ? market_trend : 'Generate Roadmap'}</p>
            </div>

            {/* Top Skill Gap */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50">
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Top Skill Gap</p>
              <p className="text-sm font-semibold leading-tight break-words text-orange-500" title={top_skill_gap}>{top_skill_gap}</p>
            </div>

            {/* Roadmap Progress */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl" />
              <p className="text-xs text-foreground/50 font-medium uppercase mb-1">Roadmap Progress</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{roadmap_percentage > 0 ? `${roadmap_percentage}%` : 'N/A'}</span>
              </div>
              <p className="text-[10px] text-foreground/50 mt-0.5">{roadmap_percentage > 0 ? `Phase ${roadmap_progress?.completed_milestones + 1}` : 'Not Started'}</p>
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
          { label: "Profile Strength", value: `${profile_strength}%`, trend: missing_sections.length ? `${missing_sections.length} Action(s) Needed` : "All Complete", icon: CheckCircle2, color: profile_strength === 100 ? "text-green-400" : "text-yellow-400", border: profile_strength === 100 ? "hover:border-green-400/30" : "hover:border-yellow-400/30", glow: profile_strength === 100 ? "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]" : "group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]" },
          { label: "Career Readiness", value: `${readiness_score}%`, trend: readiness_status, icon: Target, color: readiness_score >= 80 ? "text-accent-blue" : "text-orange-400", border: readiness_score >= 80 ? "hover:border-accent-blue/30" : "hover:border-orange-400/30", glow: readiness_score >= 80 ? "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "group-hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]" },
          { label: "AI Market Fit", value: `${market_alignment}%`, trend: market_trend, icon: TrendingUp, color: "text-accent-purple", border: "hover:border-accent-purple/30", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
          { label: "Mock Interview Avg", value: mock_interview ? mock_interview.average_score : "N/A", trend: mock_interview ? `Best: ${mock_interview.best_score}` : "Not Taken", icon: Briefcase, color: "text-green-400", border: "hover:border-green-400/30", glow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]" }
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
              <p className={`text-xs mt-1 ${['All Complete', 'Interview Ready', 'High Demand'].includes(stat.trend) ? 'text-green-400' : 'text-foreground/50'}`}>
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
            <p className="text-sm text-foreground/60 mb-6">Generated from your profile data</p>
            <div className="h-[300px] w-full">
              {profile.skills?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-foreground)', opacity: 0.7, fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="A" stroke="var(--color-accent-blue)" fill="var(--color-accent-blue)" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-foreground/50 mb-4">No skills mapped. Update your profile.</p>
                  <Link href="/profile" className="px-4 py-2 bg-accent-blue text-white font-semibold rounded-full hover:bg-accent-blue/90">
                    Add Skills
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent opacity-50" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-blue" />
              Actionable Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {[
                { title: "Missing Sections", desc: missing_sections.length > 0 ? `Complete: ${missing_sections.join(", ")}` : "Profile fully optimized.", delay: 0.1 },
                { title: "Resume ATS", desc: resume_intelligence ? `Scored ${resume_intelligence.ats_score}%. ${resume_intelligence.missing_keywords?.length > 0 ? 'Missing keywords detected.' : 'Looks strong!'}` : "Upload resume to unlock ATS insights.", delay: 0.2 },
                { title: "GitHub Sync", desc: github_intelligence?.connected ? "GitHub connected. Activity is contributing to readiness score." : "Connect GitHub to improve Market Fit score.", delay: 0.3 }
              ].map((insight, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: insight.delay }}
                  key={i}
                  className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent-blue/40 transition-colors flex flex-col h-full"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-accent-blue" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed flex-1">{insight.desc}</p>
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
            <p className="text-sm text-foreground/60 mb-6">Generated AI Roadmap</p>

            {roadmap_progress ? (
              <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { title: `Completed (${roadmap_progress.completed_milestones})`, status: "completed" },
                  { title: roadmap_progress.current_phase, status: "current" },
                  { title: `Remaining (${roadmap_progress.remaining_milestones})`, status: "upcoming" }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-background absolute -left-[35px] md:-left-3 ${step.status === 'completed' ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
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
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <p className="text-foreground/50 mb-4 text-sm">You haven't generated your personalized learning roadmap yet.</p>
                <Link href="/roadmap" className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/20 transition-colors text-sm">
                  Generate AI Roadmap
                </Link>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            {activities?.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity: any, i: number) => {
                  let timeAgo = "Recently";
                  try {
                    if (activity.timestamp) {
                      timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
                    }
                  } catch (e) {}
                  
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]`} />
                      <div>
                        <p className={`text-sm font-medium text-foreground`}>{activity.title}</p>
                        <p className="text-xs text-foreground/40">{timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-foreground/50 text-sm">
                No recent activity found. Explore the platform!
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 6. QUICK ACTIONS GRID */}
      <motion.div variants={slideUp} className="p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-blue" />
          Quick Actions & Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-full flex flex-col items-center justify-between text-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent-blue/40 hover:bg-accent-blue/5 transition-all group"
              >
                <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-center justify-end flex-1">
                  <span className="text-sm font-semibold mb-1">{action.title}</span>
                  <span className="text-[10px] text-foreground/50 font-medium px-2 py-0.5 rounded-full bg-foreground/5">{action.status}</span>
                </div>
              </motion.button>
            </Link>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
