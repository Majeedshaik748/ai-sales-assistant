import React from "react";
import { useGetDashboardStats, useGetDashboardCampaignStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Send, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 border border-white/10 text-xs space-y-1 shadow-xl">
      <p className="text-white font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-zinc-400 capitalize">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: campaignStats, isLoading: chartLoading } = useGetDashboardCampaignStats();

  if (isLoading || !stats) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-white">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="glass shimmer-bg h-36 rounded-xl border-white/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Total Prospects", value: stats.totalProspects, icon: Users, desc: `${stats.prospectsNew} new this week`, delay: "delay-[0ms]" },
    { title: "Active Campaigns", value: stats.totalCampaigns, icon: Megaphone, desc: "Running now", delay: "delay-[75ms]" },
    { title: "Emails Sent", value: stats.emailsSent, icon: Send, desc: `${stats.emailsDraft} drafts pending`, delay: "delay-[150ms]" },
    { title: "Prospects Contacted", value: stats.prospectsContacted, icon: Clock, desc: "Awaiting replies", delay: "delay-[225ms]" },
  ];

  const chartData = (campaignStats ?? []).map((c) => ({
    name: c.campaignName.length > 16 ? c.campaignName.slice(0, 15) + "…" : c.campaignName,
    Sent: c.sent,
    Draft: c.draft,
  }));

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-light tracking-tight text-white">Overview</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, i) => (
          <Card key={i} className={`glass rounded-xl border-white/[0.05] hover:border-primary/30 transition-all duration-300 hover:glow-violet group animate-fade-up ${stat.delay}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <stat.icon size={14} />
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-4xl font-semibold text-white">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-2 font-medium tracking-wide uppercase">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign performance chart */}
      <Card className="glass rounded-xl border-white/[0.05] hover:border-white/[0.1] transition-colors animate-fade-up delay-[300ms]">
        <CardHeader className="pb-4 border-b border-white/[0.05]">
          <CardTitle className="font-light text-xl text-white">Campaign Performance</CardTitle>
          <p className="text-xs text-zinc-500 mt-1">Emails sent vs drafts per campaign</p>
        </CardHeader>
        <CardContent className="pt-6">
          {chartLoading ? (
            <div className="h-56 shimmer-bg rounded-lg" />
          ) : chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-zinc-600 text-sm">No campaign data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: "#a1a1aa", fontSize: 12 }}>{value}</span>}
                />
                <Bar dataKey="Sent" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={48} />
                <Bar dataKey="Draft" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass rounded-xl border-white/[0.05] hover:border-white/[0.1] transition-colors animate-fade-up delay-[375ms]">
        <CardHeader className="pb-4 border-b border-white/[0.05]">
          <CardTitle className="font-light text-xl text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 text-sm p-3 rounded-lg hover:bg-white/[0.02] transition-colors group">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activity.type.toLowerCase().includes('sent') ? 'bg-primary glow-violet' : 'bg-zinc-500'}`} />
                <span className="font-semibold text-white min-w-[120px]">{activity.type === "email_sent" ? "Email Sent" : "Draft Created"}</span>
                <span className="text-zinc-400 flex-1 group-hover:text-zinc-300 transition-colors">{activity.description}</span>
                <span className="text-zinc-500 text-xs font-medium tracking-wide">{new Date(activity.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="text-sm text-zinc-500 py-4 text-center">No recent activity.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
