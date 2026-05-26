"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, animate, AnimatePresence } from "framer-motion";
import { 
  Layers, Target, BrainCircuit, ShieldCheck, Briefcase, 
  AlertCircle, Zap, Code2, Terminal, ShieldAlert, Rocket, 
  MessageSquare, Activity, Cpu, Eye, Info, Crosshair, HelpCircle
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts";

interface IntelligenceDashboardProps {
  data: any;
  inputs?: any;
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "circOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{display}{suffix}</>;
}

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="relative flex items-center justify-center cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="absolute bottom-full mb-2 w-64 p-3 bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-700 shadow-2xl rounded-xl z-50 pointer-events-none"
          >
            <div className="text-[10px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed tracking-wide">
              <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest block mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Recruiter Insight
              </span>
              {text}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-zinc-900 drop-shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, delay = 0, suffix = "%", colorClass = "text-cyan-600 dark:text-cyan-500", shadowClass = "shadow-cyan-500/50", bgGlow = "bg-cyan-500" }: any) => {
  const isAvailable = value !== undefined && value !== null && value !== "" && typeof value === 'number';
  if (!isAvailable) return null;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
      }}
      className={`relative group p-8 rounded-[2rem] bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 transition-all duration-500 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl hover:shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <Icon className={`w-8 h-8 text-black/10 dark:text-white/10 group-hover:${colorClass} transition-colors`} />
        <div className={`w-3 h-3 rounded-full bg-black/10 dark:bg-white/10 group-hover:${bgGlow} shadow-[0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:${shadowClass} transition-all`} />
      </div>
      <div className="space-y-2 relative z-10">
        <div className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
          <CountUp value={value} suffix={suffix} />
        </div>
        <div className={`text-[12px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-white/40 group-hover:${colorClass} transition-colors`}>{label}</div>
      </div>
    </motion.div>
  );
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function IntelligenceDashboard({ data, inputs }: IntelligenceDashboardProps) {
  const {
    confidence_metrics,
    career_trajectory,
    section_feedback,
    parsed_data,
    recruiter_scan,
    career_risks,
    competitiveness_index,
    project_intelligence,
    interview_intelligence,
    attention_score,
    impact_meter,
    interview_risks
  } = data || {};

  if (!data || (!data.success && !data.confidence_metrics && !data.ATS_SCORE)) {
    return null;
  }

  const atsScore = confidence_metrics?.ats_score || data?.ATS_SCORE || data?.ats_score;
  const interviewProb = confidence_metrics?.interview_probability || data?.INTERVIEW_PROBABILITY || data?.interview_probability;
  const techDepth = confidence_metrics?.technical_depth || data?.TECHNICAL_DEPTH || data?.technical_depth;
  const recruiterConf = confidence_metrics?.recruiter_confidence || data?.RECRUITER_CONFIDENCE || data?.recruiter_confidence;

  const getATSColor = (score: number) => {
    if (score >= 90) return "#10b981"; // Emerald
    if (score >= 80) return "#3b82f6"; // Blue
    if (score >= 70) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const getRiskColor = (level: string) => {
    if (level?.toLowerCase() === 'low') return 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20';
    if (level?.toLowerCase() === 'medium') return 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';
    return 'text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20';
  };

  const getAttentionColor = (level: string) => {
    if (level?.toLowerCase() === 'high') return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
    if (level?.toLowerCase() === 'medium') return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'bg-blue-400 dark:bg-blue-500/40';
  };

  const radarData = competitiveness_index ? [
    { subject: 'Attractiveness', A: competitiveness_index.recruiter_attractiveness, fullMark: 100 },
    { subject: 'Hiring Prob', A: competitiveness_index.hiring_probability, fullMark: 100 },
    { subject: 'Interview Prep', A: competitiveness_index.interview_readiness, fullMark: 100 },
    { subject: 'Prod Eng', A: competitiveness_index.production_engineering_readiness, fullMark: 100 },
    { subject: 'Tech Depth', A: techDepth || 50, fullMark: 100 },
  ] : [];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
      
      {/* 🚀 EXECUTIVE SUMMARY CARD (CINEMATIC) */}
      {recruiter_scan?.executive_summary && (
        <motion.div variants={fadeUp} className="relative p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 shadow-[0_15px_60px_rgba(15,23,42,0.08)] dark:shadow-2xl overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] pointer-events-none group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-all duration-700" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-[0.3em]">Executive Summary</h2>
                <div className="px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                  AI Intelligence
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-tight pl-[4.5rem]">
                {recruiter_scan.executive_summary}
              </p>
            </div>
            
            {/* Impact Meter */}
            {impact_meter && (
              <div className="w-full md:w-64 p-6 rounded-3xl bg-zinc-50 dark:bg-black/50 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Psychological Impact</span>
                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter mb-4 flex items-baseline gap-1">
                  <CountUp value={impact_meter.impact_score} suffix="" /><span className="text-2xl text-emerald-700 dark:text-emerald-600">%</span>
                </div>
                <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed">{impact_meter.commentary}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 📊 CORE METRICS GRID */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 empty:hidden">
        {atsScore !== undefined && <StatCard label="ATS SIGNAL" value={atsScore} icon={Layers} colorClass="text-emerald-600 dark:text-emerald-500" shadowClass="shadow-emerald-500/50" bgGlow="bg-emerald-500" />}
        {interviewProb !== undefined && <StatCard label="INTERVIEW PROB" value={interviewProb} icon={Target} colorClass="text-blue-600 dark:text-blue-500" shadowClass="shadow-blue-500/50" bgGlow="bg-blue-500" />}
        {techDepth !== undefined && <StatCard label="TECH DEPTH" value={techDepth} icon={BrainCircuit} colorClass="text-purple-600 dark:text-purple-500" shadowClass="shadow-purple-500/50" bgGlow="bg-purple-500" />}
        {recruiterConf !== undefined && <StatCard label="VERDICT CONF" value={recruiterConf} icon={ShieldCheck} colorClass="text-cyan-600 dark:text-cyan-500" shadowClass="shadow-cyan-500/50" bgGlow="bg-cyan-500" />}
      </motion.div>

      {/* ATS EXPLAINABILITY & COMPETITIVENESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS BREAKDOWN */}
        {confidence_metrics?.ats_score_breakdown && (
          <motion.div variants={fadeUp} className="lg:col-span-2 p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-1.5 h-6 bg-emerald-500 shadow-[0_0_12px_#10b981]" />
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Strict ATS Weighting</h3>
            </div>

            <div className="space-y-6 relative z-10">
              {confidence_metrics.ats_score_breakdown.map((item: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      {item.category}
                      {item.weight && (
                        <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                          {item.weight}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-black" style={{ color: getATSColor(item.score) }}>{item.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getATSColor(item.score) }}
                    />
                  </div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-white/50 tracking-wide">{item.reasoning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMPETITIVENESS RADAR & ATTENTION */}
        <div className="space-y-6 flex flex-col">
          {radarData.length > 0 && (
            <motion.div variants={fadeUp} className="p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl flex flex-col relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="w-1.5 h-6 bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Competitiveness</h3>
              </div>
              
              <div className="w-full h-[220px] relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid stroke="rgba(150,150,150,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(150,150,150,0.7)", fontSize: 9, fontWeight: "bold" }} />
                    <Radar name="Candidate" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* RECRUITER ATTENTION SIMULATOR */}
          {attention_score && (
            <motion.div variants={fadeUp} className="p-8 rounded-[2rem] bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-rose-500" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Attention Heatmap</h3>
              </div>
              <div className="space-y-4">
                {attention_score.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{item.section}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">{item.attention_level}</span>
                      <div className="w-12 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: item.attention_level?.toLowerCase() === 'high' ? '100%' : item.attention_level?.toLowerCase() === 'medium' ? '60%' : '30%' }}
                          className={`h-full ${getAttentionColor(item.attention_level)}`} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 💹 MARKET POSITIONING & FINAL VERDICT */}
      {(recruiter_scan || career_trajectory) && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recruiter_scan && (
            <div className="lg:col-span-2 p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/5 flex flex-col justify-between group shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-cyan-500 shadow-[0_0_12px_#06b6d4]" />
                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">RECRUITER VERDICT</h3>
                  </div>
                  {recruiter_scan.rejection_risk && (
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getRiskColor(recruiter_scan.rejection_risk)}`}>
                      <Activity className="w-3 h-3" />
                      RISK: {recruiter_scan.rejection_risk}
                    </div>
                  )}
              </div>
              
              <div className="space-y-6 relative z-10">
                  {recruiter_scan.first_impression && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1.5 }}
                      className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-[1.3] italic tracking-tight"
                    >
                      "{recruiter_scan.first_impression}"
                    </motion.p>
                  )}
              </div>
            </div>
          )}

          {career_trajectory && (
            <div className="p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 flex flex-col shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-6 bg-purple-500 shadow-[0_0_12px_#a855f7]" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">TRAJECTORY</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                  {[
                    { label: "CURRENT LEVEL", val: career_trajectory.current_market_level, icon: Target },
                    { label: "6-MONTH PROJECTION", val: career_trajectory.six_month_projection, icon: Rocket },
                    { label: "12-MONTH PROJECTION", val: career_trajectory.twelve_month_projection, icon: Briefcase }
                  ].filter(item => item.val).map((item, i) => (
                    <div key={i} className="space-y-1.5 bg-black/[0.02] dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-zinc-500 dark:text-white/50 uppercase tracking-widest">{item.label}</span>
                          <item.icon className="w-3 h-3 text-zinc-400 dark:text-white/20" />
                      </div>
                      <div className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-snug">
                          {item.val}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* WEAKNESSES & RISKS PANEL */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recruiter Concerns with Tooltips */}
        <div className="p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Weaknesses & Gaps</h3>
          </div>

          <div className="space-y-3">
            {section_feedback?.summary_feedback?.weaknesses?.map((w: any, i: number) => (
              <div key={`sw-${i}`} className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-amber-900 dark:text-amber-200">{typeof w === 'string' ? w : w.point}</span>
                {typeof w === 'object' && w.why_it_matters && (
                  <Tooltip text={w.why_it_matters}>
                    <Info className="w-4 h-4 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
                  </Tooltip>
                )}
              </div>
            ))}
            {section_feedback?.skills_feedback?.weaknesses?.map((w: any, i: number) => (
              <div key={`skw-${i}`} className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-rose-900 dark:text-rose-200">{typeof w === 'string' ? w : w.point}</span>
                {typeof w === 'object' && w.why_it_matters && (
                  <Tooltip text={w.why_it_matters}>
                    <Info className="w-4 h-4 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" />
                  </Tooltip>
                )}
              </div>
            ))}
            {career_risks?.map((risk: any, i: number) => (
              <div key={`cr-${i}`} className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-rose-900 dark:text-rose-200">{risk.risk}: {risk.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Risk Prediction */}
        {interview_risks && (
          <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Crosshair className="w-5 h-5 text-indigo-500" />
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Interview Risk Profile</h3>
            </div>
            
            <div className="space-y-3">
              {interview_risks.map((risk: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-black/5 dark:border-white/5 group hover:bg-black/[0.04] dark:hover:bg-white/10 transition-colors">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{risk.category}</span>
                  <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getRiskColor(risk.risk_level)}`}>
                    {risk.risk_level} RISK
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </motion.div>

      {/* PROJECT INTELLIGENCE MATRIX */}
      {project_intelligence && project_intelligence.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-6">
          <div className="flex items-center gap-3 mb-2 pl-2">
            <Code2 className="w-6 h-6 text-indigo-500" />
            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Project Intelligence Review</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {project_intelligence.map((proj: any, i: number) => (
              <div key={i} className="relative overflow-hidden p-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0b]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-xl group hover:shadow-2xl transition-all duration-500">
                {proj.classification?.toLowerCase().includes("tutorial") && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] pointer-events-none" />
                )}
                
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  {/* Left: Project details */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <h4 className="text-2xl font-black text-zinc-900 dark:text-white">{proj.project_name}</h4>
                      {proj.classification && (
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border ${
                          proj.classification.toLowerCase().includes('enterprise') || proj.classification.toLowerCase().includes('ready')
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : proj.classification.toLowerCase().includes('tutorial')
                              ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                              : 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
                        }`}>
                          {proj.classification}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 space-y-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white italic">"{proj.recruiter_impression}"</p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-500 flex items-center gap-2">
                        <Rocket className="w-3 h-3" /> Actionable Upgrade
                      </h5>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed bg-indigo-50 dark:bg-indigo-500/5 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10">
                        {proj.actionable_upgrade}
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics */}
                  <div className="w-full lg:w-64 space-y-4">
                    {[
                      { label: "Technical Depth", val: proj.technical_depth },
                      { label: "Production Readiness", val: proj.production_readiness },
                      { label: "Overall Strength", val: proj.strength }
                    ].map((metric, idx) => (
                      <div key={idx} className="space-y-2 bg-black/[0.02] dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-white/50">{metric.label}</span>
                          <span className={`text-xs font-black uppercase tracking-widest ${
                            metric.val?.toLowerCase() === 'high' ? 'text-emerald-600 dark:text-emerald-500' :
                            metric.val?.toLowerCase() === 'medium' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-500'
                          }`}>{metric.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* INTERVIEW READINESS PANEL */}
      {interview_intelligence && interview_intelligence.questions && (
        <motion.div variants={fadeUp} className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-950/40 backdrop-blur-xl border border-indigo-100 dark:border-indigo-500/20 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:shadow-2xl relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Recruiter Interview Simulation</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-widest mt-1">AI Generated questions based on your gaps</p>
              </div>
            </div>
            {interview_intelligence.interview_difficulty && (
              <div className="px-5 py-2 rounded-full bg-white dark:bg-black/40 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 dark:text-indigo-400/70">Difficulty:</span>
                <span className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">{interview_intelligence.interview_difficulty}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {interview_intelligence.questions.map((q: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    {q.category}
                  </span>
                </div>
                <p className="text-base font-bold text-zinc-900 dark:text-white mb-4 leading-relaxed group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  "{q.question}"
                </p>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-white/40 block mb-1">Recruiter Intent</span>
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{q.why_asking}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
