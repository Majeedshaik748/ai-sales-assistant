import React from "react";
import { useListCampaigns } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone } from "lucide-react";
import { Link } from "wouter";

export default function Campaigns() {
  const { data: campaigns = [], isLoading } = useListCampaigns();

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">Campaigns</h1>
          <p className="text-zinc-500 mt-2 text-sm">Organize and track your outreach strategies.</p>
        </div>
        <Link href="/campaigns/new" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white shadow-lg glow-violet active:scale-97 h-10 px-5 py-2">
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="h-48 glass shimmer-bg rounded-xl border-white/[0.05]" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="glass border-dashed border-2 border-white/[0.1] bg-transparent shadow-none rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 glow-violet">
              <Megaphone size={28} />
            </div>
            <h3 className="text-xl font-light text-white mb-2">No campaigns yet</h3>
            <p className="text-zinc-500 max-w-sm">Create your first campaign to group prospects and define the messaging tone.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id} className="glass rounded-xl border-white/[0.05] hover:border-primary/40 transition-all duration-300 group flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl font-medium text-white line-clamp-1">{c.name}</CardTitle>
                  <Badge variant="outline" className={`capitalize shrink-0 font-medium ${c.status === 'active' ? 'bg-primary/20 text-primary border-primary/30 glow-violet' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
                    {c.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-3 text-zinc-400">{c.description || "No description provided."}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                <div className="space-y-3 text-sm mb-6 bg-black/20 p-4 rounded-lg border border-white/[0.02]">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Product</span>
                    <span className="font-medium text-white truncate max-w-[150px]">{c.productName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Tone</span>
                    <span className="font-medium text-zinc-300 capitalize">{c.tone}</span>
                  </div>
                </div>
                <Link href={`/campaigns/${c.id}`} className="mt-auto inline-flex w-full items-center justify-center rounded-lg text-sm font-medium glass border-white/[0.1] bg-white/[0.02] text-white hover:bg-white/[0.05] hover:border-white/[0.2] transition-all h-10 px-4 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30">
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
