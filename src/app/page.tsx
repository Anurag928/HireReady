"use client";

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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="text-foreground overflow-hidden min-h-screen relative">
      <OrbSystem />
      <Navbar />
      
      <main className="flex-1 pt-20">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
          {/* Background is now fully managed by OrbSystem */}

          <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT COLUMN: Typography & CTAs */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-left flex flex-col items-start space-y-8 relative z-10"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/50 backdrop-blur-xl border border-accent-blue/30 text-accent-blue text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.15)] group hover:bg-accent-blue/5 transition-colors cursor-default">
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="tracking-wide uppercase text-xs">The Next Generation of Career Growth</span>
              </motion.div>
              
              <motion.h1 
                variants={slideUp}
                className="text-[40px] leading-[1.1] sm:text-6xl lg:text-[80px] font-black tracking-tighter relative z-10"
              >
                <div className="absolute -inset-4 blur-3xl opacity-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 z-[-1] animate-pulse-slow" />
                <span className="text-foreground dark:text-white drop-shadow-sm block">
                  Welcome to
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-blue-500 to-accent-purple drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] block mt-2">
                  HireReady AI
                </span>
              </motion.h1>

              <motion.p 
                variants={slideUp}
                className="text-lg md:text-2xl text-foreground/70 max-w-xl font-medium leading-relaxed tracking-tight"
              >
                Your AI-Powered Career Intelligence Platform for Resume Optimization, Mock Interviews, Skill Gap Analysis, and Career Roadmapping.
              </motion.p>

              <motion.div 
                variants={slideUp}
                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
              >
                <Link
                  href="/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] w-full sm:w-auto overflow-hidden flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Start Your AI Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN: AI Visualizations */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.2 }} 
              className="relative h-[600px] hidden lg:block w-full"
            >
              {/* Soft Glowing AI Orb Base */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-accent-purple/30 via-accent-blue/10 to-transparent rounded-full blur-[80px] mix-blend-screen pointer-events-none"
              />

              {/* Card 1: Resume Analysis */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute top-[10%] right-[5%] w-[320px] bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20">
                    <FileText className="text-accent-blue w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground/70">Resume ATS Score</p>
                    <p className="text-2xl font-black text-green-500">92/100</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full bg-border rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" 
                    />
                  </div>
                  <p className="text-xs font-bold text-emerald-500 text-right">+15% improvement</p>
                </div>
              </motion.div>

              {/* Card 2: Interview Feedback */}
              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                className="absolute bottom-[10%] left-[0%] w-[360px] bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 shadow-2xl z-20"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-4">
                  <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center">
                    <BrainCircuit className="text-accent-purple w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">AI Interviewer Feedback</p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start bg-background/40 p-3 rounded-xl border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 shrink-0 flex items-center justify-center mt-0.5">
                      <Zap className="w-3 h-3 text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                      Great explanation of React hooks. Consider adding a real-world example to strengthen your answer.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Card 3: Mini Chart */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
                className="absolute top-[55%] right-[10%] w-[220px] bg-card/80 backdrop-blur-3xl border border-accent-blue/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(59,130,246,0.15)] z-10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <LineChart className="w-4 h-4 text-accent-blue" />
                  <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Placement Odds</p>
                </div>
                <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">High</p>
                <p className="text-xs font-semibold text-foreground/40 mt-2 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Top 5% of candidates
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 1: AI FEATURES SHOWCASE */}
        <section id="features" className="py-32 relative border-t border-border/50 bg-background/50 backdrop-blur-3xl z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">An OS For Your Career</h2>
              <p className="text-xl text-foreground/50 max-w-2xl mx-auto">Everything you need to crack your dream placements and build a stellar profile, automated by AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: FileText, title: "AI Resume Analyzer", desc: "Get ATS scoring and personalized improvement suggestions instantly.", color: "text-blue-400" },
                { icon: BrainCircuit, title: "AI Mock Interviews", desc: "Practice with conversational AI tailored precisely to your target role.", color: "text-purple-400" },
                { icon: Target, title: "Personalized Roadmaps", desc: "Dynamic, step-by-step learning paths generated based on your goals.", color: "text-green-400" },
                { icon: Trophy, title: "Skill Gap Analysis", desc: "Identify exactly what you are missing for your dream job.", color: "text-orange-400" },
                { icon: LineChart, title: "Placement Analytics", desc: "Track your readiness score and interview performance visually.", color: "text-red-400" },
                { icon: Code2, title: "GitHub Profile Analyzer", desc: "Extract insights from your repositories to showcase to recruiters.", color: "text-gray-400" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="group relative p-8 rounded-3xl bg-card/40 backdrop-blur-2xl border border-transparent hover:border-accent-blue/50 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent -z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-blue/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-14 h-14 rounded-2xl bg-background/50 border border-border/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)] relative z-10 backdrop-blur-sm">
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground relative z-10">{feature.title}</h3>
                  <p className="text-foreground/60 leading-relaxed relative z-10 font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: AI PRODUCT SHOWCASE */}
        <section id="showcase" className="py-32 relative bg-muted/30 border-t border-border/50 overflow-hidden z-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">HireReady <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">AI Intelligence</span></h2>
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

        {/* SECTION 4: HOW IT WORKS */}
        <section id="how-it-works" className="py-32 relative bg-background border-t border-border/50 z-10 overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Works</span></h2>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-blue/20 via-accent-purple/20 to-transparent" />
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 w-1 bg-gradient-to-b from-accent-blue to-accent-purple shadow-[0_0_15px_rgba(59,130,246,0.5)] origin-top"
              />
              
              <div className="space-y-24">
                {[
                  { step: "01", title: "Sign in with Google", desc: "Create your account instantly with zero friction. Connect your profile to get started." },
                  { step: "02", title: "AI Onboarding & Parsing", desc: "Upload your resume and let the AI extract your skills, target role, and preferred domain." },
                  { step: "03", title: "Get Your Roadmap", desc: "Receive your personalized dashboard, actionable career insights, and daily interview tasks." }
                ].map((item, i) => (
                  <div key={i} className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: i % 2 !== 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className={`flex-1 w-full ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'} pl-20 md:pl-0`}
                    >
                      <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                      <p className="text-foreground/60 font-medium text-lg leading-relaxed">{item.desc}</p>
                    </motion.div>

                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
                      className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-background border-[4px] border-accent-blue flex items-center justify-center text-lg font-black text-accent-blue shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10"
                    >
                      {item.step}
                    </motion.div>
                    
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="py-40 relative overflow-hidden border-t border-border/50 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-blue/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-purple/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Start Building Your<br/>AI Career Future</h2>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-foreground bg-card border border-white/20 hover:border-accent-blue/50 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-lg">Continue with Google</span>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
