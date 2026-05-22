import React from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetCampaign, 
  getGetCampaignQueryKey, 
  useUpdateCampaign, 
  useListProspects 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CampaignDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading: loadingCampaign } = useGetCampaign(id, { 
    query: { enabled: !!id, queryKey: getGetCampaignQueryKey(id) } 
  });
  
  const { data: prospects = [], isLoading: loadingProspects } = useListProspects({ campaignId: id });
  const updateCampaign = useUpdateCampaign();

  if (loadingCampaign) return <div className="p-10 text-center text-zinc-500 animate-pulse">Loading campaign...</div>;
  if (!campaign) return <div className="p-10 text-center text-zinc-500">Campaign not found</div>;

  const handleStatusChange = (status: string) => {
    updateCampaign.mutate({ id, data: { status } }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetCampaignQueryKey(id), data);
        toast({ title: "Campaign status updated" });
      }
    });
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto animate-fade-up">
      <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-white hover:bg-transparent transition-colors" onClick={() => setLocation("/campaigns")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">{campaign.name}</h1>
          <p className="text-zinc-400 mt-3 max-w-2xl text-lg leading-relaxed">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={campaign.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] capitalize glass border-white/[0.1] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/[0.1]">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 glass border-white/[0.05] h-fit rounded-xl">
          <CardHeader className="pb-4 border-b border-white/[0.05]">
            <CardTitle className="text-lg font-medium text-white">Strategy</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-sm">
            <div>
              <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Product</div>
              <div className="font-medium text-white">{campaign.productName}</div>
            </div>
            <div>
              <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Target</div>
              <div className="font-medium text-zinc-300">{campaign.targetIndustry || 'Any'}</div>
            </div>
            <div>
              <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Tone</div>
              <div className="font-medium text-primary capitalize glow-violet">{campaign.tone}</div>
            </div>
            <div className="pt-6 border-t border-white/[0.05]">
              <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Sender</div>
              <div className="font-medium text-white">{campaign.senderName}</div>
              <div className="text-xs text-zinc-500 mt-1">{campaign.senderEmail}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass border-white/[0.05] rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-black/20 border-b border-white/[0.05]">
            <div>
              <CardTitle className="text-lg font-medium text-white">Prospects in Campaign</CardTitle>
              <CardDescription className="text-zinc-500">People currently targeted by this outreach.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="glass border-white/[0.1] text-white hover:bg-white/[0.05] active:scale-95" onClick={() => setLocation("/prospects/new")}>
              Add Prospect
            </Button>
          </CardHeader>
          <Table>
            <TableHeader className="hover:bg-transparent">
              <TableRow className="border-b border-white/[0.05]">
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Name</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Company</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Status</TableHead>
                <TableHead className="text-right uppercase tracking-widest text-xs font-medium text-zinc-500">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProspects ? (
                <TableRow className="border-b border-white/[0.05]"><TableCell colSpan={4} className="text-center py-12 text-zinc-500">Loading prospects...</TableCell></TableRow>
              ) : prospects.length === 0 ? (
                <TableRow className="border-b border-white/[0.05]">
                  <TableCell colSpan={4} className="text-center py-16 text-zinc-500">
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 opacity-50" />
                    </div>
                    No prospects assigned to this campaign yet.
                  </TableCell>
                </TableRow>
              ) : (
                prospects.map(p => (
                  <TableRow key={p.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-medium">
                      <Link href={`/prospects/${p.id}`} className="hover:text-primary transition-colors text-white block">
                        {p.firstName} {p.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-zinc-300">{p.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize font-medium ${p.status === 'new' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : p.status === 'contacted' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/prospects/${p.id}`} className="text-primary text-sm hover:underline font-medium">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
