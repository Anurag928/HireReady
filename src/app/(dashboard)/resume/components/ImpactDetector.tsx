"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Wand2 } from "lucide-react";

interface ImpactDetectorProps {
  improvements: {
    original_text: string;
    improved_text: string;
    reasoning: string;
  }[];
}

export function ImpactDetector({ improvements }: ImpactDetectorProps) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <Wand2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">AI Impact Enhancement</h3>
          <p className="text-foreground/70 text-sm">Transforming weak bullet points into metric-driven achievements.</p>
        </div>
      </div>

      <div className="space-y-4">
        {improvements.map((improvement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 hover:from-blue-500/20 hover:to-indigo-500/20 transition-colors duration-500"
          >
            <div className="bg-card rounded-[1.4rem] p-6 border border-border relative z-10 flex flex-col md:flex-row gap-6 items-center shadow-sm">
              
              {/* Original */}
              <div className="flex-1 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl w-full">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wider">Before</div>
                <p className="text-foreground/70 line-through decoration-red-500/50 text-sm">{improvement.original_text}</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Improved */}
              <div className="flex-1 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" /> AI Enhanced
                </div>
                <p className="text-foreground font-medium text-sm leading-relaxed">{improvement.improved_text}</p>
              </div>

            </div>
            
            {/* Reasoning Tooltip (Hover) */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-4 py-2 bg-background border border-border rounded-lg text-xs text-foreground/ whitespace-nowrap z-20 shadow-xl">
              {improvement.reasoning}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
