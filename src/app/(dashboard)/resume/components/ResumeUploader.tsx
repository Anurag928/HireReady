"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";

interface ResumeUploaderProps {
  onUploadSuccess: (resumeText: string, targetRole: string) => void;
}

export function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!targetRole.trim()) {
      setError("Please fill in the target role to continue.");
      return;
    }
    if (!resumeText.trim()) {
      setError("Please paste your resume text to continue.");
      return;
    }
    setError(null);
    onUploadSuccess(resumeText, targetRole);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative p-8 md:p-12 bg-background/80 backdrop-blur-3xl border border-border rounded-[2rem] shadow-2xl overflow-hidden">
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">Target Role</label>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Paste Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-64 bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y"
              placeholder="Paste the raw text of your resume here..."
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-foreground rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
          >
            Analyze with AI Engine
            <ChevronRight className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
