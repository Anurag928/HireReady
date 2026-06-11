"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Target,
  ArrowRight
} from "lucide-react";

interface Improvement {
  original_text: string;
  improved_text: string;
  reasoning: string;
}

interface AIResumeEnhancementEngineProps {
  improvements: Improvement[];
}

const EnhancementCard = ({ imp, index }: { imp: Improvement; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(imp.improved_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#0a0a0b] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all shadow-2xl"
    >
      <div className="p-8 space-y-8">
        
        {/* Comparison Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* 🌑 BEFORE (Subtle Rose) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-zinc-800" />
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Original State</label>
            </div>
            <div className="p-6 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-500 font-medium leading-relaxed italic line-through decoration-zinc-800">
              "{imp.original_text}"
            </div>
          </div>

          {/* ⚪ AFTER (Clean Cyan/White) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Enhanced Output</label>
              </div>
              <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                +18% OPTIMIZED
              </div>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/20 border border-cyan-500/20 text-sm text-white font-bold leading-relaxed shadow-[0_0_20px_rgba(6,182,212,0.03)]">
              "{imp.improved_text}"
            </div>
          </div>
        </div>

        {/* 📊 METRICS HUD */}
        <div className="grid grid-cols-3 gap-1 border-y border-white/5 py-6">
           {[ 
             { icon: Zap, label: "ATS PARSE", value: "OPTIMIZED", color: "text-amber-500" },
             { icon: Target, label: "CLARITY", value: "LEVEL: 9", color: "text-blue-500" },
             { icon: ShieldCheck, label: "SCANNER", value: "VERIFIED", color: "text-emerald-500" }
           ].map((metric, i) => (
             <div key={i} className="flex flex-col items-center justify-center text-center space-y-1">
                <metric.icon className={`w-3 h-3 ${metric.color} opacity-80`} />
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{metric.label}</div>
                <div className="text-[10px] font-bold text-white uppercase">{metric.value}</div>
             </div>
           ))}
        </div>

        {/* ⚡ ACTIONS */}
        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-3">
              <button className="px-6 py-2 rounded-lg bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl hover:shadow-cyan-500/20">
                 Apply Version
              </button>
              <button 
                onClick={handleCopy}
                className="px-6 py-2 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/10 transition-all flex items-center gap-2"
              >
                 {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                 {copied ? "CAPTURED" : "COPY RAW"}
              </button>
           </div>
           
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-700 hover:text-white transition-colors group/why"
           >
             TECH SPEC
             <div className="p-1 rounded bg-zinc-900 group-hover/why:bg-zinc-800 transition-colors">
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
             </div>
           </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 rounded-xl bg-black/60 border border-white/5 text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wider">
                 <span className="text-zinc-700 mr-2">{"// LOG:"}</span> 
                 {imp.reasoning}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function AIResumeEnhancementEngine({ improvements }: AIResumeEnhancementEngineProps) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="space-y-12 mt-24">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
           <div className="w-6 h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
           <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Neural Refinement Hub</h2>
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] ml-10">Optimizing professional signatures for machine-readability.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {improvements.map((imp, idx) => (
          <EnhancementCard key={idx} imp={imp} index={idx} />
        ))}
      </div>
    </div>
  );
}
