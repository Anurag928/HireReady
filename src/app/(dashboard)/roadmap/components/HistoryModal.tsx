"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BrainCircuit, Target, ArrowRight, Download, BarChart2, Zap, Pin, Star, Search as SearchIcon, Filter, Layers, TrendingUp, History, Activity, Sparkles, ChevronRight } from "lucide-react";
import { exportRoadmapToPDF } from "@/utils/pdfExport";
import { getRoadmapVersionFromBackend } from "@/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: any[];
  onSelectVersion: (version: any) => void;
  loading: boolean;
}

function EvolutionAnalytics({ history }: { history: any[] }) {
  const data = useMemo(() => {
    return history.slice().reverse().map((item, idx) => ({
      name: `v${item.roadmapVersion || idx + 1}`,
      readiness: item.readiness_score || item.roadmap_score || 0,
      marketFit: item.roadmap?.market_demand?.hiring_demand || 70,
    }));
  }, [history]);

  return (
    <div className="h-48 w-full mt-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="readiness" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReadiness)" strokeWidth={3} />
          <Area type="monotone" dataKey="marketFit" stroke="#a78bfa" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EvolutionTimelineNode({ item, prev, isLast, onSelect, onCompare, onExport }: any) {
  const improvement = useMemo(() => {
    if (!prev) return { diff: 0, pct: 0 };
    const currScore = item?.readiness_score || item?.roadmap_score || 0;
    const prevScore = prev?.readiness_score || prev?.roadmap_score || 0;
    return { diff: currScore - prevScore, pct: prevScore === 0 ? 0 : Math.round(((currScore - prevScore) / prevScore) * 100) };
  }, [item, prev]);

  return (
    <div className="relative pl-8 pb-12 group">
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-accent-blue/40 via-accent-blue/10 to-transparent" />
      )}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 flex items-center justify-center group-hover:scale-125 transition-transform">
        <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-tighter text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
            Evolution Snapshot v{item.roadmapVersion || '1'}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          {improvement.diff > 0 && (
            <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{improvement.pct}% Growth
            </span>
          )}
        </div>

        <motion.div 
          whileHover={{ x: 4 }}
          className="p-5 rounded-3xl bg-card/60 dark:bg-white/[0.04] border border-border dark:border-white/5 backdrop-blur-xl hover:border-accent-blue/30 transition-all flex flex-col md:flex-row gap-6"
        >
          <div className="flex-1">
            <h4 className="text-lg font-bold text-card-foreground mb-1">{item.roadmap?.career_path || 'Strategic Path'}</h4>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent-purple" />
                <span className="text-foreground/80">{item.strategy_mode || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent-blue" />
                <span className="text-foreground/80">Readiness: {item.readiness_score || item.roadmap_score}%</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">
              AI Insight: "{item.ai_commentary || 'Strategic progression maintains strong market alignment.'}"
            </p>
          </div>

          <div className="flex md:flex-col justify-end gap-2">
            <button onClick={() => onSelect(item)} className="px-4 py-2 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Load</button>
            <button onClick={() => onCompare(item, prev)} className="px-4 py-2 rounded-xl bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">Compare</button>
            <button onClick={() => onExport(item)} className="p-2 rounded-xl bg-muted dark:bg-white/5 border border-border dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"><Download className="w-4 h-4" /></button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function HistoryModal({ isOpen, onClose, history, onSelectVersion, loading }: HistoryModalProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [query, setQuery] = useState("");
  const [strategyFilter, setStrategyFilter] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<{ curr: any, prev: any } | null>(null);
  const [pinned, setPinned] = useState<Record<string, boolean>>({});
  
  const filtered = useMemo(() => {
    let list = [...history];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(it => (it.roadmap?.career_path||'').toLowerCase().includes(q) || (it.focus_area||'').toLowerCase().includes(q));
    }
    if (strategyFilter) {
      list = list.filter(it => (it.strategy_mode||'').includes(strategyFilter));
    }
    return list;
  }, [history, query, strategyFilter]);

  async function handleExport(item: any) {
    try {
      const res = await getRoadmapVersionFromBackend(item._id);
      if (res.data?.success && res.data.data?.version) {
        await exportRoadmapToPDF('roadmap-container', `${res.data.data.version.roadmap?.career_path || 'Roadmap'} v${res.data.data.version.roadmapVersion}`);
      }
    } catch (e) { console.error(e); }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]" />
      <motion.div 
        initial={{ opacity: 0, x: '100%' }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: '100%' }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
        className="fixed top-0 right-0 h-full w-full max-w-4xl bg-background border-l border-border shadow-2xl z-[101] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-border bg-card/50 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-foreground">Evolution Intelligence</h2>
                <p className="text-sm text-muted-foreground font-medium">Strategic Archive of your AI Career Progression</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent-blue transition-colors" />
              <input 
                placeholder="Search your evolution history..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all shadow-inner" 
              />
            </div>
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'timeline' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-muted-foreground hover:text-foreground'}`}
              >Timeline</button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-muted-foreground hover:text-foreground'}`}
              >Grid Archive</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
          
          {/* Analytics Snapshot */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent-blue" />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Readiness Velocity</h3>
            </div>
            <EvolutionAnalytics history={history} />
          </section>

          {/* Evolution Flow */}
          <section>
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Evolution Intelligence Flow</h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <BrainCircuit className="w-12 h-12 animate-pulse text-accent-blue" />
                <p className="text-xs font-black uppercase tracking-widest animate-pulse">Syncing Neural Memory...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <Clock className="w-12 h-12" />
                <p className="text-xs font-black uppercase tracking-widest">No Evolution History Detected</p>
              </div>
            ) : viewMode === 'timeline' ? (
              <div className="max-w-3xl mx-auto">
                {filtered.map((item, idx) => (
                  <EvolutionTimelineNode 
                    key={item._id}
                    item={item}
                    prev={filtered[idx + 1]}
                    isLast={idx === filtered.length - 1}
                    onSelect={(it: any) => { onSelectVersion(it); onClose(); }}
                    onCompare={(curr: any, prev: any) => setCompareData({ curr, prev })}
                    onExport={handleExport}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Re-use existing grid logic or simplified cards */}
                {filtered.map((item, idx) => {
                  const metrics = [item.readiness_score || 0, item.roadmap_score || 0, 80, 75];
                  return (
                    <motion.div 
                      key={item._id}
                      whileHover={{ y: -4 }}
                      className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-accent-blue/30 transition-all relative overflow-hidden group shadow-2xl"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-[40px] pointer-events-none group-hover:bg-accent-blue/10 transition-colors" />
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded border border-accent-blue/20">v{item.roadmapVersion}</span>
                         <span className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-extrabold text-foreground mb-4 line-clamp-1">{item.roadmap?.career_path}</h4>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <BarChart2 className="w-4 h-4 text-accent-blue" />
                           <span className="text-xs font-bold text-foreground">{item.readiness_score || item.roadmap_score}%</span>
                        </div>
                        <button onClick={() => { onSelectVersion(item); onClose(); }} className="text-[10px] font-black uppercase text-accent-blue hover:underline">Launch Snapshot</button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Compare Modal Overlay */}
        <AnimatePresence>
          {compareData && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/60 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white">Evolution Delta</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Comparing Snapshot v{compareData.prev?.roadmapVersion} → v{compareData.curr?.roadmapVersion}</p>
                  </div>
                  <button onClick={() => setCompareData(null)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-12 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
                    
                    {/* Previous Snapshot */}
                    <div className="space-y-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-black text-muted-foreground uppercase mb-2 block">Previous Focus</span>
                        <h4 className="text-xl font-bold text-white mb-4">{compareData.prev?.roadmap?.career_path}</h4>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">Readiness: {compareData.prev?.readiness_score}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase text-muted-foreground">Strategic Priorities</h5>
                        <ul className="space-y-3">
                          {compareData.prev?.roadmap?.technologies_to_learn?.[0]?.technologies?.slice(0,3).map((t: string, i: number) => (
                            <li key={i} className="text-xs text-white/60 flex items-center gap-3">
                              <div className="w-1 h-1 rounded-full bg-white/20" /> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Current Snapshot */}
                    <div className="space-y-8">
                       <div className="p-6 rounded-3xl bg-accent-blue/10 border border-accent-blue/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <span className="text-[10px] font-black text-accent-blue uppercase mb-2 block">Evolved Focus</span>
                        <h4 className="text-xl font-bold text-white mb-4">{compareData.curr?.roadmap?.career_path}</h4>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="px-3 py-1 rounded-full bg-accent-blue/20 border border-accent-blue/30 text-white">Readiness: {compareData.curr?.readiness_score}%</span>
                          <span className="text-green-500 font-black">+{compareData.curr?.readiness_score - (compareData.prev?.readiness_score || 0)}% Improvement</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase text-accent-blue">Strategic Evolutions</h5>
                        <ul className="space-y-3">
                          {compareData.curr?.roadmap?.technologies_to_learn?.[0]?.technologies?.slice(0,3).map((t: string, i: number) => {
                            const isNew = !compareData.prev?.roadmap?.technologies_to_learn?.[0]?.technologies?.includes(t);
                            return (
                              <li key={i} className={`text-xs flex items-center justify-between p-3 rounded-2xl border ${isNew ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/5 text-white/70'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-1 h-1 rounded-full ${isNew ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} /> {t}
                                </div>
                                {isNew && <span className="text-[8px] font-black bg-green-500/20 px-1.5 py-0.5 rounded">NEW UNLOCK</span>}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h5 className="text-[10px] font-black uppercase text-white/40 mb-3">AI Evolution Feedback</h5>
                        <p className="text-xs text-white/80 italic leading-relaxed">
                          "Your transition from {compareData.prev?.strategy_mode || 'generalists'} to {compareData.curr?.strategy_mode || 'specialized'} architecture identifies a {compareData.curr?.readiness_score + 10}% boost in market competitiveness."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl flex justify-center">
                   <button 
                    onClick={() => { onSelectVersion(compareData.curr); onClose(); }}
                    className="group relative px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                   >
                    <span className="relative flex items-center gap-3">
                      Accept & Continue with v{compareData.curr?.roadmapVersion} Intelligence
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
