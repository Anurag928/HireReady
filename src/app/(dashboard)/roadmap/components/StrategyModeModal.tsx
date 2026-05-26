import { motion, AnimatePresence } from "framer-motion";
import { X, Network, Database, Cpu, Terminal, Layers, Rocket } from "lucide-react";

interface StrategyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: string) => void;
}

const strategies = [
  {
    id: "Production AI Engineer Path (Focus: Deployment, Kubernetes, CI/CD, scalable inference)",
    title: "Production AI Engineer",
    icon: <Terminal className="w-6 h-6" />,
    description: "Deployment-first approach focusing on Kubernetes, scalable inference, and robust CI/CD.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20 hover:border-blue-500/50"
  },
  {
    id: "Research Scientist Path (Focus: research papers, transformers, experimentation, deep theory)",
    title: "Research Scientist",
    icon: <Layers className="w-6 h-6" />,
    description: "Focus on theory, reading papers, deep learning experimentation, and transformer architectures.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20 hover:border-purple-500/50"
  },
  {
    id: "AI Infrastructure Engineer Path (Focus: cloud architecture, TPU/GPU clusters, data pipelines)",
    title: "AI Infrastructure Engineer",
    icon: <Network className="w-6 h-6" />,
    description: "Master cloud architecture, TPU/GPU clustering, enterprise data lakes, and backbone systems.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20 hover:border-cyan-500/50"
  },
  {
    id: "Startup AI Builder Path (Focus: rapid product delivery, APIs, SaaS AI systems, MVP velocity)",
    title: "Startup AI Builder",
    icon: <Rocket className="w-6 h-6" />,
    description: "Optimize for MVP speed: rapid prototyping, SaaS AI implementations, and high-velocity delivery.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20 hover:border-orange-500/50"
  },
  {
    id: "Data-Centric ML Engineer Path (Focus: data quality, synthetic data, feature engineering)",
    title: "Data-Centric ML Engineer",
    icon: <Database className="w-6 h-6" />,
    description: "Prioritize data quality, synthetic data generation, and advanced feature engineering pipelines.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20 hover:border-green-500/50"
  },
  {
    id: "MLOps Specialist Path (Focus: monitoring, drift detection, security, automation)",
    title: "MLOps Specialist",
    icon: <Cpu className="w-6 h-6" />,
    description: "Focus on model drift, monitoring, pipeline security, and end-to-end AI automation.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20 hover:border-pink-500/50"
  },
  {
    id: "AI Systems Architect (Focus: high-level design, model mesh, distributed training)",
    title: "AI Systems Architect",
    icon: <Terminal className="w-6 h-6" />,
    description: "Master high-level system design, model meshing, and distributed training at scale.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20 hover:border-indigo-500/50"
  }
];

export function StrategyModeModal({ isOpen, onClose, onSelectStrategy }: StrategyModeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-2xl z-10"
        >
          <div className="sticky top-0 bg-card/80 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between z-20">
            <div>
              <h2 className="text-2xl font-bold">Select AI Strategy Mode</h2>
              <p className="text-muted-foreground text-sm mt-1">Choose the architectural focus for your next roadmap generation.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <button
                key={strategy.title}
                onClick={() => {
                  onSelectStrategy(strategy.id);
                  onClose();
                }}
                className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-background/50 ${strategy.border}`}
              >
                <div className={`p-3 rounded-xl ${strategy.bg} ${strategy.color} mb-4 inline-flex group-hover:scale-110 transition-transform`}>
                  {strategy.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{strategy.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
