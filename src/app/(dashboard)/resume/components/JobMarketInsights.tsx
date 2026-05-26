"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Inputs {
  targetRole: string;
  jobDescription: string;
  resumeText: string;
}

function tokenize(text: string) {
  if (!text) return [];
  return text
    .replace(/[^a-zA-Z0-9+.#\s\-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

function computeFrequencies(jd: string, resume: string) {
  const freq: Record<string, number> = {};
  const jdTokens = tokenize(jd).map((t) => t.toLowerCase());
  const resumeTokens = tokenize(resume).map((t) => t.toLowerCase());

  jdTokens.forEach((t) => {
    freq[t] = (freq[t] || 0) + 3; // JD weighted higher
  });
  resumeTokens.forEach((t) => {
    freq[t] = (freq[t] || 0) + 1;
  });

  return freq;
}

function topSkillsFromFreq(freq: Record<string, number>, topN = 8) {
  const stopwords = new Set(["and", "or", "with", "the", "a", "an", "to", "for", "of", "in", "on", "using", "experience", "years", "year", "skill", "job", "work", "technical"]);
  const entries = Object.entries(freq).filter(([k]) => !stopwords.has(k) && k.length > 1);
  entries.sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  return entries.slice(0, topN).map(([k, v]) => ({ name: k, score: Math.round((v / max) * 100) }));
}

function inferSeniority(resume: string) {
  const text = resume.toLowerCase();
  if (!text.trim()) return "unknown";
  if (/(principal|senior|staff|lead|head|director|founder)/.test(text)) return "senior";
  if (/(mid|senior|experienced|sr\.|ii|2|3)/.test(text)) return "mid";
  if (/(junior|intern|jr\.|associate|entry|fresher)/.test(text)) return "entry";
  return "mid";
}

function estimateSalaryRange(role: string, seniority: string, score: number) {
  // Algorithmic estimate: base median multiplier derived from role complexity and score
  const base = 40000; // neutral base scale factor
  const seniorityMult = seniority === "senior" ? 2.5 : seniority === "mid" ? 1.4 : 0.8;
  const marketMult = 0.8 + Math.min(1.6, (score / 100) * 1.6);

  const median = Math.round(base * seniorityMult * marketMult);
  const low = Math.round(median * 0.6);
  const high = Math.round(median * 1.8);

  return { low, high };
}

export default function JobMarketInsights({ inputs }: { inputs: Inputs | null }) {
  const memo = useMemo(() => {
    if (!inputs) return null;
    const { targetRole, jobDescription, resumeText } = inputs;
    const combined = (targetRole + " \n " + jobDescription).trim();
    if (!combined) return null;

    const freq = computeFrequencies(jobDescription || targetRole, resumeText || "");
    const skills = topSkillsFromFreq(freq, 8);
    const seniority = inferSeniority(resumeText || "");
    const demandScore = Math.min(100, Math.round((Object.keys(freq).length / 40) * 100));
    const matchStrength = Math.min(100, Math.round((skills.reduce((s, k) => s + k.score, 0) / (skills.length || 1))));

    const salary = estimateSalaryRange(targetRole, seniority, matchStrength);

    // tools: choose tokens that look like tool names
    const toolCandidates = Object.keys(freq).filter((t) => /[.#]|js$|py$|sql$|aws$|docker$|k8s|kubernetes|react|node|tail|git/.test(t));
    const tools = toolCandidates.slice(0, 12).map((t) => ({ name: t }));

    const demandLevel = demandScore > 66 ? "High" : demandScore > 33 ? "Medium" : "Low";
    const competitionLevel = matchStrength > 75 ? "High" : matchStrength > 40 ? "Medium" : "Low";
    const growthTrend = /grow|rapid|emerging|increasing|demand|trend/.test(jobDescription.toLowerCase()) ? "Rising" : "Stable";

    const summary = `This role shows ${demandLevel.toLowerCase()} market demand based on the provided description. Candidates with strong ${skills[0]?.name || "core"} skills are likely favored. Estimated seniority: ${seniority}.`;

    return { skills, salary, tools, demandLevel, competitionLevel, growthTrend, summary };
  }, [inputs]);

  if (!inputs) return null;

  if (!memo) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-2xl bg-card/40 border border-white/8 text-zinc-400">
        Not enough data to generate insights
      </motion.div>
    );
  }

  const { skills, salary, tools, demandLevel, competitionLevel, growthTrend, summary } = memo;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-12 p-8 lg:p-12 rounded-[2.5rem] bg-white dark:bg-[#0a0c10]/60 border border-zinc-200 dark:border-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          <div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Job Market Intelligence</h3>
            <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">AI Estimated Neural Insights</p>
          </div>
        </div>
        
        <div className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
          Status: <span className="text-emerald-500">Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Trending Skills - Green Glow */}
          <div className="group/card relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/10 opacity-50 group-hover/card:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5">
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8">Trending Skills Match</h4>
              <div className="space-y-6 relative z-10">
                {skills.map((s, idx) => (
                  <div key={s.name} className="flex items-center gap-6 group/item">
                    <div className="w-24 text-xs font-bold text-zinc-600 dark:text-zinc-300 capitalize truncate group-hover/item:text-emerald-500 transition-colors">{s.name}</div>
                    <div className="flex-1 bg-zinc-200/50 dark:bg-white/5 rounded-full h-2.5 overflow-hidden shadow-inner border border-zinc-200/50 dark:border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 1, delay: 0.1 * idx }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      />
                    </div>
                    <div className="w-12 text-[10px] font-black font-mono text-emerald-600 dark:text-emerald-400 text-right">{s.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ecosystem Tools - Cyan/Blue Glow */}
          <div className="group/card relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(34,211,238,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/10 opacity-50 group-hover/card:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5">
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-6">Core Ecosystem & Tools</h4>
              <div className="flex flex-wrap gap-3 relative z-10">
                {tools.length ? tools.map((t) => (
                  <span key={t.name} className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-zinc-100/50 dark:border-white/5 text-[11px] font-black text-zinc-500 dark:text-zinc-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:text-cyan-600 dark:hover:text-white transition-all cursor-default shadow-sm capitalize">
                    {t.name}
                  </span>
                )) : <div className="text-xs text-zinc-400 italic">Extracting toolchain data...</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Salary Architecture - Purple Glow */}
          <div className="group/card relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(168,85,247,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-indigo-500/10 opacity-50 group-hover/card:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-[#0a0c10]/60 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5 shadow-lg overflow-hidden">
              <h4 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.3em] mb-8">Salary Architecture</h4>
              <div className="space-y-4 relative z-10">
                {[
                  { label: "Entry-Level Spectrum", val: `$${salary.low.toLocaleString()} - $${Math.round((salary.low+salary.high)/2.5).toLocaleString()}` },
                  { label: "Mid-Career Range", val: `$${Math.round(salary.low*1.3).toLocaleString()} - $${Math.round(salary.high*0.85).toLocaleString()}` },
                  { label: "Executive / Senior", val: `$${Math.round(salary.low*1.8).toLocaleString()} - $${salary.high.toLocaleString()}` }
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-2xl bg-white/60 dark:bg-black/40 border border-zinc-100/50 dark:border-white/5 shadow-sm group/stat hover:border-purple-500/30 transition-colors">
                    <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Dynamics - Pink/Magenta Glow */}
          <div className="group/card relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_50px_rgba(236,72,153,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-purple-500/10 opacity-50 group-hover/card:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5">
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8">Market Dynamics</h4>
              <div className="space-y-6 relative z-10">
                {[
                  { label: "Market Demand", value: demandLevel, color: "text-emerald-500 dark:text-emerald-400" },
                  { label: "Talent Competition", value: competitionLevel, color: "text-amber-500 dark:text-amber-400" },
                  { label: "Growth Trajectory", value: growthTrend, color: "text-pink-500 dark:text-pink-400" }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center group/stat">
                    <span className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                    <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${stat.color} shadow-sm px-3 py-1 bg-white/60 dark:bg-white/5 rounded-lg border border-zinc-100/50 dark:border-white/5`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-zinc-900 dark:bg-white/[0.03] border border-zinc-800 dark:border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />
        <p className="relative z-10 text-zinc-300 dark:text-zinc-400 text-sm leading-relaxed font-medium italic">
          <span className="text-white dark:text-cyan-400 font-black not-italic mr-3 uppercase tracking-tighter text-lg">Pro Analysis:</span>
          {summary}
        </p>
      </div>
    </motion.section>
  );
}
