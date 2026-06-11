"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { 
  getResumeHistoryFromBackend, 
  getRoadmapHistoryFromBackend, 
  getMockInterviewHistory 
} from "@/api";
import { 
  History, 
  Search, 
  Filter, 
  BrainCircuit, 
  FileText, 
  Target, 
  Video, 
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  id: string;
  type: "resume" | "roadmap" | "interview";
  date: Date;
  title: string;
  score: number | null;
  summary: string;
  tags: string[];
  raw: any;
}

export default function GlobalHistoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "resume" | "roadmap" | "interview">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchAllHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resumeRes, roadmapRes, interviewRes] = await Promise.allSettled([
          getResumeHistoryFromBackend(user.uid),
          getRoadmapHistoryFromBackend(user.uid),
          getMockInterviewHistory(user.uid)
        ]);

        const merged: HistoryItem[] = [];

        // Parse Resumes
        if (resumeRes.status === "fulfilled" && resumeRes.value.data?.success) {
          const resumes = resumeRes.value.data.data?.history || [];
          resumes.forEach((r: any) => {
            const metrics = r.analysis?.confidence_metrics || {};
            const verdict = r.analysis?.recruiter_scan || {};
            const score = r.atsScore || r.ats_score || metrics.ats_score || null;
            const summary = r.verdict || r.recruiter_feedback || verdict.first_impression || "ATS Scan completed.";
            
            merged.push({
              id: r._id || r.id || Math.random().toString(),
              type: "resume",
              date: new Date(r.upload_date || r.createdAt),
              title: r.targetRole || r.target_role || "Resume Analysis",
              score,
              summary,
              tags: ["ATS", score >= 80 ? "High Match" : "Needs Work"],
              raw: r
            });
          });
        }

        // Parse Roadmaps
        if (roadmapRes.status === "fulfilled" && roadmapRes.value.data?.success) {
          const roadmaps = roadmapRes.value.data.data?.history || [];
          roadmaps.forEach((r: any) => {
            const path = r.roadmap?.career_path || r.career_path || "Career Roadmap";
            merged.push({
              id: r._id || r.id || Math.random().toString(),
              type: "roadmap",
              date: new Date(r.created_at || r.createdAt),
              title: path,
              score: null,
              summary: `Generated timeline: ${r.roadmap?.estimated_timeline || "N/A"}. Includes project & cert recommendations.`,
              tags: ["Strategy", "Planning"],
              raw: r
            });
          });
        }

        // Parse Interviews
        if (interviewRes.status === "fulfilled" && interviewRes.value.data?.success) {
          const interviews = interviewRes.value.data.data || [];
          interviews.forEach((i: any) => {
            const score = i.overallScore || i.overall_score || null;
            merged.push({
              id: i._id || i.id || Math.random().toString(),
              type: "interview",
              date: new Date(i.created_at || i.createdAt),
              title: i.targetRole || i.target_role || "Mock Interview",
              score,
              summary: i.recruiterVerdict?.hiringRecommendation || "Interview session completed.",
              tags: [i.difficulty || "Mixed", i.companyStyle || "Standard"],
              raw: i
            });
          });
        }

        // Sort descending by date
        merged.sort((a, b) => b.date.getTime() - a.date.getTime());
        setItems(merged);

      } catch (err) {
        console.error("History fetch failed", err);
        setError("Failed to synchronize history archives.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllHistory();
  }, [user]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterType !== "all" && item.type !== filterType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) || 
               item.summary.toLowerCase().includes(query) ||
               item.tags.some(t => t.toLowerCase().includes(query));
      }
      return true;
    });
  }, [items, filterType, searchQuery]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "resume": return <FileText className="w-5 h-5 text-blue-500" />;
      case "roadmap": return <Target className="w-5 h-5 text-purple-500" />;
      case "interview": return <Video className="w-5 h-5 text-emerald-500" />;
      default: return <BrainCircuit className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case "resume": return "bg-blue-500/10 border-blue-500/20";
      case "roadmap": return "bg-purple-500/10 border-purple-500/20";
      case "interview": return "bg-emerald-500/10 border-emerald-500/20";
      default: return "bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase tracking-wider mb-4 border border-accent-blue/20">
              <History className="w-4 h-4" /> Global Archive
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Career Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">History</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
              Review your past AI assessments, mock interviews, and career roadmaps. Track your progression over time.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card/40 p-2 rounded-2xl border border-border/50 backdrop-blur-md">
            {["all", "resume", "roadmap", "interview"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filterType === type ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all your career intelligence data..."
            className="w-full bg-card/50 border border-border/60 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all text-lg shadow-sm"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Syncing Archives...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-center gap-4 text-red-500">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Sync Error</h3>
              <p className="text-red-500/80">{error}</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-card/20 rounded-3xl border border-dashed border-border/60">
            <History className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Records Found</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery ? "No history matches your search criteria." : "You haven't run any AI analyses or interviews yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-5 md:p-6 rounded-3xl bg-card/40 hover:bg-card/80 border border-border/50 hover:border-accent-blue/30 backdrop-blur-xl transition-all shadow-sm hover:shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden cursor-pointer"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    item.type === 'resume' ? 'bg-blue-500' : 
                    item.type === 'roadmap' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />
                  
                  {/* Icon & Type */}
                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${getBgForType(item.type)}`}>
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex flex-col md:hidden">
                      <span className="font-bold text-lg">{item.title}</span>
                      <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="hidden md:flex items-center justify-between">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-accent-blue transition-colors">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-md bg-background/50 border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics & Action */}
                  <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-2 shrink-0">
                    <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:block">
                        {item.date.toLocaleDateString()}
                      </span>
                      {item.score !== null && (
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-xl text-sm font-black flex items-center gap-1.5 ${
                            item.score >= 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            item.score >= 60 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                            'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {item.score}%
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Link href={`/${item.type}`} className="md:mt-2 text-xs font-bold text-accent-blue flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open Module <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
