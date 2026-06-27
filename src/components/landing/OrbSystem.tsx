"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";

export function OrbSystem() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const yParallaxFast = useTransform(scrollY, [0, 1000], [0, -100]);
  const yParallaxSlow = useTransform(scrollY, [0, 1000], [0, -30]);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);

    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() - 0.5) * 0.05,
      duration: 30 + Math.random() * 30,
      opacity: Math.random() * 0.2 + 0.05,
    }));
    setParticles(generatedParticles);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-background" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 1. Subtle Dotted Grid */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Soft Dynamic Cursor Glow */}
      <motion.div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        animate={{
          background: `radial-gradient(circle 800px at ${mousePos.x}% ${mousePos.y}%, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}, transparent 80%)`
        }}
      />

      {/* 3. Center Gradient Mesh (Static, Subtle) */}
      <motion.div style={{ y: yParallaxSlow }} className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[80vw] h-[80vh] rounded-full blur-[120px] opacity-30 mix-blend-screen"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.02) 50%, transparent 100%)'
          }}
        />
      </motion.div>

      {/* 4. Elegant Slow Particles */}
      <motion.div style={{ y: yParallaxFast }} className="absolute inset-0 z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.radius * 2}px`,
              height: `${particle.radius * 2}px`,
              backgroundColor: isDark ? "#ffffff" : "#000000",
              opacity: particle.opacity,
              boxShadow: isDark ? `0 0 4px 1px rgba(255,255,255,0.1)` : `0 0 4px 1px rgba(0,0,0,0.1)`
            }}
            animate={{
              x: [
                particle.x,
                particle.x + particle.speedX * 30,
                particle.x
              ],
              y: [
                particle.y,
                particle.y + particle.speedY * 30,
                particle.y
              ]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}