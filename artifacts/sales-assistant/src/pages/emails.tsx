import React, { useState } from "react";
import { useListEmails } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Emails() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: emails = [], isLoading } = useListEmails({ 
    status: statusFilter === "all" ? undefined : statusFilter 
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">Emails</h1>
          <p className="text-zinc-500 mt-2 text-sm">Review drafts and sent outreach.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 p-1 glass w-fit rounded-lg border-white/[0.05]">
          {['all', 'draft', 'sent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${statusFilter === tab ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Card className="glass rounded-xl border-white/[0.05] overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20 hover:bg-black/20">
              <TableRow className="border-b border-white/[0.05]">
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Subject</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Status</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Created</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-medium text-zinc-500">Sent At</TableHead>
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
              ) : emails.length === 0 ? (
                <TableRow className="border-b border-white/[0.05]">
                  <TableCell colSpan={4} className="text-center py-12 text-zinc-500">No emails found.</TableCell>
                </TableRow>
              ) : emails.map((e) => (
                <TableRow key={e.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-medium max-w-md truncate text-white">{e.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize font-medium ${e.status === 'sent' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30 glow-violet' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-zinc-400 text-sm">{e.sentAt ? new Date(e.sentAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
