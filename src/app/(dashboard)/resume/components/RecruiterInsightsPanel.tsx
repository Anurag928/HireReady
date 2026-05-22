"use client";

import { motion } from "framer-motion";
import { UserCheck, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";

interface RecruiterInsightsProps {
  insights: {
    first_impression: string;
    likely_strengths: string[];
    immediate_red_flags: string[];
    would_shortlist: boolean;
  };
  trajectory: {
    current_market_level: string;
    market_positioning: string;
    "6_month_projection": string;
    "12_month_projection": string;
  };
}

export function RecruiterInsightsPanel({ insights, trajectory }: RecruiterInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Recruiter Scan Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-foreground/5 border border-border rounded-3xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl ${insights.would_shortlist ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
            {insights.would_shortlist ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {insights.would_shortlist ? "Shortlist Recommended" : "Needs Optimization Before Applying"}
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              &quot;{insights.first_impression}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-3xl backdrop-blur-xl"
        >
          <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Core Strengths
          </h4>
          <ul className="space-y-3">
            {insights.likely_strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground/80">
                <span className="text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Red Flags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-orange-900/10 border border-orange-500/20 rounded-3xl backdrop-blur-xl"
        >
          <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Immediate Red Flags
          </h4>
          <ul className="space-y-3">
            {insights.immediate_red_flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground/80">
                <span className="text-orange-400 mt-1">•</span>
                {flag}
              </li>
            ))}
            {insights.immediate_red_flags.length === 0 && (
              <li className="text-foreground/80 italic">No major red flags detected.</li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Career Trajectory */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-foreground/5 border border-border rounded-3xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
        <h4 className="text-lg font-bold text-purple-400 mb-6 flex items-center gap-2 relative z-10">
          <Lightbulb className="w-5 h-5" />
          Career Trajectory Forecast
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <div className="p-4 bg-background/50 rounded-2xl border border-white/5">
            <div className="text-sm text-foreground/70 mb-1">Current Level</div>
            <div className="font-semibold text-foreground">{trajectory.current_market_level}</div>
          </div>
          <div className="p-4 bg-background/50 rounded-2xl border border-white/5">
            <div className="text-sm text-foreground/70 mb-1">6-Month Outlook</div>
            <div className="font-semibold text-foreground">{trajectory["6_month_projection"]}</div>
          </div>
          <div className="p-4 bg-background/50 rounded-2xl border border-white/5">
            <div className="text-sm text-foreground/70 mb-1">12-Month Outlook</div>
            <div className="font-semibold text-foreground">{trajectory["12_month_projection"]}</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 relative z-10">
          <p className="text-purple-900 dark:text-purple-200 text-sm leading-relaxed">
            <strong className="text-purple-700 dark:text-purple-300">Market Positioning:</strong> {trajectory.market_positioning}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
