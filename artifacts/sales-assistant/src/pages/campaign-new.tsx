import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Megaphone } from "lucide-react";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(10, "Product description should be detailed"),
  targetIndustry: z.string().optional(),
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email("Valid sender email is required"),
  tone: z.enum(["professional", "friendly", "casual", "urgent"]),
});

export default function NewCampaign() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      productName: "",
      productDescription: "",
      targetIndustry: "",
      senderName: "",
      senderEmail: "",
      tone: "professional",
    },
  });

  function onSubmit(values: z.infer<typeof campaignSchema>) {
    createCampaign.mutate({ data: values }, {
      onSuccess: (data) => {
        toast({ title: "Campaign created", description: "Your new campaign is ready." });
        setLocation(`/campaigns/${data.id}`);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create campaign.", variant: "destructive" });
      }
    });
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-3xl mx-auto animate-fade-up">
      <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-white hover:bg-transparent transition-colors" onClick={() => setLocation("/campaigns")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Button>

      <Card className="glass rounded-xl border-white/[0.05] overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/[0.05] pb-4 flex flex-row items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary glow-violet">
            <Megaphone size={20} />
          </div>
          <div>
            <CardTitle className="text-2xl font-light text-white">Create Campaign</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">Configure outreach strategy.</p>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-white/[0.05] pb-3">Campaign Details</h3>
                
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Campaign Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Q4 Enterprise Outreach" className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg placeholder:text-zinc-600" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Description (Internal)</FormLabel>
                    <FormControl><Textarea className="min-h-[80px] glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-white/[0.05] pb-3 mt-8">Product & Messaging</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="productName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Product/Service Name</FormLabel>
                      <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="targetIndustry" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Target Industry</FormLabel>
                      <FormControl><Input placeholder="e.g. Healthcare, Fintech" className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg placeholder:text-zinc-600" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="productDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Value Proposition / Product Description</FormLabel>
                    <FormDescription className="text-zinc-500 text-xs mt-1 mb-2">The AI will use this to write emails.</FormDescription>
                    <FormControl><Textarea className="min-h-[120px] glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg placeholder:text-zinc-600" placeholder="We help companies save 30% on..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Voice & Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass border-white/[0.1]">
                        <SelectItem value="professional">Professional & Direct</SelectItem>
                        <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="urgent">Urgent & Value-driven</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-white/[0.05] pb-3 mt-8">Sender Info</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="senderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Sender Name</FormLabel>
                      <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="senderEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Sender Email</FormLabel>
                      <FormControl><Input type="email" className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={createCampaign.isPending} className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white shadow-lg glow-violet active:scale-95 transition-all h-12 text-md font-medium">
                  {createCampaign.isPending ? "Creating..." : "Launch Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
