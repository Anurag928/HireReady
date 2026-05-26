"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Target, 
  ChevronRight,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  LayoutList,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

interface RoadmapStep {
  id: string;
  title: string;
  problem: string;
  fix: string;
  example?: string;
  priority: "critical" | "important" | "polish";
  impactScore: number;
}

interface FixMyResumeRoadmapProps {
  data: any;
}

export default function FixMyResumeRoadmap({ data }: FixMyResumeRoadmapProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const steps = useMemo(() => {
    if (!data) return [];
    const generatedSteps: RoadmapStep[] = [];
    const { section_feedback, impact_improvements } = data;

    // Build steps from weaknesses
    Object.entries(section_feedback || {}).forEach(([key, feedback]: [string, any]) => {
      if (feedback.weaknesses && feedback.weaknesses.length > 0) {
        const weakness = feedback.weaknesses[0];
        const problemStr = typeof weakness === 'object' ? weakness.point : weakness;
        generatedSteps.push({
          id: `weakness-${key}`,
          title: `REINFORCE: ${key.replace("_feedback", "").toUpperCase()}`,
          problem: problemStr,
          fix: feedback.rewrite_suggestions?.[0] || "Update content to align with target role requirements.",
          priority: "critical",
          impactScore: 15,
        });
      }
    });

    impact_improvements?.slice(0, 3).forEach((imp: any, idx: number) => {
      generatedSteps.push({
        id: `improvement-${idx}`,
        title: "DATA QUANTIFICATION",
        problem: "Vague outcome detected.",
        fix: imp.reasoning,
        example: imp.improved_text,
        priority: "important",
        impactScore: 12,
      });
    });

    return generatedSteps.slice(0, 5);
  }, [data]);

  useEffect(() => {
    if (steps.length > 0 && !expandedStep) setExpandedStep(steps[0].id);
  }, [steps, expandedStep]);

  if (!steps.length) return null;

  return (
    <div className="space-y-10 mt-24">
      <div className="flex items-center gap-4">
         <div className="w-1.5 h-8 bg-zinc-300 dark:bg-zinc-800" />
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em]">Execution Protocol</h2>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-widest pl-1">Sequential steps to maximize candidate signal.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className={`relative bg-white dark:bg-[#0a0a0b] border border-black/10 dark:border-white/5 rounded-2xl transition-all shadow-sm dark:shadow-none ${expandedStep === step.id ? 'border-zinc-300 dark:border-zinc-700 shadow-xl ring-1 ring-black/5 dark:ring-white/5' : 'hover:border-black/20 dark:hover:border-white/10'}`}>
            <button 
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-6">
                <div className={`text-xs font-black font-mono ${completedSteps.includes(step.id) ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-800'}`}>
                  {String(idx + 1).padStart(2, '0')}.
                </div>
                <div className={`text-[11px] font-black uppercase tracking-widest ${completedSteps.includes(step.id) ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-white'}`}>
                  {step.title}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className={`hidden md:block px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-[8px] font-black uppercase tracking-widest ${step.priority === 'critical' ? 'text-rose-500' : 'text-amber-500'}`}>
                  {step.priority}
                </div>
                {expandedStep === step.id ? <ChevronUp className="w-4 h-4 text-zinc-400 dark:text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedStep === step.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-12 pb-8 space-y-6">
                    <div className="p-5 rounded-xl bg-rose-50 dark:bg-black/40 border border-rose-100 dark:border-white/5 space-y-3">
                       <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> Issue Detected
                       </div>
                       <p className="text-sm text-zinc-600 dark:text-zinc-500 font-medium italic">"{step.problem}"</p>
                    </div>

                    <div className="p-5 rounded-xl bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-100 dark:border-cyan-500/10 space-y-3">
                       <div className="text-[9px] font-black text-cyan-600 dark:text-cyan-500/50 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Protocol Fix
                       </div>
                       <p className="text-sm text-zinc-800 dark:text-zinc-200 font-bold leading-relaxed">{step.fix}</p>
                    </div>

                    {step.example && (
                      <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/5 space-y-3">
                        <div className="text-[9px] font-black text-zinc-500 dark:text-zinc-700 uppercase tracking-widest flex items-center gap-2">
                           <LayoutList className="w-3 h-3" /> Implementation Example
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-100 dark:bg-black text-[11px] font-mono text-emerald-600 dark:text-emerald-500 leading-relaxed border border-black/10 dark:border-white/5">
                           {step.example}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
