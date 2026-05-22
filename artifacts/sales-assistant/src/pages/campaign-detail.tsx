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
import { ArrowLeft, Users, Play, Pause, CheckCircle } from "lucide-react";
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

  if (loadingCampaign) return <div className="p-8 text-muted-foreground animate-pulse">Loading...</div>;
  if (!campaign) return <div className="p-8">Campaign not found</div>;

  const handleStatusChange = (status: string) => {
    updateCampaign.mutate({ id, data: { status } }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetCampaignQueryKey(id), data);
        toast({ title: "Campaign status updated" });
      }
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/campaigns")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{campaign.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={campaign.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-border/50 h-fit">
          <CardHeader className="pb-4 border-b border-border/50 mb-4">
            <CardTitle className="text-lg font-serif">Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Product</div>
              <div className="font-medium">{campaign.productName}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Target</div>
              <div className="font-medium">{campaign.targetIndustry || 'Any'}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Tone</div>
              <div className="font-medium capitalize">{campaign.tone}</div>
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="text-muted-foreground mb-1">Sender</div>
              <div className="font-medium">{campaign.senderName}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{campaign.senderEmail}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-border/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/20 border-b border-border/50">
            <div>
              <CardTitle className="text-lg font-serif">Prospects in Campaign</CardTitle>
              <CardDescription>People currently targeted by this outreach.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLocation("/prospects/new")}>Add Prospect</Button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProspects ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : prospects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 opacity-50 mb-3" />
                    No prospects assigned to this campaign yet.
                  </TableCell>
                </TableRow>
              ) : (
                prospects.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <Link href={`/prospects/${p.id}`} className="hover:underline text-foreground">
                        {p.firstName} {p.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{p.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/prospects/${p.id}`} className="text-primary text-sm hover:underline">
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
