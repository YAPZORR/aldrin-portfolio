const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Users, Eye, FileDown, Share2, MessageCircle, TrendingUp, Activity, Globe, Layers } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group hover:border-white/[0.15] transition-all">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`} style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon size={17} style={{ color }} />
          </div>
          <TrendingUp size={13} className="text-white/20" />
        </div>
        <p className="font-inter text-3xl font-bold text-white mb-0.5">{value}</p>
        <p className="font-inter text-sm text-white/50">{label}</p>
        {sub && <p className="font-inter text-xs text-white/25 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-white/40 font-inter mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold font-inter" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.entities.VisitorEvent.list("-created_date", 2000),
      db.entities.Project.list("order", 50),
    ]).then(([evData, projData]) => {
      setEvents(evData);
      setProjects(projData.map(p => p.title));
      setLoading(false);
    });

    const unsubEvents = db.entities.VisitorEvent.subscribe((ev) => {
      if (ev.type === "create") setEvents(prev => [ev.data, ...prev]);
      if (ev.type === "update") setEvents(prev => prev.map(e => e.id === ev.id ? ev.data : e));
    });

    const unsubProjects = db.entities.Project.subscribe((ev) => {
      if (ev.type === "create") setProjects(prev => [...prev, ev.data.title]);
      if (ev.type === "update") setProjects(prev => prev.map(t => t === ev.data.title ? ev.data.title : t));
      if (ev.type === "delete") setProjects(prev => prev.filter(t => t !== ev.data.title));
    });

    return () => { unsubEvents(); unsubProjects(); };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Stats
  const pageViewEvents = events.filter(e => e.eventType === "page_view");
  const totalVisits = pageViewEvents.length;
  const uniqueSessions = new Set(pageViewEvents.map(e => e.sessionId)).size;
  const resumeClicks = events.filter(e => e.eventType === "resume_click").length;
  const socialClicks = events.filter(e => e.eventType === "social_click").length;
  const chatOpens = events.filter(e => e.eventType === "chat_open").length;
  const projectViews = events.filter(e => e.eventType === "project_view").length;
  // Currently active: sessions where lastSeen was updated within the last 2 minutes (heartbeat is every 30s)
  const twoMinAgo = Date.now() - 2 * 60 * 1000;
  const activeSessionIds = new Set(
    pageViewEvents.filter(e => {
      const ts = e.lastSeen ? new Date(e.lastSeen).getTime() : new Date(e.created_date).getTime();
      return ts > twoMinAgo;
    }).map(e => e.sessionId)
  );
  const currentlyActive = activeSessionIds.size;

  // Last 7 days chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayStr = format(day, "MMM d");
    const start = startOfDay(day).getTime();
    const end = start + 86400000;
    const views = events.filter(e => {
      const t = new Date(e.created_date).getTime();
      return e.eventType === "page_view" && t >= start && t < end;
    }).length;
    const clicks = events.filter(e => {
      const t = new Date(e.created_date).getTime();
      return (e.eventType === "resume_click" || e.eventType === "social_click") && t >= start && t < end;
    }).length;
    return { day: dayStr, views, clicks };
  });

  // Social breakdown
  const socialPlatforms = ["facebook", "linkedin", "github"].map(p => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: events.filter(e => e.eventType === "social_click" && (e.meta || "").toLowerCase().includes(p)).length,
  }));

  // Top projects
  const projectCounts = {};
  events.filter(e => e.eventType === "project_view").forEach(e => {
    const name = e.meta || "Unknown";
    projectCounts[name] = (projectCounts[name] || 0) + 1;
  });
  const topProjects = Object.entries(projectCounts)
    .filter(([name]) => projects.length === 0 || projects.includes(name))
    .sort((a, b) => b[1] - a[1]);

  const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-inter text-lg font-bold text-white mb-1">Analytics Overview</h2>
        <p className="font-inter text-sm text-white/30">Track your portfolio performance in real-time</p>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-inter text-sm text-emerald-400 font-medium">{currentlyActive} visitor{currentlyActive !== 1 ? "s" : ""} currently viewing</span>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Eye} label="Total Page Views" value={totalVisits} sub="All time visits" color="#8b5cf6" delay={0} />
        <StatCard icon={Users} label="Unique Visitors" value={uniqueSessions} sub="Unique sessions" color="#ec4899" delay={0.05} />
        <StatCard icon={FileDown} label="Resume Clicks" value={resumeClicks} sub="CV downloads" color="#06b6d4" delay={0.1} />
        <StatCard icon={Share2} label="Social Clicks" value={socialClicks} sub="All platforms" color="#10b981" delay={0.15} />
        <StatCard icon={MessageCircle} label="Chat Opens" value={chatOpens} sub="Chat sessions started" color="#f59e0b" delay={0.2} />
        <StatCard icon={Layers} label="Project Views" value={projectViews} sub="Project detail opens" color="#f43f5e" delay={0.25} />
      </div>

      {/* Chart - Last 7 days */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-5">
          <Activity size={15} className="text-primary" />
          <h3 className="font-inter text-sm font-semibold text-white">Last 7 Days Traffic</h3>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={last7} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="views" name="Views" stroke="#8b5cf6" strokeWidth={2} fill="url(#gViews)" />
            <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#ec4899" strokeWidth={2} fill="url(#gClicks)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary/70" /><span className="text-xs text-white/30 font-inter">Page Views</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-pink-500/70" /><span className="text-xs text-white/30 font-inter">Resume & Social Clicks</span></div>
        </div>
      </motion.div>

      {/* Social + Top Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={15} className="text-emerald-400" />
            <h3 className="font-inter text-sm font-semibold text-white">Social Media Clicks</h3>
          </div>
          <div className="space-y-3">
            {socialPlatforms.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-20 font-inter text-xs text-white/50">{p.name}</span>
                <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${socialClicks > 0 ? (p.count / socialClicks) * 100 : 0}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ background: COLORS[i] }} />
                </div>
                <span className="w-6 font-inter text-xs text-white/40 text-right">{p.count}</span>
              </div>
            ))}
            {socialClicks === 0 && <p className="text-xs text-white/20 font-inter">No social clicks yet</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={15} className="text-cyan-400" />
            <h3 className="font-inter text-sm font-semibold text-white">Top Viewed Projects</h3>
          </div>
          <div className="space-y-3">
            {topProjects.length > 0 ? topProjects.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex-1 font-inter text-xs text-white/50 truncate">{name}</span>
                <div className="w-24 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(count / topProjects[0][1]) * 100}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                </div>
                <span className="w-5 font-inter text-xs text-white/40 text-right">{count}</span>
              </div>
            )) : <p className="text-xs text-white/20 font-inter">No project views yet</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}