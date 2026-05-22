"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const aiStatuses = [
  "Parsing technical achievements...",
  "Simulating ATS systems...",
  "Analyzing recruiter compatibility...",
  "Evaluating technical depth...",
  "Detecting skill gaps...",
  "Generating recruiter intelligence...",
  "Calculating hiring confidence...",
];

export function AIScanSequence() {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % aiStatuses.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-blue-500/20 border-t-blue-400"
        />
        
        {/* Inner reverse rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-indigo-500/20 border-b-indigo-400"
        />
        
        {/* Central glowing orb */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.8)]"
        />

        {/* Pulse wave */}
        <motion.div
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-blue-500/20"
        />
      </div>

      <div className="h-8 relative w-full max-w-sm text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStatusIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 text-foreground/ font-medium tracking-wide text-lg"
          >
            {aiStatuses[currentStatusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <div className="w-64 h-1 mt-6 bg-foreground/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full w-1/2 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent rounded-full"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
