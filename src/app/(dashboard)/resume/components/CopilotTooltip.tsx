"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck, PenTool, Minimize, ArrowUpRight } from "lucide-react";

interface CopilotTooltipProps {
  x: number;
  y: number;
  onAction: (action: string) => void;
}

export function CopilotTooltip({ x, y, onAction }: CopilotTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="fixed z-50 flex items-center p-1 bg-white/95 dark:bg-[#0a0f1d]/95 border border-zinc-200 dark:border-cyan-500/20 shadow-2xl rounded-full backdrop-blur-xl"
      style={{
        left: x,
        top: y - 55,
        transform: "translateX(-50%)",
        boxShadow: "0 10px 40px -10px rgba(6, 182, 212, 0.15), 0 0 1px 1px rgba(6, 182, 212, 0.1)",
      }}
    >
      <div className="flex items-center gap-1 px-2 border-r border-zinc-200 dark:border-white/10 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-pulse" />
        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest font-mono">
          Copilot
        </span>
      </div>

      <div className="flex items-center gap-0.5 px-1 overflow-x-auto">
        <button
          onClick={() => onAction("impact")}
          className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-full transition-colors flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
          <span>Impact</span>
        </button>

        <button
          onClick={() => onAction("ats")}
          className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-full transition-colors flex items-center gap-1"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>ATS</span>
        </button>

        <button
          onClick={() => onAction("metrics")}
          className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-full transition-colors flex items-center gap-1"
        >
          <PenTool className="w-3 h-3 text-blue-500 dark:text-blue-400 shrink-0" />
          <span>Metrics</span>
        </button>

        <button
          onClick={() => onAction("concise")}
          className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-full transition-colors flex items-center gap-1"
        >
          <Minimize className="w-3 h-3 text-purple-500 dark:text-purple-400 shrink-0" />
          <span>Concise</span>
        </button>

        <button
          onClick={() => onAction("senior")}
          className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowUpRight className="w-3 h-3 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>Senior</span>
        </button>
      </div>
    </motion.div>
  );
}
