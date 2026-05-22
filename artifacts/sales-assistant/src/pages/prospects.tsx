import React, { useState } from "react";
import { useListProspects } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Prospects() {
  const [search, setSearch] = useState("");
  const { data: prospects = [], isLoading } = useListProspects({ search: search || undefined });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'replied': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'converted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'unsubscribed': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">Prospects</h1>
          <p className="text-zinc-500 mt-2 text-sm">Manage your leads and their status.</p>
        </div>
        <Link href="/prospects/new" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white shadow-lg glow-violet active:scale-97 h-10 px-5 py-2">
          <Plus className="mr-2 h-4 w-4" /> Add Prospect
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search prospects..." 
            className="pl-10 glass border-white/[0.1] text-white placeholder:text-zinc-500 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="glass rounded-xl border-white/[0.05] overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20 hover:bg-black/20">
            <TableRow className="border-b border-white/[0.05]">
              <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Name</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Company</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Title</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b border-white/[0.05]">
                <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : prospects.length === 0 ? (
              <TableRow className="border-b border-white/[0.05]">
                <TableCell colSpan={4} className="text-center py-12 text-zinc-500">No prospects found.</TableCell>
              </TableRow>
            ) : prospects.map((p) => (
              <TableRow key={p.id} className="border-b border-white/[0.05] cursor-pointer hover:bg-white/[0.03] transition-colors group">
                <TableCell className="font-medium">
                  <Link href={`/prospects/${p.id}`} className="block">
                    <span className="text-white group-hover:text-primary transition-colors">{p.firstName} {p.lastName}</span>
                    <div className="text-xs text-zinc-500 font-normal mt-0.5">{p.email}</div>
                  </Link>
                </TableCell>
                <TableCell className="text-zinc-300">{p.company}</TableCell>
                <TableCell className="text-zinc-300">{p.jobTitle}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize font-medium ${getStatusColor(p.status)}`}>
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
