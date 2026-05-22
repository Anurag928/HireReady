import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BrainCircuit, Target, ArrowRight } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: any[];
  onSelectVersion: (version: any) => void;
  loading: boolean;
}

export function HistoryModal({ isOpen, onClose, history, onSelectVersion, loading }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-card/90 backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-accent-blue" />
                  Roadmap History
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Past versions of your evolution path</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <BrainCircuit className="w-8 h-8 animate-pulse mb-4 text-accent-blue" />
                  <p>Fetching history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Clock className="w-8 h-8 mb-4 opacity-50" />
                  <p>No past roadmaps found.</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      onSelectVersion(item);
                      onClose();
                    }}
                    className="group p-5 rounded-2xl bg-card/20 border border-white/5 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/0 via-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-muted text-xs font-bold text-muted-foreground">
                          v{item.version || history.length - idx}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-blue transition-colors group-hover:translate-x-1" />
                    </div>

                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 relative z-10 line-clamp-1">
                      <Target className="w-4 h-4 text-accent-purple shrink-0" />
                      {item.roadmap?.career_path ? item.roadmap.career_path.split('.')[0] : "AI Roadmap"}
                    </h4>

                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground relative z-10 mt-4 pt-4 border-t border-border">
                      <span>Timeline: {item.roadmap?.estimated_timeline?.split(' ')[0]} {item.roadmap?.estimated_timeline?.split(' ')[1]}</span>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-accent-blue flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3" />
                        98% AI Match
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
