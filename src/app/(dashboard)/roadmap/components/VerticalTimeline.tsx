import { motion, Variants } from "framer-motion";
import { CheckCircle2, ChevronRight, MessageSquareText } from "lucide-react";

interface TimelineProps {
  weeklyPlan: {
    week: string;
    focus: string;
    ai_insight?: string;
    tasks: string[];
    priority_level?: string;
    learning_goals?: string[];
    recommended_projects?: string[];
    interview_prep_milestone?: string;
  }[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
};

export function VerticalTimeline({ weeklyPlan }: TimelineProps) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto py-16">
      {/* Central Energy Axis */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent-blue/40 to-transparent -translate-x-1/2 rounded-full" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12 md:space-y-24"
      >
        {weeklyPlan.map((plan, i) => {
          const isEven = i % 2 === 0;

          return (
            <motion.div key={i} variants={itemVariants} className="relative flex flex-col md:flex-row items-center group w-full">
              
              {/* Central Glowing Node */}
              <div className="absolute left-6 md:left-1/2 top-6 md:top-1/2 w-5 h-5 -translate-x-1/2 md:-translate-y-1/2 rounded-full bg-background border-4 border-accent-blue shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 group-hover:scale-150 group-hover:bg-accent-blue transition-all duration-500" />

              {/* Left Side (Card on Even, Empty/Label on Odd) */}
              <div className={`w-full md:w-1/2 pl-16 pr-0 md:px-12 flex ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                
                {isEven ? (
                  // Card on Left
                  <div className="w-full relative group/card">
                    <div className="absolute top-1/2 -right-12 w-12 h-[2px] bg-accent-blue/30 hidden md:block" />
                    <TimelineCard plan={plan} align="right" />
                  </div>
                ) : (
                  // Empty space with subtle connecting line
                  <div className="hidden md:flex w-full justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none pr-8">
                     <span className="text-9xl font-black text-foreground/[0.03] tracking-tighter absolute">W{plan.week}</span>
                  </div>
                )}
              </div>

              {/* Right Side (Card on Odd, Empty/Label on Even) */}
              <div className={`w-full md:w-1/2 pl-16 pr-0 md:px-12 flex ${!isEven ? "md:justify-start mt-8 md:mt-0" : "md:justify-end mt-8 md:mt-0 hidden"}`}>
                {!isEven ? (
                  // Card on Right
                  <div className="w-full relative group/card">
                    <div className="absolute top-1/2 -left-12 w-12 h-[2px] bg-accent-blue/30 hidden md:block" />
                    <TimelineCard plan={plan} align="left" />
                  </div>
                ) : (
                  // Empty space
                  <div className="hidden md:flex w-full justify-start items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none pl-8">
                     <span className="text-9xl font-black text-foreground/[0.03] tracking-tighter absolute">W{plan.week}</span>
                  </div>
                )}
              </div>

            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function TimelineCard({ plan, align }: { plan: any, align: 'left' | 'right' }) {
  // Determine status color based on priority
  const isHighPriority = plan.priority_level?.toLowerCase() === 'high';
  const isMediumPriority = plan.priority_level?.toLowerCase() === 'medium';
  
  return (
    <div className={`p-8 rounded-3xl bg-card/60 dark:bg-card/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 hover:border-accent-blue/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent-blue/10 hover:-translate-y-2 relative overflow-hidden text-left group/inner`}>
      {/* Premium Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-purple-500/20 opacity-0 group-hover/inner:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 print:hidden`} />
      <div className={`absolute top-0 ${align === 'right' ? 'right-0 -mr-16' : 'left-0 -ml-16'} w-64 h-64 bg-accent-blue/10 rounded-full blur-[60px] pointer-events-none -z-10 print:hidden`} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            Week {plan.week}
          </span>
          {plan.priority_level && (
            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${
              isHighPriority ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
              isMediumPriority ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
              'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isHighPriority ? 'bg-red-500 animate-pulse' : isMediumPriority ? 'bg-orange-500' : 'bg-green-500'}`} />
              {plan.priority_level} Priority
            </span>
          )}
        </div>
      </div>

      <h3 className="text-3xl font-extrabold mb-6 text-foreground leading-tight tracking-tight">{plan.focus}</h3>
      
      {/* AI Insight Bubble */}
      {plan.ai_insight && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent border border-accent-purple/20 text-foreground/80 text-sm leading-relaxed relative">
          <MessageSquareText className="absolute top-5 right-5 w-5 h-5 text-accent-purple/40" />
          <p className="pr-8 italic text-foreground/90 font-medium">"{plan.ai_insight}"</p>
        </div>
      )}

      {/* Structured Roadmap Details */}
      <div className="space-y-6 relative z-10 print:text-black">
        {/* Learning Goals */}
        {plan.learning_goals && plan.learning_goals.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">Key Milestones</h4>
            <ul className="space-y-3">
              {plan.learning_goals.map((goal: string, j: number) => (
                <li key={j} className="flex items-start gap-3 text-foreground/80">
                  <div className="mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/60 mt-1.5" />
                  </div>
                  <span className="leading-relaxed text-sm font-medium">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tactical Tasks */}
        <div>
          <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">Execution Steps</h4>
          <ul className="space-y-3">
            {plan.tasks.map((task: string, j: number) => (
              <li key={j} className="flex items-start gap-3 text-foreground/80">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                </div>
                <span className="leading-relaxed text-sm font-medium">{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects & Interview Prep */}
        {(plan.recommended_projects?.length > 0 || plan.interview_prep_milestone) && (
          <div className="pt-4 mt-6 border-t border-white/5 dark:border-white/10 flex flex-wrap gap-4">
            {plan.recommended_projects?.map((proj: string, j: number) => (
              <span key={j} className="text-xs font-bold px-3 py-1.5 rounded-md bg-accent-purple/10 text-accent-purple border border-accent-purple/20 flex items-center gap-1.5">
                🏗️ {proj}
              </span>
            ))}
            {plan.interview_prep_milestone && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1.5">
                🎯 {plan.interview_prep_milestone}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
