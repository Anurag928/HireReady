"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getMockInterviewHistory } from "@/api";
import { Loader2, Search, Filter } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchHistory = async (uid: string) => {
    setLoading(true);
    try {
      const res = await getMockInterviewHistory(uid);
      if (res.data?.success) setHistory(res.data.data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    fetchHistory(user.uid);
  }, [user]);

  const filtered = history.filter(h => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (h.role || "").toLowerCase().includes(q) || (h.recruiterVerdict?.hiringRecommendation || "").toLowerCase().includes(q);
  }).sort((a,b) => {
    if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === 'score') return (b.overallScore||0) - (a.overallScore||0);
    return 0;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Interview History</h2>
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search role or verdict" className="px-3 py-2 rounded-lg bg-background/60 border border-border/60" />
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="px-3 py-2 rounded-lg bg-background/60 border border-border/60">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="score">Top Score</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 bg-card/45 border border-border/60 rounded-2xl text-center">
          <p className="text-muted-foreground">No interviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s:any) => (
            <div key={s._id} className="p-5 rounded-2xl bg-card/45 border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold">{s.role}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(s.date).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-accent-blue">{s.overallScore}%</div>
                  <div className="text-[11px] text-muted-foreground">Overall</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-3">
                <div className="px-2 py-1 rounded bg-background/20 border border-border/40">{s.difficulty}</div>
                <div className="px-2 py-1 rounded bg-background/20 border border-border/40">{s.questions?.length || s.question_count || 0} Qs</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>{window.location.href = `/mock-interview?report=${s._id}`}} className="px-3 py-2 rounded-lg bg-accent-blue text-black font-bold">Load Report</button>
                <button onClick={()=>{window.location.href = `/mock-interview/${s._id}`}} className="px-3 py-2 rounded-lg border border-border/60">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
