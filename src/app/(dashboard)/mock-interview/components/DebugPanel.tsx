import React, { useEffect, useState } from 'react';
import { recentApiStats } from '@/api';
import { motion } from 'framer-motion';

export const DebugPanel = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (recentApiStats.lastCall !== stats) {
        setStats(recentApiStats.lastCall);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stats]);

  if (process.env.NODE_ENV !== 'development' || !stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 w-80 bg-black/90 text-green-400 font-mono text-[10px] p-4 rounded-lg shadow-2xl border border-green-500/30 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-2 border-b border-green-500/30 pb-1">
        <span className="font-bold text-xs text-white">Debug Console</span>
        <span className={`px-1.5 py-0.5 rounded ${stats.status >= 400 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {stats.status || 'ERR'}
        </span>
      </div>
      <div className="space-y-1">
        <div><span className="text-gray-400">URL:</span> {stats.url}</div>
        <div><span className="text-gray-400">Method:</span> {stats.method}</div>
        <div><span className="text-gray-400">Latency:</span> {stats.duration}ms</div>
        {stats.error && <div className="text-red-400"><span className="text-gray-400">Error:</span> {stats.error}</div>}
        
        <div className="mt-2 pt-2 border-t border-green-500/20">
          <span className="text-gray-400 block mb-1">Payload Snippet:</span>
          <pre className="max-h-20 overflow-auto text-cyan-300 bg-black/50 p-1 rounded">
            {JSON.stringify(stats.requestData, null, 2)}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};
