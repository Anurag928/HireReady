"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Video as VideoIcon, Settings2, Play, Square, Settings } from "lucide-react";
import { fadeIn, slideUp, staggerContainer } from "@/animations";

export default function MockInterviewPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">AI Mock Interview</h2>
          <p className="text-foreground/60">Practice technical and behavioral rounds with our AI.</p>
        </div>
        {!isStarted && (
          <button className="px-4 py-2 bg-card border border-border rounded-lg flex items-center gap-2 hover:bg-foreground/5 transition-colors w-fit">
            <Settings2 className="w-4 h-4" />
            Interview Settings
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="setup"
            variants={slideUp}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col md:flex-row gap-6"
          >
            {/* Settings Panel */}
            <div className="flex-1 bg-card border border-border rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold mb-4">Configure Session</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">Target Role</label>
                  <select className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:border-accent-blue/50">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">Interview Type</label>
                  <select className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:border-accent-blue/50">
                    <option>Technical (React & JS)</option>
                    <option>System Design</option>
                    <option>Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">Difficulty Level</label>
                  <div className="flex gap-2">
                    {['Entry Level', 'Mid-Level', 'Senior'].map(level => (
                      <button key={level} className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${level === 'Mid-Level' ? 'bg-accent-blue/10 border-accent-blue text-accent-blue font-medium' : 'bg-background border-border hover:border-accent-blue/50'}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-auto">
                <button 
                  onClick={() => setIsStarted(true)}
                  className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  <Play className="w-5 h-5" /> Start Interview
                </button>
              </div>
            </div>

            {/* Video Preview */}
            <div className="flex-1 bg-black rounded-3xl relative overflow-hidden flex flex-col border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoIcon className="w-16 h-16 text-white/20" />
                <p className="absolute mt-24 text-white/40 text-sm">Camera Preview (Simulated)</p>
              </div>
              
              <div className="mt-auto p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4 z-10">
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10">
                  <VideoIcon className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="interview"
            variants={fadeIn}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row gap-6"
          >
            {/* Interview Interface */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="h-64 md:h-1/2 bg-card border border-border rounded-3xl relative overflow-hidden flex items-center justify-center">
                {/* AI Avatar visualization */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-blue/20 via-background to-background" />
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-accent-blue/10 border-2 border-accent-blue/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-accent-blue animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-[-20px] rounded-full border border-accent-blue animate-ping opacity-10" style={{ animationDuration: '2s' }} />
                    <span className="text-3xl">🤖</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-border text-center">
                  <p className="text-foreground font-medium">&quot;Can you explain the difference between useMemo and useCallback in React, and provide a scenario where you would use each?&quot;</p>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-3xl relative overflow-hidden flex flex-col border border-border min-h-[250px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/40 text-sm">Your Camera</span>
                </div>
                
                <div className="mt-auto p-4 flex justify-between items-end z-10 w-full">
                  <div className="bg-red-500 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" /> REC 12:04
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10 relative">
                      <Mic className="w-6 h-6" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                    </button>
                    <button 
                      onClick={() => setIsStarted(false)}
                      className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow-lg"
                    >
                      <Square className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  
                  <div className="w-20" /> {/* Spacer for balance */}
                </div>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="w-full md:w-80 flex flex-col gap-4">
              <div className="p-6 bg-card border border-border rounded-3xl flex-1 flex flex-col">
                <h3 className="font-bold mb-4">Live Feedback</h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
                    <span className="font-semibold text-green-500 block mb-1">Pacing is good</span>
                    Speaking rate is optimal (130 wpm).
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm">
                    <span className="font-semibold text-orange-500 block mb-1">Avoid filler words</span>
                    Try to pause instead of using &quot;um&quot; or &quot;like&quot;.
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/60">Confidence Score</span>
                    <span className="font-bold text-accent-blue">85%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent-blue w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
