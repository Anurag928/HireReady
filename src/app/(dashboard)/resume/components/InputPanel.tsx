"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { analyzeResumeInBackend } from "@/api";
import { motion } from "framer-motion";
import { Sparkles, Terminal } from "lucide-react";

interface Props {
  onStart: (args: { targetRole: string; jobDescription: string; resumeText: string; startAnalysis: () => Promise<any> }) => void;
  onSelfTest: () => void;
  isAnalyzing?: boolean;
  isDebugMode?: boolean;
}

export function InputPanel({ onStart, onSelfTest, isAnalyzing, isDebugMode }: Props) {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");

  const startAnalysis = async () => {
    const finalResume = resumeText.trim();
    const finalRole = targetRole.trim();
    const finalJD = jobDescription.trim() || "React, Node.js, Express, MongoDB, REST APIs, Git, Deployment, AWS (optional)";

    const payload = { 
      uid: user?.uid || "tester-uid", 
      resume_text: finalResume, 
      target_role: finalRole,
      job_description: finalJD,
      debug_mode: isDebugMode
    };
    return analyzeResumeInBackend(payload);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-20 pb-12">
      
      {/* 🏛️ LEFT COLUMN: TARGET ROLE + JD */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
        
        {/* TARGET ROLE */}
        <div className="group relative">
          <div className="relative bg-white/90 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-6 flex flex-col shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-2xl group-hover:border-cyan-500/30 transition-all duration-500">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600/70 dark:text-cyan-400/50 mb-4 flex items-center justify-between">
              Target Role
              <div className={`w-1.5 h-1.5 rounded-full ${targetRole ? 'bg-cyan-500 shadow-[0_0_15px_#06b6d4]' : 'bg-black/10 dark:bg-white/5'}`} />
            </label>
            
            <div className="relative">
              <input 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                disabled={isAnalyzing}
                placeholder="E.G. SYSTEMS ARCHITECT" 
                className="w-full bg-transparent text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all disabled:opacity-50" 
              />
              <div className="mt-4 w-full h-[1px] bg-black/10 dark:bg-white/5 group-focus-within:bg-cyan-500/40 dark:group-focus-within:bg-cyan-500/20 transition-colors" />
            </div>
          </div>
        </div>

        {/* JOB DESCRIPTION */}
        <div className="group relative flex-1 min-h-[350px]">
          <div className="relative h-full bg-white/90 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-8 flex flex-col shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-2xl group-hover:border-purple-500/30 transition-all duration-500">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600/70 dark:text-purple-400/50 mb-6 flex items-center justify-between">
              Job Context / Req
              <div className={`w-1.5 h-1.5 rounded-full ${jobDescription ? 'bg-purple-500 shadow-[0_0_15px_#a855f7]' : 'bg-black/10 dark:bg-white/5'}`} />
            </label>
            
            <div className="relative flex-1">
              <textarea 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)} 
                disabled={isAnalyzing}
                placeholder="PASTE JD / REQUIREMENTS..." 
                className="w-full h-full bg-transparent text-lg font-bold tracking-tight text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed transition-all custom-scrollbar uppercase disabled:opacity-50" 
              />
            </div>
            <div className="mt-4 w-full h-[1px] bg-black/10 dark:bg-white/5 group-focus-within:bg-purple-500/40 dark:group-focus-within:bg-purple-500/20 transition-colors" />
          </div>
        </div>

      </div>

      {/* 🧬 RIGHT COLUMN: RESUME INPUT */}
      <div className="lg:col-span-12 xl:col-span-7 group relative">
        <div className="relative flex flex-col h-full bg-white/90 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:shadow-3xl overflow-hidden group-hover:border-blue-500/30 transition-all duration-500">
          
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-white/50">Resume Source Code</label>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                 <span className="text-[9px] text-blue-600 dark:text-cyan-400 font-black uppercase tracking-[0.2em]">{isAnalyzing ? "Processing..." : "Neural Engine Ready"}</span>
              </div>
            </div>
          </div>

          <div className="relative group/textarea flex-1">
             <textarea 
               value={resumeText} 
               onChange={(e) => setResumeText(e.target.value)} 
               disabled={isAnalyzing}
               placeholder="INSERT PLAINTEXT RESUME..." 
               className="relative w-full h-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-2xl px-8 py-8 text-xl font-bold text-zinc-900 dark:text-white leading-[1.6] placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all resize-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 custom-scrollbar uppercase disabled:opacity-50 shadow-inner" 
             />
          </div>
        </div>
      </div>

      {/* 🚀 FULL WIDTH CTA: EXECUTE */}
      <div className="col-span-12 mt-12 flex flex-col items-center justify-center gap-8 w-full">
        <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        
        <div className="relative group/button flex justify-center w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-blue-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <button
            onClick={() => onStart({ targetRole, jobDescription, resumeText, startAnalysis })}
            disabled={isAnalyzing || !targetRole.trim() || !resumeText.trim()}
            className="group relative px-20 py-8 rounded-2xl bg-blue-600 dark:bg-cyan-500/20 text-white dark:text-cyan-200 border border-transparent dark:border-cyan-500/30 font-black uppercase tracking-[0.4em] text-[14px] hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed overflow-hidden shadow-[0_10px_40px_rgba(37,99,235,0.3)] dark:shadow-2xl flex items-center gap-6"
          >
            <span className="relative z-10">{isAnalyzing ? "Analyzing Resume..." : "Generate Insights"}</span>
            {isAnalyzing ? (
              <div className="relative z-10 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="relative z-10 w-4 h-4 text-white dark:text-cyan-300 group-hover:animate-pulse" />
            )}
            
            {/* HOVER SHINE */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-2 mt-4">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
               AI Recruiter Intelligence Ready
             </span>
           </div>
        </div>
      </div>
    </section>
  );
}
