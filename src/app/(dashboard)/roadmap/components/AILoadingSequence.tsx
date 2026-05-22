import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Hexagon, Cpu, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const aiStatuses = [
  "Analyzing profile...",
  "Evaluating market trends...",
  "Mapping career trajectory...",
  "Optimizing learning milestones...",
  "Designing intelligent roadmap...",
];

export function AILoadingSequence() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % aiStatuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-background/95 backdrop-blur-2xl">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Holographic Scan Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-accent-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Core Animated Orb */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          {/* Outer Rotating Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border border-accent-blue/30 border-t-accent-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-accent-purple/30 border-l-accent-purple"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-orange-500/20 border-b-orange-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Pulsing Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-24 h-24 bg-accent-blue/10 rounded-full blur-xl absolute" />
            <BrainCircuit className="w-16 h-16 text-accent-blue relative z-10" />
          </motion.div>

          {/* Orbiting Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
              animate={{
                rotate: 360,
                x: [80 * Math.cos((i * 2 * Math.PI) / 3), 80 * Math.cos((i * 2 * Math.PI) / 3)],
                y: [80 * Math.sin((i * 2 * Math.PI) / 3), 80 * Math.sin((i * 2 * Math.PI) / 3)],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        {/* Dynamic Status Text */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={statusIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-light tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-blue to-accent-purple text-center px-4"
            >
              {aiStatuses[statusIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1 bg-white/5 rounded-full mt-12 overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-blue to-accent-purple"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 15, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
