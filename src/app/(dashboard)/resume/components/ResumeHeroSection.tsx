"use client";

import { motion } from "framer-motion";
import { UploadCloud, Sparkles, BrainCircuit } from "lucide-react";

export function ResumeHeroSection() {
  return (
    <div className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-md">
          <BrainCircuit className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Career Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-8 tracking-tight leading-tight">
          Analyze. Optimize. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Accelerate.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 leading-relaxed mb-12">
          Upload your resume and let our elite AI recruiter simulate ATS systems, detect skill gaps, and rewrite your achievements for maximum market impact.
        </p>

        {/* Floating preview cards */}
        <div className="flex flex-wrap justify-center gap-6 opacity-80 pointer-events-none">
           <div className="px-6 py-3 rounded-2xl bg-foreground/5 border border-border backdrop-blur-xl shadow-2xl flex items-center gap-3">
             <Sparkles className="w-5 h-5 text-indigo-400" />
             <span className="text-foreground/ font-medium">ATS Scoring</span>
           </div>
           <div className="px-6 py-3 rounded-2xl bg-foreground/5 border border-border backdrop-blur-xl shadow-2xl flex items-center gap-3">
             <UploadCloud className="w-5 h-5 text-blue-400" />
             <span className="text-foreground/ font-medium">Inline Rewrites</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
