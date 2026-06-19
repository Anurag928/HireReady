import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Terminal, Database, Cloud, Server, Workflow, Shield, Smartphone, BarChart3, Layout } from "lucide-react";

interface StrategyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: string) => void;
}

// Array moved inside component to ensure fresh evaluation

export function StrategyModeModal({ isOpen, onClose, onSelectStrategy }: StrategyModeModalProps) {
  if (!isOpen) return null;

  const strategies = [
    {
      id: "Full Stack Developer",
      title: "Full Stack Developer",
      icon: <Terminal className="w-6 h-6" />,
      description: "Build complete web applications with frontend, backend, databases, and deployment skills.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
    },
    {
      id: "Frontend Developer",
      title: "Frontend Developer",
      icon: <Layout className="w-6 h-6" />,
      description: "Create modern, responsive user interfaces using latest frontend technologies.",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]"
    },
    {
      id: "Backend Developer",
      title: "Backend Developer",
      icon: <Server className="w-6 h-6" />,
      description: "Develop scalable APIs, server-side systems, and database solutions.",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
    },
    {
      id: "AI/ML Engineer",
      title: "AI/ML Engineer",
      icon: <Cpu className="w-6 h-6" />,
      description: "Build intelligent systems using machine learning and artificial intelligence.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
    {
      id: "Data Scientist",
      title: "Data Scientist",
      icon: <Database className="w-6 h-6" />,
      description: "Analyze complex data and create predictive models.",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    },
    {
      id: "Data Analyst",
      title: "Data Analyst",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Transform data into meaningful insights, dashboards, and reports.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
    },
    {
      id: "Cloud Engineer",
      title: "Cloud Engineer",
      icon: <Cloud className="w-6 h-6" />,
      description: "Design and manage scalable cloud infrastructure.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
    },
    {
      id: "DevOps Engineer",
      title: "DevOps Engineer",
      icon: <Workflow className="w-6 h-6" />,
      description: "Automate development workflows, deployments, and infrastructure.",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
    },
    {
      id: "Cybersecurity Engineer",
      title: "Cybersecurity Engineer",
      icon: <Shield className="w-6 h-6" />,
      description: "Secure applications, networks, and systems against threats.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    },
    {
      id: "Mobile App Developer",
      title: "Mobile App Developer",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Develop Android and iOS applications.",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-[95vw] sm:w-full max-w-4xl max-h-[90vh] flex flex-col bg-card border border-border rounded-3xl shadow-2xl z-10 mx-auto"
        >
          <div className="sticky top-0 bg-card/80 backdrop-blur-xl border-b border-border p-5 sm:p-6 flex flex-col z-20 rounded-t-3xl shadow-sm">
            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-2xl font-bold">Choose Your Target Role</h2>
                <p className="text-muted-foreground text-sm mt-1">Select the primary role you want to focus your roadmap on.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectStrategy(strategy.id);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStrategy(strategy.id);
                    onClose();
                  }
                }}
                className="flex items-start gap-4 text-left p-5 sm:p-6 rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 shadow-sm bg-card hover:bg-accent/5 cursor-pointer"
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${strategy.bg} ${strategy.color}`}>
                  {strategy.icon}
                </div>
                <div className="flex flex-col flex-1 min-w-0" style={{ zIndex: 50, position: 'relative', display: 'block', visibility: 'visible', opacity: 1 }}>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--foreground, #000)', display: 'block', visibility: 'visible', opacity: 1 }}>
                    {strategy.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground, #666)', display: 'block', visibility: 'visible', opacity: 1 }}>
                    {strategy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
