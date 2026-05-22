"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, Sparkles, BrainCircuit, Target, Trophy, 
  FileText, Code2, LineChart, ChevronRight, Zap
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
  
  return (
    <div className="bg-background text-foreground overflow-hidden">
      <Navbar />
      
      <main className="flex-1 pt-20">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
          {/* Cinematic Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[150px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)]" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto relative z-10"
          >
            <motion.div variants={slideUp} className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background/50 backdrop-blur-md border border-accent-blue/30 text-accent-blue text-sm font-medium shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation of Career Growth</span>
            </motion.div>
            
            <motion.h1 
              variants={slideUp}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
            >
              Your AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple animate-gradient-x">
                Placement Companion
              </span>
            </motion.h1>

            <motion.p 
              variants={slideUp}
              className="text-lg md:text-2xl text-foreground/60 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Analyze resumes, prepare for interviews, track skills, and receive intelligent career roadmaps powered by AI.
            </motion.p>

            <motion.div 
              variants={slideUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/login"
                className="group relative px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                  Start Your AI Career Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                href="/login"
                className="px-8 py-4 rounded-full font-semibold text-foreground bg-card/50 backdrop-blur-sm border border-border hover:bg-card hover:border-accent-blue/50 flex items-center justify-center gap-3 transition-all hover:scale-105 w-full sm:w-auto group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 1: AI FEATURES SHOWCASE */}
        <section className="py-32 relative border-t border-white/5">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl bg-card/30 backdrop-blur-sm border border-white/10 hover:border-accent-blue/40 transition-all hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-2xl bg-background/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-foreground/50 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: ROADMAP PREVIEW */}
        <section className="py-32 relative bg-card/20 border-t border-white/5 overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Dynamic AI Roadmaps</h2>
              <p className="text-xl text-foreground/50 leading-relaxed">
                Stop guessing what to learn next. Our AI generates a comprehensive, week-by-week timeline custom-tailored to your current skills and target role.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-accent-blue font-semibold hover:text-accent-blue/80 transition-colors">
                Generate your roadmap <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex-1 relative w-full">
              <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-border z-0" />
              <div className="space-y-12">
                {[
                  { level: "Beginner", title: "Frontend Fundamentals", status: "completed" },
                  { level: "Intermediate", title: "React & State Management", status: "current" },
                  { level: "Advanced", title: "Next.js & Server Components", status: "upcoming" }
                ].map((node, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="relative pl-24"
                  >
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-4 border-card flex items-center justify-center z-10">
                      {node.status === 'completed' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                      {node.status === 'current' && <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]" />}
                    </div>
                    <div className={`p-6 rounded-2xl border ${node.status === 'current' ? 'bg-card border-accent-blue/40 shadow-lg' : 'bg-background/50 border-white/5'} backdrop-blur-sm`}>
                      <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${node.status === 'current' ? 'text-accent-blue' : 'text-foreground/40'}`}>{node.level}</span>
                      <h4 className="text-lg font-semibold">{node.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: AI ANALYTICS PREVIEW */}
        <section className="py-32 relative border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Deep Skill Analytics</h2>
              <p className="text-xl text-foreground/50 leading-relaxed">
                Visualize your technical capabilities. The AI parses your resume and GitHub to build a dynamic radar chart of your strengths and skill gaps.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-white/10 w-fit">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50">Placement Readiness</p>
                  <p className="text-2xl font-bold text-green-400">85%</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full h-[400px] bg-card/30 rounded-3xl border border-white/10 p-6 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent pointer-events-none" />
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analyticsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section className="py-32 relative bg-card/20 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-20">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent z-0" />
              
              {[
                { step: "01", title: "Sign in with Google", desc: "Create your account instantly with zero friction." },
                { step: "02", title: "AI Onboarding", desc: "Tell the AI your skills, target role, and preferred domain." },
                { step: "03", title: "Get Your Roadmap", desc: "Receive your personalized dashboard and actionable career insights." }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  key={i} 
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full bg-background border border-accent-blue/30 flex items-center justify-center text-3xl font-bold text-accent-blue mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-foreground/50">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="py-40 relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-blue/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-purple/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Start Building Your<br/>AI Career Future</h2>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-foreground bg-card border border-white/20 hover:border-accent-blue/50 hover:bg-card/80 transition-all hover:scale-105 shadow-2xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
