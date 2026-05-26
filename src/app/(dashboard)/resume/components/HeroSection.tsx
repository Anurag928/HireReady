"use client";

import React from "react";
import ResumeBg from "./ResumeBg";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden flex flex-col items-center justify-center">
      <ResumeBg />

      <div className="relative z-20 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
        >
          {/* Main Hero Title - Forced 2-line layout */}
          <h1 className="text-5xl sm:text-7xl lg:text-[105px] font-black tracking-tight leading-[0.9] lg:leading-[0.95] mb-4">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-500 dark:to-pink-500"
              style={{ 
                WebkitBackgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(168, 85, 247, 0.15))"
              }}
            >
              AI Resume<br />
              Intelligence Dashboard
            </span>
          </h1>
          
          {/* Subtle light bloom behind text */}
          <div className="absolute -inset-x-20 top-1/2 -translate-y-1/2 h-32 bg-cyan-500/5 dark:bg-purple-500/10 blur-[150px] pointer-events-none rounded-full" />
        </motion.div>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 text-base sm:text-lg lg:text-xl text-black/60 dark:text-white/80 max-w-2xl mx-auto font-black tracking-[0.2em] uppercase leading-relaxed"
        >
          AI that judges your resume so recruiters don’t have to.
        </motion.p>
      </div>

      {/* Decorative vertical line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 100 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"
      />
    </header>
  );
}


