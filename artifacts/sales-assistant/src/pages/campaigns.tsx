import React from "react";
import { useListCampaigns } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import { Link } from "wouter";

export default function Campaigns() {
  const { data: campaigns = [], isLoading } = useListCampaigns();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize and track your outreach strategies.</p>
        </div>
        <Link href="/campaigns/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="h-48 animate-pulse bg-muted" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Create your first campaign to group prospects and define the messaging tone.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id} className="border-border/50 shadow-sm hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-serif line-clamp-1">{c.name}</CardTitle>
                  <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="capitalize">{c.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">{c.description || "No description provided."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium truncate max-w-[150px]">{c.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tone</span>
                    <span className="font-medium capitalize">{c.tone}</span>
                  </div>
                </div>
                <Link href={`/campaigns/${c.id}`} className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
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
