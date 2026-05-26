import { motion } from "framer-motion";
import { Sparkles, Activity, Target, BrainCircuit, Rocket } from "lucide-react";

interface HeroSectionProps {
  careerPath: string;
  onGenerate: () => void;
  timeline: string;
  isExporting?: boolean;
}

export function HeroSection({ careerPath, onGenerate, timeline, isExporting }: HeroSectionProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-[2.5rem] border border-border mb-16 shadow-2xl ${isExporting ? 'bg-background' : 'bg-gradient-to-br from-background via-background to-accent-blue/5'}`}>
      
      {/* Ambient Backgrounds - Hidden during PDF export for html2canvas compatibility */}
      {!isExporting && (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50" />
        </>
      )}

      <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: Content & Typography */}
        <div className="flex flex-col items-start text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center gap-2 text-sm font-medium text-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            AI Confidence Score: 98%
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/50 max-w-2xl text-balance leading-[1.1]"
          >
            {careerPath ? "Your Personalized AI Evolution Path" : "Design Your Career Operating System"}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed text-balance"
          >
            {careerPath 
              ? careerPath 
              : "An intelligent, personalized blueprint for your evolution. Powered by advanced neural synthesis to keep you ahead of market demands."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full"
          >
            <button
              onClick={onGenerate}
              className="group relative px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_var(--color-foreground)] hover:shadow-[0_0_60px_var(--color-accent-blue)] w-full sm:w-auto flex justify-center shadow-foreground/10 hover:shadow-accent-blue/30"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {careerPath ? "Regenerate Intelligence" : "Generate AI Roadmap"}
              </span>
            </button>

            {careerPath && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-accent-purple" />
                    Est. Timeline
                  </span>
                  {/* Improved timeline layout: extract a concise headline (e.g., "6-9 months") and a supporting line */}
                  <div className="flex flex-col max-w-[260px] break-words">
                    {(() => {
                      const t = (timeline || '').trim();
                      // Try to extract a leading duration like "6-9 months" or "6 months"
                      const durationMatch = t.match(/^(\d+\s*(?:-|–|—)\s*\d+\s*months?|\d+\s*months?)/i);
                      let headline = t;
                      let rest = '';
                      if (durationMatch) {
                        headline = durationMatch[0];
                        rest = t.slice(durationMatch[0].length).trim();
                      } else if (t.length > 28) {
                        // Fallback: split near the first natural break to avoid overflowing
                        const splitAt = Math.max(t.indexOf(' ', 18), 18);
                        headline = t.slice(0, splitAt).trim();
                        rest = t.slice(splitAt).trim();
                      }
                      return (
                        <>
                          <span className="text-xl md:text-2xl font-semibold leading-snug text-foreground">
                            {headline}
                          </span>
                          {rest && (
                            <span className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {rest}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="w-px h-16 bg-border hidden sm:block mx-4" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5 text-green-500" />
                    Market Readiness
                  </span>
                  <span className="text-xl font-semibold leading-snug text-foreground">
                    Exceptional
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    High Demand
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT SIDE: Visual/Orb */}
        {!isExporting && (
          <div className="hidden lg:flex justify-center items-center relative h-full min-h-[400px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative w-[400px] h-[400px] flex items-center justify-center"
            >
              {/* Outer Rotating Rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-accent-blue/10 border-t-accent-blue/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border border-accent-purple/10 border-b-accent-purple/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-16 rounded-full border border-orange-500/10 border-l-orange-500/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-accent-blue/20 rounded-full blur-2xl absolute animate-pulse" />
                <div className="w-24 h-24 bg-gradient-to-br from-accent-blue/40 to-accent-purple/40 rounded-full flex items-center justify-center backdrop-blur-xl border border-border shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                  <BrainCircuit className="w-10 h-10 text-foreground opacity-80" />
                </div>
              </div>

              {/* Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  animate={{
                    rotate: 360,
                    x: [180 * Math.cos((i * 2 * Math.PI) / 5), 180 * Math.cos((i * 2 * Math.PI) / 5)],
                    y: [180 * Math.sin((i * 2 * Math.PI) / 5), 180 * Math.sin((i * 2 * Math.PI) / 5)],
                  }}
                  transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
