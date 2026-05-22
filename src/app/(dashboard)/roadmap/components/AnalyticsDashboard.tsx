import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Activity, Target, TrendingUp, Zap } from "lucide-react";

interface AnalyticsDashboardProps {
  userRole: string;
  targetRole: string;
  timeline: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl">
        <p className="text-foreground/70 text-sm mb-1">{label}</p>
        <p className="text-accent-blue font-bold">
          {payload[0].value}% Projected
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsDashboard({ userRole, targetRole, timeline }: AnalyticsDashboardProps) {
  // Mock deterministic data based on roles to give a realistic cinematic feel
  const radarData = [
    { subject: "Core Tech", A: 85, fullMark: 100 },
    { subject: "System Design", A: 65, fullMark: 100 },
    { subject: "Architecture", A: 60, fullMark: 100 },
    { subject: "Problem Solving", A: 90, fullMark: 100 },
    { subject: "Leadership", A: 50, fullMark: 100 },
    { subject: "Best Practices", A: 75, fullMark: 100 },
  ];

  const trajectoryData = [
    { month: "M1", growth: 20 },
    { month: "M2", growth: 45 },
    { month: "M3", growth: 60 },
    { month: "M4", growth: 85 },
    { month: "M5", growth: 95 },
    { month: "M6", growth: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 relative z-10">
      {/* Skill Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="col-span-1 p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-32 bg-accent-blue/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent-blue/10 transition-colors duration-700" />
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <Target className="w-5 h-5 text-accent-blue" />
          Skill Evolution
        </h3>
        <div className="h-[250px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Trajectory Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="col-span-1 lg:col-span-2 p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 p-32 bg-accent-purple/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent-purple/10 transition-colors duration-700" />
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <TrendingUp className="w-5 h-5 text-accent-purple" />
          Career Trajectory vs Market Demand
        </h3>
        <div className="h-[250px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 2 }} />
              <Area
                type="monotone"
                dataKey="growth"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorGrowth)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Mini Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "AI Readiness", value: "92%", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Market Fit", value: "High", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Timeline", value: timeline, icon: TrendingUp, color: "text-accent-blue", bg: "bg-accent-blue/10" },
          { label: "Target Role", value: targetRole.split(" ")[0], icon: Target, color: "text-accent-purple", bg: "bg-accent-purple/10" }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border flex items-center gap-4 hover:bg-card/80 transition-colors shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
