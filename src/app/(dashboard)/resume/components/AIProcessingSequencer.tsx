"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Loader2, CheckCircle2 } from "lucide-react";

const STAGES = [
  "Simulating ATS parsing...",
  "Evaluating recruiter compatibility...",
  "Detecting skill gaps...",
  "Analyzing production readiness...",
  "Reviewing project impact...",
  "Matching resume against job description...",
  "Generating recruiter insights...",
  "Preparing interview intelligence...",
  "Calculating competitiveness index..."
];

export default function AIProcessingSequencer() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, 1800);

    return () => clearInterval(stageInterval);
  }, []);

  return (
    <div id="ai-processing-section" className="relative w-full py-20 px-4 flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="w-full max-w-4xl p-10 md:p-16 rounded-[3rem] bg-white/90 dark:bg-zinc-950/80 backdrop-blur-2xl border border-black/10 dark:border-white/20 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_0_80px_rgba(59,130,246,0.1)] relative overflow-hidden group"
      >
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Scanning Laser Beam */}
        <motion.div 
          animate={{ top: ["-10%", "110%", "-10%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none z-0"
        />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Glowing AI Orb */}
          <div className="relative flex items-center justify-center w-28 h-28 mb-10">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
            />
            {/* Spinning Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[2px] border-dashed border-blue-500/30 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-cyan-500/20 rounded-full opacity-50"
            />
            
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.8)] flex items-center justify-center relative overflow-hidden">
              <BrainCircuit className="w-6 h-6 text-white absolute z-10" />
              <motion.div 
                animate={{ y: ["100%", "-100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/40 blur-sm"
              />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 mb-8 drop-shadow-sm">
            AI Recruiter Analysis in Progress
          </h2>

          {/* Dynamic Loading Messages */}
          <div className="h-12 flex items-center justify-center mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-300 text-center"
              >
                {STAGES[stage]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Believable AI Status Metrics (Pills) */}
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-black/40 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">JD Match Correlation: Processing</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">ATS Parsing Confidence: 96%</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-black/40 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Recruiter Signal Detection: Active</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
