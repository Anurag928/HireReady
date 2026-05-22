import { motion, Variants } from "framer-motion";
import { CheckCircle2, ChevronRight, MessageSquareText } from "lucide-react";

interface TimelineProps {
  weeklyPlan: {
    week: string;
    focus: string;
    ai_insight?: string;
    tasks: string[];
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
  return (
    <div className={`p-8 rounded-3xl bg-card backdrop-blur-2xl border border-border hover:border-accent-blue/40 transition-all duration-500 hover:shadow-xl hover:shadow-accent-blue/10 hover:-translate-y-2 relative overflow-hidden text-left`}>
      <div className={`absolute top-0 ${align === 'right' ? 'right-0 -mr-16' : 'left-0 -ml-16'} w-40 h-40 bg-accent-blue/10 rounded-full blur-[50px] pointer-events-none`} />
      
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 text-xs font-black uppercase tracking-widest rounded-md bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
          Week {plan.week}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold mb-6 text-foreground leading-tight">{plan.focus}</h3>
      
      {/* AI Insight Bubble */}
      {plan.ai_insight && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-accent-purple/10 to-transparent border border-accent-purple/20 text-foreground/80 text-sm leading-relaxed relative">
          <MessageSquareText className="absolute top-4 right-4 w-5 h-5 text-accent-purple/40" />
          <p className="pr-6 italic">"{plan.ai_insight}"</p>
        </div>
      )}

      <ul className="space-y-4 relative z-10">
        {plan.tasks.map((task: string, j: number) => (
          <li key={j} className="flex items-start gap-3 text-foreground/70">
            <div className="mt-1 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-accent-blue/80" />
            </div>
            <span className="leading-relaxed text-sm font-medium">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
