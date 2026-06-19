"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";

export function OrbSystem() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Subtle parallax scroll effects
  const yParallaxFast = useTransform(scrollY, [0, 1000], [0, -100]);
  const yParallaxSlow = useTransform(scrollY, [0, 1000], [0, -40]);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate organic particles exactly once on the client to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a solid deep background initially
    return <div className="fixed inset-0 pointer-events-none z-0 bg-[#050505]" />;
  }

  const isDark = resolvedTheme === "dark";

  // Google AI Studio inspired color palettes
  const colors = {
    background: isDark ? "#050505" : "#FAFAFA",
    
    // Core AI energy colors
    orbCore: isDark ? "rgba(139, 92, 246, 0.4)" : "rgba(167, 139, 250, 0.3)", // Deep purple
    orbHalo: isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(147, 197, 253, 0.2)", // Neon blue
    
    // Floating mesh layers
    mesh1: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(191, 219, 254, 0.4)", // Blue
    mesh2: isDark ? "rgba(168, 85, 247, 0.15)" : "rgba(216, 180, 254, 0.3)", // Purple
    mesh3: isDark ? "rgba(6, 182, 212, 0.1)" : "rgba(165, 243, 252, 0.3)", // Cyan
    
    // Tiny floating data points
    particle: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(96, 165, 250, 0.4)",
  };

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      animate={{ backgroundColor: colors.background }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* 1. ANIMATED AI GRADIENT MESH */}
      <motion.div style={{ y: yParallaxSlow }} className="absolute inset-0">
        
        {/* Top Right Flowing Gradient */}
        <motion.div
          animate={{
            y: [0, 80, 0, -50, 0],
            x: [0, -60, 0, 40, 0],
            backgroundColor: colors.mesh1,
          }}
          transition={{
            y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 30, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.8 },
          }}
          className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full blur-[160px] will-change-transform"
        />

        {/* Bottom Left Flowing Gradient */}
        <motion.div
          animate={{
            y: [0, -60, 0, 60, 0],
            x: [0, 50, 0, -40, 0],
            backgroundColor: colors.mesh2,
          }}
          transition={{
            y: { duration: 28, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 35, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.8 },
          }}
          className="absolute bottom-[-20%] left-[-15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[150px] will-change-transform"
        />

        {/* Ambient Center Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            backgroundColor: colors.mesh3,
          }}
          transition={{
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.8 },
          }}
          className="absolute top-[30%] left-[20%] right-[20%] h-[40vw] max-h-[600px] mx-auto rounded-full blur-[140px] will-change-transform"
        />
      </motion.div>

      {/* 2. AI ENERGY CORE (Orb) */}
      <motion.div 
        style={{ y: yParallaxFast }}
        className="absolute top-[10%] left-[10%] md:left-[25%] lg:left-[35%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] flex items-center justify-center will-change-transform"
      >
        {/* Core Intensity */}
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
            backgroundColor: colors.orbCore,
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.8 },
          }}
          className="absolute inset-20 md:inset-32 rounded-full blur-[60px]"
        />
        {/* Ambient Outer Halo */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            backgroundColor: colors.orbHalo,
          }}
          transition={{
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 },
            backgroundColor: { duration: 0.8 },
          }}
          className="absolute inset-0 rounded-full blur-[100px]"
        />
      </motion.div>

      {/* 3. LIGHT GLASS EFFECT OVERLAY */}
      <div className="absolute inset-0 bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-[1px]" />
      
      {/* 4. FLOATING DATA PARTICLES */}
      <motion.div style={{ y: yParallaxFast }} className="absolute inset-0 z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full blur-[0.5px]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 30, 0],
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8],
              backgroundColor: colors.particle,
            }}
            transition={{
              y: { duration: particle.duration, repeat: Infinity, ease: "easeInOut" },
              x: { duration: particle.duration * 1.2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: particle.duration * 0.8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: particle.duration * 0.9, repeat: Infinity, ease: "easeInOut" },
              backgroundColor: { duration: 0.8 },
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
