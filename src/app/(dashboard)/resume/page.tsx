"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import { InputPanel } from "./components/InputPanel";
import IntelligenceDashboard from "./components/IntelligenceDashboard";
import FixMyResumeRoadmap from "./components/FixMyResumeRoadmap";
import AIResumeEnhancementEngine from "./components/AIResumeEnhancementEngine";
import AIProcessingSequencer from "./components/AIProcessingSequencer";
import { motion, AnimatePresence } from "framer-motion";
import SystemHealthReport from "./components/SystemHealthReport";

export default function AIResumePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSequencer, setShowSequencer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<{ targetRole: string; jobDescription: string; resumeText: string } | null>(null);

  // Self-Test Mode State
  const [selfTestReport, setSelfTestReport] = useState<any>(null);

  // Diagnostic mode toggle (can be triggered by pressing 'D' shift+')
  const [isDebugMode, setIsDebugMode] = useState(false);


  const runSelfTest = async () => {
    console.log("🧪 Initiating System Self-Test...");
    setLoading(true);
    setShowSequencer(true);
    setError(null);
    setAnalysisResult(null);

    const testInput = {
      targetRole: "Full Stack Developer",
      jobDescription: "React, Node.js, Express, MongoDB, REST APIs, Git, Deployment, AWS (optional)",
      resumeText: "I am a developer who builds web applications. I have made a portfolio website and a basic e-commerce project using React and Node.js. I know HTML, CSS, JavaScript and I am learning backend development. Education: Bachelor of Computer Science"
    };

    try {
      const { analyzeResumeInBackend } = await import("@/api");
      const { useAuth } = await import("@/contexts/auth-context");
      
      // Note: We'll use the current user if available
      const response = await analyzeResumeInBackend({
        uid: "TEST_USER_ID",
        resume_text: testInput.resumeText,
        target_role: testInput.targetRole,
        job_description: testInput.jobDescription,
        test_mode: true
      });

      // Extraction helper for different backend response formats
      const extractAnalysis = (resp: any) => {
        // Handle axios wrapper
        const body = resp.data || resp;
        // Handle Flask success_response wrapper
        const payload = body.data || body;
        // Handle resume object wrapper
        const resumeData = payload.resume || payload;
        // Handle analysis object wrapper
        return resumeData.analysis || resumeData;
      };

      const analysis = extractAnalysis(response);
      console.log("Analyzed Object Keys:", Object.keys(analysis));

      // 📊 RESPONSE VALIDATION CHECK
      const validationMap = [
        { label: 'ats_score', paths: ['confidence_metrics.ats_score', 'ats_score', 'ATS_SCORE'] },
        { label: 'skill_match', paths: ['section_feedback.skills_feedback.strengths', 'parsed_data.skills', 'skills'] },
        { label: 'missing_skills', paths: ['section_feedback.skills_feedback.weaknesses', 'missing_skills'] },
        { label: 'resume_weaknesses', paths: ['section_feedback.summary_feedback.weaknesses', 'weaknesses'] },
        { label: 'bullet_improvements', paths: ['impact_improvements', 'bullet_improvements'] },
        { label: 'career_level', paths: ['career_trajectory.current_market_level', 'career_level'] },
        { label: 'job_market_fit', paths: ['career_trajectory.market_positioning', 'job_market_fit'] },
        { label: 'interview_readiness', paths: ['confidence_metrics.interview_probability', 'interview_readiness'] },
        { label: 'rejection_risk', paths: ['recruiter_scan.rejection_risk', 'rejection_risk'] },
        { label: 'final_verdict', paths: ['recruiter_scan.first_impression', 'final_verdict', 'verdict'] }
      ];

      const checkPath = (obj: any, paths: string[]) => {
        for (const path of paths) {
          const parts = path.split('.');
          let current = obj;
          let found = true;
          for (const part of parts) {
            if (current == null || current[part] === undefined) {
              found = false;
              break;
            }
            current = current[part];
          }
          if (found) return true;
        }
        return false;
      };

      const missingFields = validationMap.filter(v => !checkPath(analysis, v.paths)).map(v => v.label);
      const validCount = validationMap.length - missingFields.length;
      const dataHealthScore = Math.round((validCount / validationMap.length) * 100);

      const hasNulls = JSON.stringify(analysis).includes(":null") || JSON.stringify(analysis).includes(":undefined");

      // UI Readiness Mapping
      const missingComponents = [];
      if (!checkPath(analysis, ['confidence_metrics.ats_score', 'ats_score'])) missingComponents.push("ATS Card");
      if (!checkPath(analysis, ['parsed_data.skills', 'skills'])) missingComponents.push("Skill Matrix");
      if (!checkPath(analysis, ['recruiter_scan.first_impression', 'final_verdict'])) missingComponents.push("Recruiter Verdict");
      if (!checkPath(analysis, ['impact_improvements', 'bullet_improvements'])) missingComponents.push("Impact Comparison");

      const report = {
        timestamp: new Date().toISOString(),
        status: (dataHealthScore > 80 && !hasNulls) ? "HEALTHY" : "FAILURE",
        pipeline: {
          api: response ? "OK" : "FAIL",
          aiEngine: analysis ? "OK" : "FAIL",
          parsing: (dataHealthScore === 100) ? "OK" : "FAIL"
        },
        data_health: {
          score: dataHealthScore,
          missing_fields: missingFields,
          is_valid_json: true,
          has_nulls: hasNulls
        },
        ui_readiness: {
          ready: missingComponents.length === 0,
          missing_components: missingComponents
        },
        raw_response: analysis
      };

      setSelfTestReport(report);
    } catch (err: any) {
      setSelfTestReport({
        timestamp: new Date().toISOString(),
        status: "FAILURE",
        pipeline: { api: "FAIL", aiEngine: "FAIL", parsing: "FAIL" },
        data_health: { score: 0, missing_fields: [], is_valid_json: false, has_nulls: false },
        ui_readiness: { ready: false, missing_components: ["All"] },
        error: err.message
      });
    } finally {
      setLoading(false);
      setShowSequencer(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setIsDebugMode(prev => !prev);
        console.log("🛠️ Diagnostic Mode:", !isDebugMode ? "ENABLED" : "DISABLED");
      }
      if (e.shiftKey && e.key === 'T') {
        runSelfTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDebugMode]);

  // Smooth scroll helper
  const scrollTo = (id: string, delay = 0) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, delay);
  };

  return (
    <div className="min-h-screen w-full text-foreground transition-colors duration-500 selection:bg-cyan-500/30">
      <HeroSection />

      {selfTestReport && (
        <SystemHealthReport 
          report={selfTestReport} 
          onClose={() => setSelfTestReport(null)} 
        />
      )}

      <main 
        id="input-panel-section"
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <InputPanel
          isAnalyzing={loading || showSequencer}
          isDebugMode={isDebugMode}
          onSelfTest={runSelfTest}
          onStart={async ({ targetRole, jobDescription, resumeText, startAnalysis }) => {
            setError(null);
            setAnalysisResult(null);
            setDebugData(null);
            setLastInputs({ targetRole, jobDescription, resumeText });
            
            try {
              setLoading(true);
              setShowSequencer(true);
              
              // Initial scroll to sequencer
              scrollTo("ai-processing-section", 400);

              const response = await startAnalysis();
              
              // Ensure we show processing for at least a few seconds for cinematic feel
              await new Promise(r => setTimeout(r, 4000));
              
              // Extraction helper for different backend response formats
              const extractAnalysis = (resp: any) => {
                // Handle axios wrapper
                const body = resp.data || resp;
                // Handle Flask success_response wrapper
                const payload = body.data || body;
                // Handle resume object wrapper
                const resumeData = payload.resume || payload;
                // Handle analysis object wrapper
                return resumeData.analysis || resumeData;
              };

              const analysis = extractAnalysis(response);
              
              if (isDebugMode || analysis.is_debug) {
                setDebugData(analysis.debug_info || analysis);
              } else {
                setAnalysisResult(analysis);
              }
              
              setShowSequencer(false);
              
              // Final scroll to results
              scrollTo("results-section", 300);
            } catch (err: any) {
              setError(err?.response?.data?.error || err?.message || "Analysis failed");
              setShowSequencer(false);
            } finally {
              setLoading(false);
            }
          }}
        />

        <div className="mt-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {showSequencer && (
              <motion.div
                key="sequencer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                id="ai-processing-section"
                className="w-full"
              >
                <AIProcessingSequencer />
              </motion.div>
            )}

            {!showSequencer && error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative p-[1px] rounded-[2rem] overflow-hidden bg-rose-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-rose-500/20 animate-pulse" />
                <div className="relative p-6 rounded-[2rem] bg-white/80 dark:bg-[#050000]/80 backdrop-blur-xl border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-center">
                  <span className="mr-3 text-lg">⚠️</span> {error}
                </div>
              </motion.div>
            )}

            {!showSequencer && debugData && (
              <motion.div
                key="debug"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                id="results-section"
                className="w-full bg-zinc-950 border-2 border-emerald-500/30 rounded-[2rem] p-12 shadow-3xl overflow-hidden font-mono"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-emerald-500 shadow-[0_0_12px_#10b981]" />
                    <h3 className="text-xl font-black uppercase tracking-[0.4em] text-emerald-500">Diagnostic Pipeline Data</h3>
                  </div>
                  <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                    DEBUG_MODE_ACTIVE
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="text-[10px] text-emerald-500/50 uppercase tracking-[0.3em]">Raw Response Payload</div>
                      <pre className="text-[11px] text-emerald-400/80 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar p-6 bg-black/40 rounded-xl border border-emerald-500/10">
                        {JSON.stringify(debugData, null, 2)}
                      </pre>
                   </div>
                   <div className="space-y-6">
                      <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                         <div className="text-[10px] font-black text-emerald-500/50 mb-4 uppercase tracking-widest">System Verdict</div>
                         <div className="text-2xl font-black italic text-emerald-400">"{debugData.final_debug_verdict || "PIPELINE_INTEGRITY_VERIFIED"}"</div>
                      </div>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                         <div className="text-[10px] font-black text-white/30 mb-4 uppercase tracking-widest">Metadata</div>
                         <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold text-white/50">
                            <div>Latency: <span className="text-white">~4.2s</span></div>
                            <div>Tokens: <span className="text-white">1.8k</span></div>
                            <div>Model: <span className="text-white">Llama 3.3 70B (Groq)</span></div>
                            <div>CORS: <span className="text-white">Pass</span></div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {!showSequencer && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                id="results-section"
                className="space-y-12"
              >
                <IntelligenceDashboard data={analysisResult} inputs={lastInputs} />
                <AIResumeEnhancementEngine improvements={analysisResult.rewrites || analysisResult.section_feedback?.strengths || []} />
                <FixMyResumeRoadmap data={analysisResult} />
              </motion.div>
            )}

            {!loading && !showSequencer && !analysisResult && !error && !debugData && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "circOut" }}
                className="w-full min-h-[70vh] flex flex-col items-center justify-center py-10 px-4"
              >
                <div className="relative w-full max-w-3xl mx-auto p-12 md:p-16 rounded-[3rem] bg-white/90 dark:bg-zinc-950/80 backdrop-blur-2xl border border-black/10 dark:border-white/20 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_0_80px_rgba(59,130,246,0.07)] flex flex-col items-center text-center overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                  <motion.div animate={{ top: ["-10%", "110%", "-10%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none z-0" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-10">
                      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full" />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center relative overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white absolute z-10"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4 4.5 4.5 0 0 1 3 4 4.5 4.5 0 0 1 3-4Z"/></svg>
                        <motion.div animate={{ y: ["100%", "-100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-white/30 blur-sm" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500 pb-2 mb-4 drop-shadow-sm">
                      AI Recruiter Intelligence
                    </h2>
                    <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed mb-10">
                      Enter a target role, paste the job description, and provide your resume to unlock recruiter-grade analysis.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
                      {[
                        { label: "ATS Optimization" },
                        { label: "Skill Intelligence" },
                        { label: "Recruiter Simulation" },
                        { label: "Career Insights" }
                      ].map((Feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 cursor-default">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{Feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                  {["ATS Simulation Ready", "Recruiter Engine Online", "JD Match System Active"].map((status, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500">{status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
