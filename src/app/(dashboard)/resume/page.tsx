"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { analyzeResumeInBackend } from "@/api";
import { ResumeHeroSection } from "./components/ResumeHeroSection";
import { ResumeUploader } from "./components/ResumeUploader";
import { AIScanSequence } from "./components/AIScanSequence";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { RecruiterInsightsPanel } from "./components/RecruiterInsightsPanel";
import { ImpactDetector } from "./components/ImpactDetector";
import { FileText, AlertTriangle } from "lucide-react";
import { ATSBoostPreview } from "./components/ATSBoostPreview";

export default function ResumeAnalyzerPage() {
  const { user } = useAuth();
  
  const [appState, setAppState] = useState<"IDLE" | "SCANNING" | "RESULTS" | "ERROR">("IDLE");
  const [resumeData, setResumeData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUploadSuccess = async (resumeText: string, targetRole: string) => {
    if (!user) {
      setErrorMsg("You must be logged in to analyze a resume.");
      setAppState("ERROR");
      return;
    }
    
    setAppState("SCANNING");
    
    try {
      const response = await analyzeResumeInBackend({
        uid: user.uid,
        resume_text: resumeText,
        target_role: targetRole
      });
      
      if (response.data?.data?.resume) {
        setResumeData(response.data.data.resume);
        setAppState("RESULTS");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "AI Engine encountered turbulence during analysis.");
      setAppState("ERROR");
    }
  };

  const handleReset = () => {
    setAppState("IDLE");
    setResumeData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        
        {appState === "IDLE" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4">
            <ResumeHeroSection />
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        )}

        {appState === "SCANNING" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center">
            <AIScanSequence />
          </motion.div>
        )}

        {appState === "ERROR" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full p-8 bg-red-900/10 border border-red-500/20 rounded-3xl backdrop-blur-xl text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Failed</h2>
              <p className="text-red-200/70 mb-8 leading-relaxed">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {appState === "RESULTS" && resumeData && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-4 md:px-8 max-w-[1200px] mx-auto">
            
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  Intelligence Report
                </h1>
                <p className="text-foreground/70 text-lg">Analysis complete for your resume</p>
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-2.5 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-xl text-foreground transition-colors backdrop-blur-md"
              >
                Analyze Another
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <AnalyticsDashboard metrics={resumeData.analysis.confidence_metrics} />
              <div className="grid grid-cols-1 gap-8">
                <RecruiterInsightsPanel 
                  insights={resumeData.analysis.recruiter_scan} 
                  trajectory={resumeData.analysis.career_trajectory} 
                />
                <ImpactDetector improvements={resumeData.analysis.impact_improvements} />
                <ATSBoostPreview currentScore={resumeData.analysis.confidence_metrics.ats_score} />
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
