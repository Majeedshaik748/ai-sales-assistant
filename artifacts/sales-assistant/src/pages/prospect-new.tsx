import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProspect, useListCampaigns } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";

const prospectSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
  campaignId: z.coerce.number().optional().or(z.literal(0).transform(() => undefined)),
});

export default function NewProspect() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createProspect = useCreateProspect();
  const { data: campaigns = [] } = useListCampaigns();

  const form = useForm<z.infer<typeof prospectSchema>>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      industry: "",
      companySize: "",
      linkedinUrl: "",
      notes: "",
      campaignId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof prospectSchema>) {
    createProspect.mutate({ data: values }, {
      onSuccess: (data) => {
        toast({ title: "Prospect created", description: "The prospect has been successfully added." });
        setLocation(`/prospects/${data.id}`);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create prospect.", variant: "destructive" });
      }
    });
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-3xl mx-auto animate-fade-up">
      <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-white hover:bg-transparent transition-colors" onClick={() => setLocation("/prospects")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prospects
      </Button>

      <Card className="glass rounded-xl border-white/[0.05] overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/[0.05] pb-4 flex flex-row items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary glow-violet">
            <UserPlus size={20} />
          </div>
          <div>
            <CardTitle className="text-2xl font-light text-white">Add New Prospect</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">Enter prospect details below.</p>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">First Name</FormLabel>
                    <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Last Name</FormLabel>
                    <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Email</FormLabel>
                    <FormControl><Input type="email" className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">LinkedIn URL</FormLabel>
                    <FormControl><Input type="url" placeholder="https://linkedin.com/in/..." className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg placeholder:text-zinc-600" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Company</FormLabel>
                    <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="jobTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Job Title</FormLabel>
                    <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Industry</FormLabel>
                    <FormControl><Input className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="companySize" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Company Size</FormLabel>
                    <FormControl><Input placeholder="e.g. 1-10, 50-100" className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg placeholder:text-zinc-600" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="campaignId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Assign to Campaign (Optional)</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v ? Number(v) : undefined)} value={field.value?.toString() || ""}>
                    <FormControl>
                      <SelectTrigger className="glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg">
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass border-white/[0.1]">
                      <SelectItem value="0">None</SelectItem>
                      {campaigns.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Notes</FormLabel>
                  <FormControl><Textarea className="min-h-[100px] glass border-white/[0.1] text-white focus-visible:ring-primary rounded-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" disabled={createProspect.isPending} className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white shadow-lg glow-violet active:scale-95 transition-all">
                {createProspect.isPending ? "Creating..." : "Save Prospect"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
