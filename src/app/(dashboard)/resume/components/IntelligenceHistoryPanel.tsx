"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BrainCircuit, Calendar, Target, Clock, ShieldAlert, BarChart, ChevronRight } from "lucide-react";
import { getResumeHistoryFromBackend } from "@/api";
import { useAuth } from "@/contexts/auth-context";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function IntelligenceHistoryPanel({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && user?.uid) {
      setLoading(true);
      getResumeHistoryFromBackend(user.uid)
        .then((res) => {
          if (res.data.success && res.data.data.history) {
            setHistory(res.data.data.history);
          } else {
            setError("Failed to load history.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Error loading history.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  const chartData = useMemo(() => {
    // Reverse to show chronological order left to right
    return [...history].reverse().map((entry, idx) => ({
      name: `V${idx + 1}`,
      date: new Date(entry.upload_date).toLocaleDateString(),
      ATS: entry.ats_score || entry.analysis?.confidence_metrics?.ats_score || 0
    }));
  }, [history]);

  const latestScore = chartData.length > 0 ? chartData[chartData.length - 1].ATS : 0;
  const initialScore = chartData.length > 0 ? chartData[0].ATS : 0;
  const progressionText = latestScore > initialScore 
    ? "Your ATS alignment has improved significantly since earlier analyses."
    : latestScore < initialScore 
      ? "Recent changes have reduced your ATS alignment. Consider reviewing the latest recruiter feedback."
      : "Your ATS alignment remains stable across recent updates.";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[460px] bg-white dark:bg-[#0a0a0b] border-l border-black/10 dark:border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-blue-500/10 dark:from-cyan-500/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 relative z-10 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20">
                  <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white leading-none">Intelligence History</h2>
                  <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Career Memory Archive</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative z-10">
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Retrieving Neural Archives...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold text-center">
                  {error}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center p-8 space-y-4">
                  <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No analysis history found.</p>
                </div>
              ) : (
                <>
                  {/* Progression Chart */}
                  {chartData.length > 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">Career Progression</h3>
                      </div>
                      <div className="p-6 rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 shadow-inner">
                        <div className="h-[120px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" vertical={false} />
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#2dd4bf', fontSize: '12px', fontWeight: 'bold' }}
                                labelStyle={{ color: '#a1a1aa', fontSize: '10px' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="ATS" 
                                stroke="#06b6d4" 
                                strokeWidth={3}
                                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#3b82f6' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* AI Memory Commentary */}
                        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                          <p className="text-xs text-blue-800 dark:text-blue-300 font-medium italic leading-relaxed">
                            "{progressionText}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* History Cards */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-500" /> Analysis Archive
                    </h3>
                    
                    <div className="space-y-4">
                      {history.map((entry, i) => {
                        const metrics = entry.analysis?.confidence_metrics || {};
                        const verdict = entry.analysis?.recruiter_scan || {};
                        const ats = entry.atsScore || entry.ats_score || metrics.ats_score || 0;
                        const intProb = entry.interviewProbability || entry.interview_probability || metrics.interview_probability || 0;
                        const techDepth = entry.techDepth || entry.tech_depth || metrics.technical_depth || 0;
                        const firstImpression = entry.verdict || entry.recruiter_feedback || verdict.first_impression;
                        const rejectionRisk = entry.recruiterRisk || entry.recruiter_risk || verdict.rejection_risk;
                        const targetRole = entry.targetRole || entry.target_role || "Unknown Role";
                        const uploadDate = entry.createdAt || entry.upload_date;
                        
                        return (
                          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] pointer-events-none" />
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                              <div className="space-y-1">
                                <h4 className="text-sm font-black text-zinc-900 dark:text-white">{targetRole}</h4>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                  <Clock className="w-3 h-3" /> {new Date(uploadDate).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`text-xl font-black ${ats >= 80 ? 'text-emerald-500' : ats >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                  {ats}%
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">ATS Score</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Int. Prob</span>
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{intProb}%</span>
                              </div>
                              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Tech Depth</span>
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{techDepth}%</span>
                              </div>
                            </div>

                            {firstImpression && (
                              <div className="mb-4 relative z-10">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium italic line-clamp-2">
                                  "{firstImpression}"
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 relative z-10">
                              {rejectionRisk && (
                                <div className="flex items-center gap-1.5">
                                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Risk: {rejectionRisk}</span>
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors">
                                  Compare
                                </button>
                                <button className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-cyan-500/10 hover:bg-blue-100 dark:hover:bg-cyan-500/20 text-[9px] font-black uppercase tracking-widest text-blue-700 dark:text-cyan-400 transition-colors">
                                  Load
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
