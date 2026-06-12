"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function OrbSystem() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Generate constellation particles only on client-side to prevent hydration mismatch
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* LAYER 2: Large Blurred Animated Orbs */}
      {/* Orb 1: Cyan-Blue (Top Left) */}
      <motion.div
        animate={{
          y: [0, -30, 0, 30, 0],
          x: [0, 20, 0, -20, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-cyan-500/15 rounded-full blur-[120px] mix-blend-screen"
      />

      {/* Orb 2: Purple-Violet (Top Right) */}
      <motion.div
        animate={{
          y: [0, 40, 0, -40, 0],
          x: [0, -30, 0, 30, 0],
          scale: [1, 1.05, 1],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-5%] right-[-10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen"
      />

      {/* Orb 3: Pink-Blue (Bottom Center) */}
      <motion.div
        animate={{
          y: [0, -50, 0, 50, 0],
          x: [0, 40, 0, -40, 0],
          scale: [1, 1.15, 1],
          rotate: [0, 20, -20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-15%] left-[20%] right-[20%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] mx-auto bg-pink-500/10 rounded-full blur-[120px] mix-blend-screen"
      />

      {/* LAYER 3: Radial Spotlight Following Cursor */}
      <motion.div
        className="absolute inset-0 z-10 transition-opacity duration-300 opacity-50"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />

      {/* LAYER 4: Tiny Constellation Particles */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
