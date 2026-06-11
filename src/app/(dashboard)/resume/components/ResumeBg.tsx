"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ResumeBg() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center lg:justify-end lg:pr-20">
        
        {/* Background Depth Atmosphere */}
        <div 
          className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full opacity-[0.15] dark:opacity-[0.1] mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 75%)',
            filter: 'blur(120px)',
          }}
        />

        {/* AI Inspector System Container */}
        <div className="relative flex items-center justify-center scale-75 lg:scale-100">
          
          {/* 📄 1. The Floating Resume Scroll */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: 25 }}
            animate={{ opacity: 1, x: 0, rotateY: -15 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[340px] h-[480px] lg:w-[420px] lg:h-[580px] preserve-3d"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [-0.5, 0.5, -0.5]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/30 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8 relative">
                {/* Abstract Resume Content */}
                <div className="space-y-4">
                  <div className="w-1/2 h-4 bg-zinc-400/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-zinc-400/10 rounded-full" />
                </div>
                
                <div className="relative h-72 overflow-hidden">
                  <motion.div 
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="space-y-4"
                  >
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="space-y-2 opacity-40">
                        <div className="h-2 w-full bg-zinc-300/20 rounded-full" />
                        <div className="h-2 w-2/3 bg-zinc-300/10 rounded-full" />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* ⚡ Scanning Laser (Top-to-Bottom) */}
              <motion.div 
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
              />
            </motion.div>
          </motion.div>

          {/* 🤖 2. The AI Inspector Robot (Nexus-7 Model) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: -80 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "backOut" }}
            className="absolute -left-12 bottom-12 z-30"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotateY: [15, 25, 15] 
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-32 h-32 lg:w-44 lg:h-44 group"
            >
              {/* Robot Body (Matte Black / Chrome) */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 shadow-2xl overflow-hidden">
                {/* Internal Core Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
                
                {/* Visual Interface (Scanning Eye) */}
                <div className="absolute top-8 left-0 right-0 flex justify-center">
                  <div className="w-16 h-2 bg-zinc-900 rounded-full border border-white/5 overflow-hidden p-[1px]">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1/2 h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"
                    />
                  </div>
                </div>

                {/* Micro Details (Ports/Vents) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
                </div>
              </div>

              {/* Floating UI Chips (Contextual Indicators) */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-12 -right-8 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap">ATS Parsing...</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-12 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap">Extracting Skills</span>
                </div>
              </motion.div>

              {/* Servo Micro-movement Shadow */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 blur-xl rounded-full" />
            </motion.div>

            {/* 🔗 Data Stream Particles (Resume -> Robot) */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  x: [100, 0],
                  y: [((i * 17) % 50) - 25, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + ((i * 7) % 10) / 10,
                  repeat: Infinity,
                  delay: i * 0.4 
                }}
                className="absolute top-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full blur-[0.5px]"
              />
            ))}
          </motion.div>

        </div>

      </div>

      {/* Hero Separation Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/5" />
    </div>
  );
}
