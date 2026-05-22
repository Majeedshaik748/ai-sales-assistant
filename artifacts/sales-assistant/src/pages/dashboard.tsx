import React from "react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Send, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse bg-muted h-32" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Total Prospects", value: stats.totalProspects, icon: Users, desc: `${stats.prospectsNew} new this week` },
    { title: "Active Campaigns", value: stats.totalCampaigns, icon: Megaphone, desc: "Running now" },
    { title: "Emails Sent", value: stats.emailsSent, icon: Send, desc: `${stats.emailsDraft} drafts pending` },
    { title: "Prospects Contacted", value: stats.prospectsContacted, icon: Clock, desc: "Awaiting replies" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-foreground">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  <span className="font-medium text-foreground">{activity.type}</span>
                  <span className="text-muted-foreground flex-1">{activity.description}</span>
                  <span className="text-muted-foreground text-xs">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <div className="text-sm text-muted-foreground">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
