import { motion, Variants } from "framer-motion";
import { Zap, Clock, Code2, Globe } from "lucide-react";

interface ProjectGridProps {
  projects: {
    title: string;
    difficulty: string;
    estimated_time: string;
    technologies_used: string[];
  }[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
    >
      {projects.map((project, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="group relative p-1 rounded-2xl bg-gradient-to-br from-border/50 to-transparent hover:from-orange-500/50 hover:to-accent-purple/50 transition-all duration-500 overflow-hidden"
        >
          {/* Animated Glow Behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-accent-purple/20 to-accent-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative h-full p-6 bg-card/90 backdrop-blur-xl rounded-[14px] border border-border flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {project.title}
                </h3>
                <div className="p-2 rounded-full bg-muted border border-border text-muted-foreground group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6 text-xs font-bold text-foreground/50 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <Zap className="w-4 h-4" /> {project.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-accent-blue">
                  <Clock className="w-4 h-4" /> {project.estimated_time}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-3 h-3" /> Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies_used.map((tech, j) => (
                  <span
                    key={j}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted border border-border text-foreground/80 group-hover:border-border/80 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
