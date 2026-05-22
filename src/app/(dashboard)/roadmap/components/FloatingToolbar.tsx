import { motion } from "framer-motion";
import { Download, History, RefreshCcw, Loader2 } from "lucide-react";

interface FloatingToolbarProps {
  onRegenerate: () => void;
  onPrint: () => void;
  onHistory: () => void;
  isExporting?: boolean;
}

export function FloatingToolbar({ onRegenerate, onPrint, onHistory, isExporting }: FloatingToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center p-2 rounded-2xl bg-background/80 backdrop-blur-2xl border border-accent-blue/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] group space-y-2 w-14 hover:w-16 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <button 
        onClick={onPrint}
        disabled={isExporting}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-all text-foreground/70 hover:text-foreground group/btn relative disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export to PDF"
      >
        {isExporting ? (
          <Loader2 className="w-5 h-5 animate-spin text-accent-blue" />
        ) : (
          <Download className="w-5 h-5 group-hover/btn:text-accent-blue transition-colors group-hover/btn:scale-110 duration-300" />
        )}
        <span className="text-xs font-bold opacity-0 absolute right-14 bg-background px-3 py-1.5 rounded-lg border border-border group-hover/btn:opacity-100 transition-all group-hover/btn:-translate-x-1 whitespace-nowrap shadow-xl pointer-events-none">
          {isExporting ? "Exporting..." : "Export PDF"}
        </span>
      </button>

      <div className="w-6 h-px bg-border" />

      <button 
        onClick={onHistory}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-all text-foreground/70 hover:text-foreground group/btn relative"
        title="View History"
      >
        <History className="w-5 h-5 group-hover/btn:text-accent-purple transition-colors group-hover/btn:scale-110 duration-300" />
        <span className="text-xs font-bold opacity-0 absolute right-14 bg-background px-3 py-1.5 rounded-lg border border-border group-hover/btn:opacity-100 transition-all group-hover/btn:-translate-x-1 whitespace-nowrap shadow-xl pointer-events-none">View History</span>
      </button>

      <div className="w-6 h-px bg-border" />

      <button 
        onClick={onRegenerate}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-all text-foreground/70 hover:text-foreground group/btn relative"
        title="Regenerate Roadmap"
      >
        <RefreshCcw className="w-5 h-5 group-hover/btn:text-orange-500 transition-colors group-hover/btn:scale-110 duration-300" />
        <span className="text-xs font-bold opacity-0 absolute right-14 bg-background px-3 py-1.5 rounded-lg border border-border group-hover/btn:opacity-100 transition-all group-hover/btn:-translate-x-1 whitespace-nowrap shadow-xl pointer-events-none">Regenerate</span>
      </button>

    </motion.div>
  );
}
