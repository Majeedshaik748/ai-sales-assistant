import React, { useState } from "react";
import { useListEmails } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Emails() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: emails = [], isLoading } = useListEmails({ 
    status: statusFilter === "all" ? undefined : statusFilter 
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Emails</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review drafts and sent outreach.</p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : emails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No emails found.</TableCell>
                </TableRow>
              ) : emails.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium max-w-md truncate">{e.subject}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'sent' ? 'default' : 'secondary'} className="capitalize">
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{e.sentAt ? new Date(e.sentAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Tabs>
    </div>
  );
}
