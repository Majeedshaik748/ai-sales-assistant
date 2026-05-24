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

  if (loadingProspect) return <div className="p-10 text-center text-zinc-500 animate-pulse">Loading details...</div>;
  if (!prospect) return <div className="p-10 text-center text-zinc-500">Prospect not found</div>;

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
        toast({ title: "Email generated successfully" });
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
        sendEmail.mutate({ id: email.id }, {
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
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto animate-fade-up">
      <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-white hover:bg-transparent transition-colors" onClick={() => setLocation("/prospects")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prospects
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">{prospect.firstName} {prospect.lastName}</h1>
          <p className="text-zinc-400 mt-2 flex items-center gap-2 font-medium">
            <Mail className="h-4 w-4" /> {prospect.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={prospect.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] capitalize glass border-white/[0.1] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/[0.1]">
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Details */}
        <Card className="lg:col-span-1 glass border-white/[0.05] h-fit rounded-xl">
          <CardHeader className="pb-4 border-b border-white/[0.05]">
            <CardTitle className="text-lg font-medium text-white">Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-sm">
            <div>
              <div className="text-zinc-500 flex items-center gap-2 mb-1 uppercase tracking-widest text-[10px] font-semibold"><Building className="h-3 w-3" /> Company</div>
              <div className="font-medium text-white">{prospect.company}</div>
            </div>
            <div>
              <div className="text-zinc-500 flex items-center gap-2 mb-1 uppercase tracking-widest text-[10px] font-semibold"><Briefcase className="h-3 w-3" /> Role</div>
              <div className="font-medium text-white">{prospect.jobTitle}</div>
            </div>
            {prospect.industry && (
              <div>
                <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Industry</div>
                <div className="font-medium text-white">{prospect.industry}</div>
              </div>
            )}
            {prospect.linkedinUrl && (
              <div>
                <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">LinkedIn</div>
                <a href={prospect.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block font-medium">Profile Link</a>
              </div>
            )}
            {prospect.campaignId && (
              <div>
                <div className="text-zinc-500 mb-1 uppercase tracking-widest text-[10px] font-semibold">Campaign</div>
                <div className="font-medium text-white">{campaigns.find(c => c.id === prospect.campaignId)?.name || "Unknown"}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compose / History */}
        <Card className="lg:col-span-2 glass border-white/[0.05] rounded-xl overflow-hidden">
          <Tabs defaultValue="compose" className="w-full">
            <CardHeader className="pb-0 border-b border-white/[0.05] bg-black/20">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 mb-[-1px] gap-6">
                <TabsTrigger value="compose" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-zinc-500 hover:text-zinc-300 pb-3">Compose Email</TabsTrigger>
                <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-zinc-500 hover:text-zinc-300 pb-3">History ({emails.length})</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <TabsContent value="compose" className="mt-0 space-y-6">
                <div className="glass border-white/[0.1] bg-white/[0.02] p-5 rounded-xl space-y-4">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">AI Generation</Label>
                  <Textarea 
                    placeholder="Custom instructions (e.g., 'Mention our recent feature launch', 'Keep it very short')" 
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="text-sm min-h-[80px] glass border-white/[0.1] text-white placeholder:text-zinc-600 focus-visible:ring-primary rounded-lg"
                  />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={generateEmail.isPending} 
                    className={`w-full transition-all text-white ${generateEmail.isPending ? 'opacity-80 shimmer-bg border border-white/20' : 'bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 glow-violet shadow-lg active:scale-[0.98]'}`}
                  >
                    <Sparkles className={`mr-2 h-4 w-4 ${generateEmail.isPending ? 'animate-spin' : ''}`} /> 
                    {generateEmail.isPending ? "Generating Draft..." : "Generate AI Email"}
                  </Button>
                </div>

                <div className={`transition-all duration-500 ease-in-out ${draftSubject || draftBody ? 'opacity-100 translate-y-0' : 'opacity-70'}`}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Subject</Label>
                      <Input 
                        value={draftSubject} 
                        onChange={(e) => setDraftSubject(e.target.value)} 
                        placeholder="Email subject" 
                        className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Body</Label>
                      <Textarea 
                        value={draftBody} 
                        onChange={(e) => setDraftBody(e.target.value)} 
                        className="min-h-[250px] font-mono text-sm glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg p-4 leading-relaxed" 
                        placeholder="Email body" 
                      />
                    </div>
                    
                    <div className="flex gap-4 justify-end pt-4">
                      <Button variant="outline" onClick={handleSaveDraft} disabled={!draftSubject || !draftBody || createEmail.isPending} className="glass border-white/[0.1] text-white hover:bg-white/[0.05] active:scale-95">
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                      </Button>
                      <Button onClick={handleSend} disabled={!draftSubject || !draftBody || sendEmail.isPending} className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95">
                        <Send className="mr-2 h-4 w-4" /> Send Now
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                {loadingEmails ? (
                  <div className="py-12 text-center text-zinc-500 animate-pulse">Loading history...</div>
                ) : emails.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500">No emails sent yet.</div>
                ) : (
                  <div className="space-y-4">
                    {emails.map(email => (
                      <div key={email.id} className="glass border-white/[0.05] rounded-xl p-5 space-y-4 group hover:border-white/[0.1] transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-medium text-white leading-tight">{email.subject}</h4>
                          <Badge variant="outline" className={`capitalize shrink-0 ${email.status === 'sent' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
                            {email.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-zinc-300 whitespace-pre-wrap font-mono bg-black/30 p-4 rounded-lg border border-white/[0.02]">{email.body}</div>
                        <div className="text-xs font-medium text-zinc-500 pt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
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

// Added missing icon import for ProspectDetail
import { Clock } from "lucide-react";
