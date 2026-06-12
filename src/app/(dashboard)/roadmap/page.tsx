"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Code2, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { generateRoadmapInBackend, getRoadmapFromBackend, getRoadmapHistoryFromBackend } from "@/api";


// Components
import { HeroSection } from "./components/HeroSection";
import { AILoadingSequence } from "./components/AILoadingSequence";
import { VerticalTimeline } from "./components/VerticalTimeline";
import { ProjectGrid } from "./components/ProjectGrid";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { HistoryModal } from "./components/HistoryModal";
import { StrategyModeModal } from "./components/StrategyModeModal";
import { exportRoadmapToPDF } from "@/utils/pdfExport";

// --- Types ---
interface RoadmapData {
  career_path: string;
  weekly_plan: {
    week: string;
    focus: string;
    ai_insight?: string;
    tasks: string[];
  }[];
  technologies_to_learn: {
    category: string;
    technologies: string[];
  }[];
  recommended_projects: {
    title: string;
    difficulty: string;
    estimated_time: string;
    technologies_used: string[];
  }[];
  certifications: {
    provider: string;
    name: string;
    relevance: string;
  }[];
  interview_preparation: {
    topic: string;
    details: string[];
  }[];
  estimated_timeline: string;
}

export default function RoadmapPage() {
  const { user, dbUser } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await getRoadmapFromBackend(user!.uid);
      if (res.data?.success && res.data?.data?.roadmap?.roadmap) {
        setRoadmap(res.data.data.roadmap.roadmap);
      }
    } catch (e: any) {
      if (e.response?.status !== 404) {
        console.error("Error fetching roadmap", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoadmap();
    }
  }, [user]);

  const handleGenerate = async (forceRegenerate: boolean = false, strategyMode?: string) => {
    if (!user) return;
    try {
      setGenerating(true);
      setError(null);
      const res = await generateRoadmapInBackend(user.uid, forceRegenerate, strategyMode);
      if (res.data?.success) {
        setRoadmap(res.data.data.roadmap.roadmap);
      } else {
        setError(res.data?.error || res.data?.message || "Failed to generate roadmap.");
      }
    } catch (e: any) {
      const errData = e.response?.data;
      if (errData && errData.error_type === "service_unavailable") {
        setError(errData);
      } else if (errData && errData.error) {
        setError({
          type: "backend_error",
          stage: errData.stage || "unknown",
          message: errData.error,
          rawResponse: errData.raw_response || null
        });
      } else {
        setError("An error occurred during AI generation.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenHistory = async () => {
    if (!user) return;
    setIsHistoryOpen(true);
    setLoadingHistory(true);
    try {
      const res = await getRoadmapHistoryFromBackend(user.uid);
      if (res.data?.success) {
        setHistoryData(res.data.data.history);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectHistoryVersion = (versionItem: any) => {
    if (versionItem?.roadmap) {
      setRoadmap(versionItem.roadmap);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    // Give state time to update print styles
    setTimeout(async () => {
      await exportRoadmapToPDF("roadmap-container", roadmap?.career_path || "Roadmap");
      setIsExporting(false);
    }, 500);
  };

  const handleTriggerGenerate = (isRegenerating: boolean) => {
    if (isRegenerating) {
      setIsStrategyModalOpen(true);
    } else {
      handleGenerate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  // --- AI GENERATION VIEW / ERROR STATE ---
  if (!roadmap || generating || error) {
    return (
      <div className="min-h-[80vh] relative">
        <AnimatePresence mode="wait">
          {generating ? (
            <AILoadingSequence key="loading" />
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <HeroSection 
                careerPath={""}
                timeline={""}
                onGenerate={() => handleTriggerGenerate(false)}
              />
              
              {/* Premium Error UI Display */}
              {error && (
                <div className="max-w-2xl mx-auto -mt-8 relative z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500/40 via-orange-500/40 to-red-500/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                    <div className="relative p-8 bg-background/90 backdrop-blur-2xl border border-red-500/20 rounded-3xl shadow-2xl text-center">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {error?.error_type === 'service_unavailable' ? "AI Engine Busy" : "AI Systems Encountered Turbulence"}
                      </h3>
                      <p className="text-foreground/70 mb-6 leading-relaxed">
                        {error?.error_type === 'service_unavailable' 
                          ? "Gemini appears overloaded right now. The machines require a brief existential recovery."
                          : "We've encountered unexpected turbulence while designing your roadmap."}
                      </p>
                      <button
                        onClick={() => handleTriggerGenerate(false)}
                        className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium transition-all"
                      >
                        Retry Generation
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- ROADMAP RESULT VIEW ---
  return (
    <div 
      className={`relative pb-32 print:pb-12 print:bg-white print:text-black ${isExporting ? 'pdf-export-mode' : ''}`} 
      id="roadmap-container"
    >
      {/* Universal Ambient Noise - Hide during export */}
      {!isExporting && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      )}

      {/* Print-only Header */}
      <div className="hidden print:block text-center py-8 border-b border-gray-200 mb-8">
        <h1 className="text-3xl font-black uppercase text-black tracking-widest mb-2">AI Career Roadmap Report</h1>
        <p className="text-sm font-bold text-gray-500">Generated for: {roadmap.career_path}</p>
        <p className="text-sm font-bold text-gray-500">Generated On: {new Date().toLocaleString()}</p>
      </div>

      <div className="print:hidden">
        <HeroSection 
          careerPath={roadmap.career_path}
          timeline={roadmap.estimated_timeline}
          onGenerate={() => handleTriggerGenerate(true)}
          isExporting={isExporting}
        />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 md:px-8 space-y-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, staggerChildren: 0.2 }}
      >
        
        {/* Analytics Layer */}
        <motion.section 
          className="print:break-inside-avoid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AnalyticsDashboard 
            userRole={dbUser?.role || "Software Engineer"}
            targetRole={dbUser?.target_role || "Target Role"}
            timeline={roadmap.estimated_timeline}
          />
        </motion.section>

        {/* Timeline Layer */}
        <motion.section 
          className="print:break-inside-avoid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <VerticalTimeline weeklyPlan={roadmap.weekly_plan} />
        </motion.section>

        {/* Projects Layer */}
        <motion.section 
          className="print:break-inside-avoid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
              Venture-Grade Projects
            </h2>
            <p className="text-foreground/60 max-w-2xl">
              Build these strategic portfolio pieces to prove your market readiness and technical depth.
            </p>
          </div>
          <ProjectGrid projects={roadmap.recommended_projects} />
        </motion.section>

        {/* Knowledge Base Layer (Tech, Certs, Interviews) */}
        <motion.section 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:break-inside-avoid print:grid-cols-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          
          {/* Tech Stack */}
          <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent-blue/20 transition-colors duration-700" />
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
                <Code2 className="w-5 h-5" />
              </div>
              Technology Map
            </h3>
            <div className="space-y-6 relative z-10">
              {roadmap.technologies_to_learn.map((cat, i) => (
                <div key={i}>
                  <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">{cat.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.technologies.map((tech, j) => (
                      <span key={j} className="px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-sm font-medium hover:border-accent-blue/50 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-500/10 transition-colors duration-700" />
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500">
                <GraduationCap className="w-5 h-5" />
              </div>
              Market Certifications
            </h3>
            <div className="space-y-4 relative z-10">
              {roadmap.certifications.map((cert, i) => (
                <div key={i} className="p-5 rounded-2xl bg-background/40 border border-white/5 hover:bg-background/60 hover:border-green-500/30 transition-all">
                  <div className="text-xs font-bold text-green-500 tracking-wider uppercase mb-1.5">{cert.provider}</div>
                  <h4 className="font-bold text-sm mb-2 text-foreground/90">{cert.name}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">{cert.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Prep */}
          <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-red-500/10 transition-colors duration-700" />
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              Interview Strategy
            </h3>
            <div className="space-y-6 relative z-10">
              {roadmap.interview_preparation.map((prep, i) => (
                <div key={i} className="group/item">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-foreground/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover/item:scale-150 transition-transform" />
                    {prep.topic}
                  </h4>
                  <ul className="space-y-2.5">
                    {prep.details.map((detail, j) => (
                      <li key={j} className="text-xs text-foreground/60 pl-4 border-l-2 border-white/10 group-hover/item:border-red-500/30 transition-colors flex items-start">
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </motion.div>

      <div className="print:hidden">
        <FloatingToolbar 
          onRegenerate={() => handleTriggerGenerate(true)}
          onPrint={handlePrint}
          onHistory={handleOpenHistory}
          isExporting={isExporting}
        />
      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyData}
        loading={loadingHistory}
        onSelectVersion={handleSelectHistoryVersion}
      />
      
      <StrategyModeModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onSelectStrategy={(strategy) => handleGenerate(true, strategy)}
      />
      
      {/* Print-only Footer */}
      <div className="hidden print:block fixed bottom-4 left-0 w-full text-center py-4 border-t border-gray-200 mt-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
        Generated by HireReady
      </div>
    </div>
  );
}
