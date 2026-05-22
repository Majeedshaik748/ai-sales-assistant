import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetProspect, 
  getGetProspectQueryKey, 
  useUpdateProspect, 
  useListCampaigns, 
  useListEmails, 
  getListEmailsQueryKey,
  useCreateEmail, 
  useSendEmail,
  useGenerateEmail
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Sparkles, Save, Mail, Building, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProspectDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prospect, isLoading: loadingProspect } = useGetProspect(id, { 
    query: { enabled: !!id, queryKey: getGetProspectQueryKey(id) } 
  });
  const { data: campaigns = [] } = useListCampaigns();
  const { data: emails = [], isLoading: loadingEmails } = useListEmails({ prospectId: id }, {
    query: { enabled: !!id, queryKey: getListEmailsQueryKey({ prospectId: id }) }
  });

  const updateProspect = useUpdateProspect();
  const createEmail = useCreateEmail();
  const sendEmail = useSendEmail();
  const generateEmail = useGenerateEmail();

  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  if (loadingProspect) return <div className="p-8 text-muted-foreground animate-pulse">Loading...</div>;
  if (!prospect) return <div className="p-8">Prospect not found</div>;

  const handleStatusChange = (status: string) => {
    updateProspect.mutate({ id, data: { status } }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetProspectQueryKey(id), data);
        toast({ title: "Status updated" });
      }
    });
  };

  const handleGenerate = () => {
    generateEmail.mutate({ 
      data: { 
        prospectId: id, 
        campaignId: prospect.campaignId || undefined, 
        customInstructions 
      } 
    }, {
      onSuccess: (res) => {
        setDraftSubject(res.subject);
        setDraftBody(res.body);
        toast({ title: "Email generated" });
      },
      onError: () => {
        toast({ title: "Generation failed", variant: "destructive" });
      }
    });
  };

  const handleSaveDraft = () => {
    if (!draftSubject || !draftBody) return;
    createEmail.mutate({ data: { prospectId: id, campaignId: prospect.campaignId || undefined, subject: draftSubject, body: draftBody } }, {
      onSuccess: () => {
        toast({ title: "Draft saved" });
        queryClient.invalidateQueries({ queryKey: getListEmailsQueryKey({ prospectId: id }) });
        setDraftSubject("");
        setDraftBody("");
      }
    });
  };

  const handleSend = () => {
    if (!draftSubject || !draftBody) return;
    createEmail.mutate({ data: { prospectId: id, campaignId: prospect.campaignId || undefined, subject: draftSubject, body: draftBody } }, {
      onSuccess: (email) => {
        sendEmail.mutate({ data: { id: email.id } }, {
          onSuccess: () => {
            toast({ title: "Email sent!" });
            queryClient.invalidateQueries({ queryKey: getListEmailsQueryKey({ prospectId: id }) });
            handleStatusChange("contacted");
            setDraftSubject("");
            setDraftBody("");
          }
        });
      }
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/prospects")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{prospect.firstName} {prospect.lastName}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" /> {prospect.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={prospect.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-serif">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><Building className="h-4 w-4" /> Company</div>
              <div className="font-medium">{prospect.company}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><Briefcase className="h-4 w-4" /> Role</div>
              <div className="font-medium">{prospect.jobTitle}</div>
            </div>
            {prospect.industry && (
              <div>
                <div className="text-muted-foreground mb-1">Industry</div>
                <div className="font-medium">{prospect.industry}</div>
              </div>
            )}
            {prospect.linkedinUrl && (
              <div>
                <div className="text-muted-foreground mb-1">LinkedIn</div>
                <a href={prospect.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">Profile Link</a>
              </div>
            )}
            {prospect.campaignId && (
              <div>
                <div className="text-muted-foreground mb-1">Campaign</div>
                <div className="font-medium">{campaigns.find(c => c.id === prospect.campaignId)?.name || "Unknown"}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50">
          <Tabs defaultValue="compose" className="w-full">
            <CardHeader className="pb-0 border-b border-border/50">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 mb-[-1px]">
                <TabsTrigger value="compose" className="rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Compose Email</TabsTrigger>
                <TabsTrigger value="history" className="rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">History ({emails.length})</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="compose" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-md border border-border/50 space-y-4">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Generation</Label>
                    <Textarea 
                      placeholder="Custom instructions (e.g., 'Mention our recent feature launch', 'Keep it very short')" 
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="text-sm min-h-[80px]"
                    />
                    <Button onClick={handleGenerate} disabled={generateEmail.isPending} className="w-full" variant="secondary">
                      <Sparkles className="mr-2 h-4 w-4" /> {generateEmail.isPending ? "Generating..." : "Generate AI Email"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input 
                      value={draftSubject} 
                      onChange={(e) => setDraftSubject(e.target.value)} 
                      placeholder="Email subject" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea 
                      value={draftBody} 
                      onChange={(e) => setDraftBody(e.target.value)} 
                      className="min-h-[250px] font-mono text-sm" 
                      placeholder="Email body" 
                    />
                  </div>
                  
                  <div className="flex gap-4 justify-end pt-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={!draftSubject || !draftBody || createEmail.isPending}>
                      <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button onClick={handleSend} disabled={!draftSubject || !draftBody || sendEmail.isPending}>
                      <Send className="mr-2 h-4 w-4" /> Send Now
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                {loadingEmails ? (
                  <div className="py-8 text-center text-muted-foreground animate-pulse">Loading history...</div>
                ) : emails.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No emails sent yet.</div>
                ) : (
                  <div className="space-y-4">
                    {emails.map(email => (
                      <div key={email.id} className="border border-border/50 rounded-md p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-foreground">{email.subject}</h4>
                          <Badge variant={email.status === 'sent' ? 'default' : 'secondary'} className="capitalize">{email.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted/20 p-3 rounded">{email.body}</div>
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                          {email.status === 'sent' ? `Sent on ${new Date(email.sentAt!).toLocaleString()}` : `Created on ${new Date(email.createdAt).toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
