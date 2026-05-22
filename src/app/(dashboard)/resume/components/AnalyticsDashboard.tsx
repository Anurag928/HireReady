"use client";

import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, RadarChart, PolarGrid, Radar, Tooltip } from "recharts";
import { BrainCircuit, Target } from "lucide-react";

interface AnalyticsDashboardProps {
  metrics: {
    ats_score: number;
    recruiter_confidence: number;
    technical_depth: number;
    market_readiness: number;
    interview_probability: number;
  };
}

export function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
  const radarData = [
    { subject: 'ATS Match', A: metrics.ats_score, fullMark: 100 },
    { subject: 'Recruiter Confidence', A: metrics.recruiter_confidence, fullMark: 100 },
    { subject: 'Tech Depth', A: metrics.technical_depth, fullMark: 100 },
    { subject: 'Market Readiness', A: metrics.market_readiness, fullMark: 100 },
    { subject: 'Interview Prob.', A: metrics.interview_probability, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Primary Score Ring */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-foreground/5 border border-border rounded-3xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          ATS Compatibility Score
        </h3>
        
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" cy="50%" 
              innerRadius="70%" outerRadius="90%" 
              barSize={20} 
              data={[{ name: 'Score', value: metrics.ats_score, fill: 'url(#colorGradient)' }]}
              startAngle={180} endAngle={0}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'rgba(128,128,128,0.1)' }} dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-8">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              {metrics.ats_score}%
            </span>
            <span className="text-sm text-foreground/70 mt-1">
              {metrics.ats_score >= 80 ? "Excellent Match" : metrics.ats_score >= 60 ? "Good Match" : "Needs Improvement"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Radar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 bg-foreground/5 border border-border rounded-3xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          Intelligence Matrix
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(128,128,128,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', opacity: 0.7, fontSize: 11 }} />
              <Radar name="Metrics" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
