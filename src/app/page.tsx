'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight, Sparkles, BrainCircuit, Target, Trophy,
  FileText, Code2, LineChart, ChevronRight, Zap
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OrbSystem } from "@/components/landing/OrbSystem";
import { slideUp, staggerContainer, fadeIn } from "@/animations";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer
} from "recharts";

const analyticsData = [
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: 'Next.js', A: 85, fullMark: 100 },
  { subject: 'TypeScript', A: 80, fullMark: 100 },
  { subject: 'System Design', A: 60, fullMark: 100 },
  { subject: 'Data Structures', A: 70, fullMark: 100 },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="text-foreground overflow-hidden min-h-screen relative">
      <OrbSystem />
      <Navbar />

      <main className="flex-1 pt-20">

        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 px-4 overflow-hidden">
          <div className="container mx-auto max-w-[1200px] relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            
            {/* LEFT COLUMN: Typography & CTAs */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-left flex flex-col items-start space-y-8"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground text-sm font-medium">
                <Sparkles className="w-4 h-4 text-foreground" />
                <span>The new standard for career growth</span>
              </motion.div>

              <motion.h1
                variants={slideUp}
                className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[1.05] text-foreground"
              >
                HireReady <br/>
                <span className="text-muted-foreground">Intelligence</span>
              </motion.h1>

              <motion.p
                variants={slideUp}
                className="text-lg md:text-xl text-muted-foreground max-w-[480px] font-normal leading-relaxed"
              >
                The most advanced platform for technical professionals. Optimize your resume, master interviews, and land your dream job with AI-driven insights.
              </motion.p>

              <motion.div
                variants={slideUp}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4"
              >
                <Link
                  href="/login"
                  className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
                >
                  Start Building <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-lg font-medium text-foreground bg-secondary/10 border border-border hover:bg-secondary/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 w-full sm:w-auto"
                >
                  View Documentation
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN: Realistic App Window */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block w-full perspective-[2000px]"
            >
              {/* Premium Window Wrapper */}
              <div className="relative w-full aspect-[4/3] rounded-2xl border border-border/50 bg-background/40 backdrop-blur-3xl shadow-2xl overflow-hidden transform-gpu flex flex-col">
                {/* macOS style Window Controls */}
                <div className="h-12 border-b border-border/50 flex items-center px-4 bg-muted/20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-border/80 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-border/80 hover:bg-yellow-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-border/80 hover:bg-green-500 transition-colors" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-4 py-1.5 rounded-md border border-border/30">
                    <div className="w-2 h-2 rounded-sm bg-foreground/20" />
                    hireready.ai / dashboard
                  </div>
                </div>

                {/* Dashboard UI */}
                <div className="flex-1 p-6 grid grid-cols-[1fr_2fr] gap-6 bg-background/20 relative">
                  {/* Sidebar Simulation */}
                  <div className="flex flex-col gap-4">
                    <div className="h-8 w-24 bg-foreground/10 rounded-md" />
                    <div className="space-y-2 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-8 w-full rounded-md ${i === 0 ? 'bg-foreground/5 border border-border/50' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Main Content Simulation */}
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="h-5 w-32 bg-foreground/10 rounded mb-2" />
                        <div className="h-8 w-48 bg-foreground/20 rounded" />
                      </div>
                      <div className="h-10 w-32 bg-foreground/5 border border-border/50 rounded-lg" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-border/50 bg-background/40">
                        <div className="h-4 w-20 bg-foreground/10 rounded mb-4" />
                        <div className="h-10 w-24 bg-green-500/20 text-green-500 flex items-center justify-center font-bold text-2xl rounded-md border border-green-500/20">92/100</div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/50 bg-background/40">
                        <div className="h-4 w-24 bg-foreground/10 rounded mb-4" />
                        <div className="flex items-end gap-2">
                          {[40, 70, 45, 90, 65].map((h, i) => (
                            <div key={i} className="w-6 bg-foreground/20 rounded-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Graph Area */}
                    <div className="flex-1 rounded-xl border border-border/50 bg-background/40 p-4 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent" />
                       <div className="w-full h-full border-b border-l border-border/30 relative">
                         {/* Fake spline line */}
                         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0 80 C 20 80, 40 20, 60 40 C 80 60, 90 10, 100 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
                         </svg>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 1: AI FEATURES SHOWCASE (Bento Box) */}
        <section id="features" className="py-24 relative border-t border-border/50 bg-background/50 backdrop-blur-3xl z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">An OS For Your Career</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to crack your dream placements, unified in one premium platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
              {/* Bento Item 1 - Large (Spans 2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border flex flex-col hover:border-border/80 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 pb-0 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-2">Resume Intelligence</h3>
                  <p className="text-muted-foreground">Instantly parse your CV against millions of successful profiles to identify missing keywords and formatting issues.</p>
                </div>
                {/* Visualizer */}
                <div className="mt-auto h-48 w-full bg-background border-t border-border translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-6 flex gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="w-3/4 h-3 rounded-full bg-foreground/10" />
                    <div className="w-full h-3 rounded-full bg-foreground/5" />
                    <div className="w-5/6 h-3 rounded-full bg-foreground/5" />
                    <div className="w-1/2 h-3 rounded-full bg-foreground/5" />
                  </div>
                  <div className="w-32 rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-green-500">98</span>
                    <span className="text-xs text-muted-foreground mt-1 text-center">ATS Match</span>
                  </div>
                </div>
              </motion.div>

              {/* Bento Item 2 - Small */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border flex flex-col hover:border-border/80 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-2">Skill Mapping</h3>
                  <p className="text-muted-foreground text-sm">Visualize your technical gaps in real-time against actual job requirements.</p>
                  
                  {/* Visualizer */}
                  <div className="mt-auto pt-6 flex gap-2 items-end justify-center h-24">
                     {[40, 60, 30, 80, 50].map((h, i) => (
                       <div key={i} className="w-8 rounded-t-sm bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-500" style={{ height: `${h}%` }} />
                     ))}
                  </div>
                </div>
              </motion.div>

              {/* Bento Item 3 - Small */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border flex flex-col hover:border-border/80 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                    <BrainCircuit className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-2">Mock Interviews</h3>
                  <p className="text-muted-foreground text-sm">Practice with conversational AI that adapts to your performance.</p>
                  
                  {/* Visualizer */}
                  <div className="mt-auto pt-6 flex justify-center items-center h-24 relative">
                    <div className="absolute w-16 h-16 rounded-full border border-border animate-ping opacity-20" />
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center z-10">
                      <div className="w-4 h-4 rounded-full bg-foreground/40" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bento Item 4 - Large (Spans 2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border flex flex-col hover:border-border/80 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 pb-0 relative z-10 flex-1 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                      <LineChart className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight mb-2">Career Roadmaps</h3>
                    <p className="text-muted-foreground">Dynamic, step-by-step learning paths generated based on your precise goals and current skill gaps.</p>
                  </div>
                  {/* Visualizer */}
                  <div className="flex-1 bg-background border-t border-l border-border rounded-tl-2xl p-6 relative overflow-hidden translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="space-y-4">
                      {[1, 2, 3].map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-foreground text-foreground' : 'border-border text-transparent'}`}>
                             {i === 0 && <div className="w-2 h-2 bg-foreground rounded-full" />}
                          </div>
                          <div className="flex-1 h-12 rounded-lg bg-foreground/5 border border-border flex items-center px-4">
                             <div className="w-2/3 h-2 bg-foreground/10 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI PRODUCT SHOWCASE */}
        <section id="showcase" className="py-32 relative bg-muted/30 border-t border-border/50 overflow-hidden z-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 text-foreground">HireReady <span className="text-muted-foreground">Intelligence</span></h2>
              <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed">Experience the power of advanced models trained specifically for career optimization and technical interviewing.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Feature 1: Resume */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-accent-blue/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-3xl font-bold mb-4">Resume Analysis</h3>
                <p className="text-foreground/60 mb-8 font-medium">Instantly parse your CV against millions of successful profiles to identify missing keywords and formatting issues.</p>

                <div className="relative h-[250px] w-full bg-background/50 rounded-2xl border border-white/5 p-6 overflow-hidden">
                   <div className="space-y-4 mt-4">
                     <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                     <div className="h-4 w-full bg-white/10 rounded-full relative overflow-hidden">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-accent-blue/40 rounded-full" />
                     </div>
                     <div className="h-4 w-5/6 bg-white/10 rounded-full" />
                   </div>
                   <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute bottom-6 right-6 bg-green-500/10 border border-green-500/20 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2">
                     <Zap className="w-4 h-4 text-green-400" />
                     <span className="text-green-400 font-bold text-sm">ATS Optimized</span>
                   </motion.div>
                </div>
              </motion.div>

              {/* Feature 2: Interview */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-card/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-accent-purple/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-3xl font-bold mb-4">Interview Scoring</h3>
                <p className="text-foreground/60 mb-8 font-medium">Practice with a voice-enabled AI interviewer that evaluates your technical depth, communication, and confidence.</p>

                <div className="relative h-[250px] w-full bg-background/50 rounded-2xl border border-white/5 p-6 flex items-center justify-center">
                   <div className="w-40 h-40 relative flex items-center justify-center">
                     <motion.svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                       <motion.circle initial={{ strokeDasharray: "0 300" }} whileInView={{ strokeDasharray: "240 300" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                     </motion.svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black">8.5</span>
                       <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mt-1">Score</span>
                     </div>
                   </div>
                </div>
              </motion.div>

              {/* Feature 3: Roadmap */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-card/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group lg:col-span-2 hover:border-accent-blue/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-4">Career Roadmap</h3>
                    <p className="text-foreground/60 mb-8 font-medium max-w-xl leading-relaxed">A deeply personalized learning path generated dynamically to bridge the gap between your current skills and your dream job requirements.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 font-bold text-accent-blue hover:text-accent-blue/80 transition-colors">
                      View full roadmap <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="flex-1 w-full bg-background/50 rounded-2xl border border-white/5 p-6 relative">
                    <div className="absolute left-[52px] top-8 bottom-8 w-0.5 bg-white/10" />
                    <div className="space-y-6 relative z-10">
                      {[
                        { title: "Master React Internals", status: "completed" },
                        { title: "System Design Prep", status: "current" },
                        { title: "Behavioral Interviews", status: "upcoming" }
                      ].map((node, i) => (
                        <div key={i} className="flex items-center gap-6">
                          <div className={`w-5 h-5 rounded-full border-4 flex-shrink-0 relative z-10 ${node.status === 'completed' ? 'border-green-500 bg-background' : node.status === 'current' ? 'border-accent-blue bg-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse' : 'border-white/20 bg-background'}`} />
                          <div className={`px-5 py-4 rounded-xl border ${node.status === 'current' ? 'border-accent-blue/30 bg-accent-blue/5' : 'border-white/5 bg-white/5'} flex-1`}>
                            <p className={`font-semibold ${node.status === 'upcoming' ? 'text-foreground/50' : ''}`}>{node.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: TESTIMONIALS */}
        <section id="testimonials" className="py-32 relative bg-background border-t border-border/50 z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-xl text-foreground/50 max-w-2xl mx-auto">Join thousands of professionals who have transformed their careers with HireReady AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((testimonial) => (
                <motion.div
                  key={testimonial}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: testimonial * 0.1 }}
                  className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center">
                      <BrainCircuit className="text-accent-blue w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Alex Rodriguez</h3>
                      <p className="text-sm text-foreground/50">Software Engineer at Google</p>
                    </div>
                  </div>
                  <p className="text-foreground/60 leading-relaxed mb-4">
                    "HireReady AI transformed my job search journey. The resume optimizer got me past ATS filters, the mock interviews prepared me for tough technical rounds, and the personalized roadmap helped me fill critical skill gaps. I landed my dream job at Google in just 8 weeks!"
                  </p>
                  <div className="flex items-center mt-4 pt-4 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center mr-3">
                      <Trophy className="text-accent-purple w-4 h-4" />
                    </div>
                    <span className="text-accent-purple font-semibold">Placement Success Rate: 94%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section id="how-it-works" className="py-32 relative bg-background border-t border-border/50 z-10 overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 text-foreground">How It <span className="text-muted-foreground">Works</span></h2>
              <p className="text-xl text-foreground/50 max-w-2xl mx-auto">Simple, intuitive, and powerful - get hired faster with our AI-powered career platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4].map((step) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: step * 0.08 }}
                  className="flex items-center gap-6 bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
                      <span className="text-accent-blue font-bold text-sm flex items-center justify-center">{step}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {step === 1 ? 'Upload Your Resume' : step === 2 ? 'AI Analysis & Insights' : step === 3 ? 'Personalized Roadmap' : 'Interview Practice & Feedback'}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed">
                      {step === 1
                        ? 'Upload your current resume or LinkedIn profile for instant analysis against industry standards and job requirements.'
                        : step === 2
                        ? 'Get detailed feedback on your resume, skills gap analysis, and personalized improvement recommendations.'
                        : step === 3
                        ? 'Receive a customized learning path with timelines, resources, and milestones to reach your career goals.'
                        : 'Practice with AI interviewers, get real-time feedback, and improve your performance with each session.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 border-t border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-full blur-[200px] pointer-events-none"
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 text-foreground pb-2">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              Join thousands of professionals who have accelerated their careers with AI-powered insights and personalized guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] w-full sm:w-auto flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 transition-transform duration-300">
                  Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 rounded-full font-bold text-lg text-foreground bg-card/60 backdrop-blur-xl border border-border hover:bg-card hover:border-accent-blue/50 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full sm:w-auto group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="relative z-10">Continue with Google</span>
              </Link>
            </div>

            <p className="mt-6 text-foreground/40 text-sm">
              No credit card required • Cancel anytime • 24/7 support
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}