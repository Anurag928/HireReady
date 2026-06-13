"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, AlertCircle, Cpu, Database, Layout, CheckCircle2, XCircle } from "lucide-react";

interface SelfTestReport {
  timestamp: string;
  status: "HEALTHY" | "FAILURE";
  pipeline: {
    api: "OK" | "FAIL";
    aiEngine: "OK" | "FAIL";
    parsing: "OK" | "FAIL";
  };
  data_health: {
    score: number;
    missing_fields: string[];
    is_valid_json: boolean;
    has_nulls: boolean;
  };
  ui_readiness: {
    ready: boolean;
    missing_components: string[];
  };
  raw_response?: any;
}

interface Props {
  report: SelfTestReport;
  onClose: () => void;
}

export default function SystemHealthReport({ report, onClose }: Props) {
  const isHealthy = report.status === "HEALTHY";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
      >
        {/* Header Indicator */}
        <div className={`h-2 w-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
        
        <div className="p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className={`w-5 h-5 ${isHealthy ? 'text-emerald-500' : 'text-rose-500'}`} />
                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Neural Diagnostic System v1.0.4</h2>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                {isHealthy ? "✅ SYSTEM HEALTHY" : "❌ SYSTEM FAILURE DETECTED"}
              </h1>
            </div>
            
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
            >
              Terminate Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* API Status */}
            <StatusCard 
              icon={Database} 
              label="Backend Stream" 
              status={report.pipeline.api} 
              sub="Connection established"
            />
            {/* Groq Status */}
            <StatusCard 
              icon={Cpu} 
              label="Groq AI Engine" 
              status={report.pipeline.aiEngine} 
              sub="Response latency: Normal"
            />
            {/* Parsing Status */}
            <StatusCard 
              icon={ShieldCheck} 
              label="Data Schema" 
              status={report.pipeline.parsing} 
              sub="JSON structure validated"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Health */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Data Integrity</h3>
                  <span className="text-2xl font-black text-white">{report.data_health.score}%</span>
               </div>
               
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">JSON Validity</span>
                    <span className={report.data_health.is_valid_json ? "text-emerald-500" : "text-rose-500"}>
                      {report.data_health.is_valid_json ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">Null Value Check</span>
                    <span className={!report.data_health.has_nulls ? "text-emerald-500" : "text-rose-500"}>
                      {!report.data_health.has_nulls ? "CLEAN" : "DETECTED"}
                    </span>
                  </div>
                  
                  {report.data_health.missing_fields.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-3">Missing Critical Keys:</div>
                      <div className="flex flex-wrap gap-2">
                        {report.data_health.missing_fields.map(field => (
                          <span key={field} className="px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-[9px] text-rose-400 font-black uppercase tracking-widest">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>

            {/* UI Readiness */}
            <div className="space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Frontend Mapping</h3>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <Layout className="w-5 h-5 text-cyan-500" />
                    <div>
                      <div className="text-[12px] font-black text-white uppercase tracking-widest">Ready to Render</div>
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        {report.ui_readiness.ready ? "All components mapped" : "Render blocks detected"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {["ATS Card", "Skill Matrix", "Recruiter Verdict", "Impact Comparison"].map(comp => {
                      const isMissing = report.ui_readiness.missing_components.includes(comp);
                      return (
                        <div key={comp} className="flex items-center gap-3">
                          {isMissing ? (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isMissing ? "text-rose-500/50" : "text-white/60"}`}>
                            {comp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] text-white/20 whitespace-pre overflow-hidden">
             [DEBUG_STREAM] Timestamp: {report.timestamp} <br />
             [SYSTEM_LOG] Analyzing response packet with length {JSON.stringify(report.raw_response || {}).length} bytes... <br />
             [SYSTEM_LOG] {isHealthy ? "Operational integrity confirmed." : "Critical failures detected in pipeline."}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, status, sub }: any) {
  const isOk = status === "OK";
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group transition-all hover:border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${isOk ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest ${isOk ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isOk ? "CONNECTED" : "FAILED"}
        </div>
      </div>
      <div className="text-[12px] font-black text-white uppercase tracking-widest mb-1">{label}</div>
      <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{sub}</div>
    </div>
  );
}
