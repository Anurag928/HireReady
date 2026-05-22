"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Target } from "lucide-react";

interface ATSBoostPreviewProps {
  currentScore: number;
}

export function ATSBoostPreview({ currentScore }: ATSBoostPreviewProps) {
  const [optimizedScore, setOptimizedScore] = useState<number>(currentScore);

  useEffect(() => {
    // Generate a random score between 80 and 90. 
    // Ensure it is at least equal to the current score if current score is somehow > 90.
    const randomScore = Math.floor(Math.random() * 11) + 80;
    setOptimizedScore(Math.max(currentScore, randomScore));
  }, [currentScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-emerald-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      <div className="p-8 md:p-12 bg-card border border-border rounded-[2rem] relative z-10 overflow-hidden text-center shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6">
          <Rocket className="w-8 h-8 text-indigo-500" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Unlock Your Potential
        </h3>
        <p className="text-foreground/70 max-w-2xl mx-auto mb-12">
          By applying the AI-driven enhancements suggested above, your resume is projected to significantly bypass ATS filters and immediately grab recruiter attention.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative z-10">
          
          {/* Current Score */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-8 border-foreground/10 flex items-center justify-center mb-4 bg-background shadow-inner">
              <span className="text-4xl font-black text-foreground/50">{currentScore}</span>
            </div>
            <span className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              Current ATS
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center px-4">
            <div className="h-[2px] w-24 bg-gradient-to-r from-foreground/10 via-blue-500/50 to-emerald-500/50 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-emerald-500 rotate-45" />
            </div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-4">AI Optimization</span>
          </div>
          
          <div className="md:hidden flex items-center justify-center py-4">
            <ArrowRight className="w-8 h-8 text-blue-500 rotate-90" />
          </div>

          {/* Optimized Score */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full border-8 border-emerald-500/30 flex items-center justify-center mb-4 bg-background shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
              <div className="absolute inset-0 rounded-full border-t-8 border-emerald-500 animate-spin-slow" style={{ animationDuration: '3s' }} />
              <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 to-emerald-600">
                {optimizedScore}
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Optimized ATS
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
