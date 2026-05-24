import { Router, type IRouter } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db, prospectsTable, campaignsTable, emailsTable } from "@workspace/db";
import { GetDashboardStatsResponse, GetDashboardCampaignStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res): Promise<void> => {
  const [totalProspectsRow] = await db.select({ count: count() }).from(prospectsTable);
  const [totalCampaignsRow] = await db.select({ count: count() }).from(campaignsTable);
  const [emailsSentRow] = await db.select({ count: count() }).from(emailsTable).where(eq(emailsTable.status, "sent"));
  const [emailsDraftRow] = await db.select({ count: count() }).from(emailsTable).where(eq(emailsTable.status, "draft"));
  const [prospectsContactedRow] = await db.select({ count: count() }).from(prospectsTable).where(eq(prospectsTable.status, "contacted"));
  const [prospectsNewRow] = await db.select({ count: count() }).from(prospectsTable).where(eq(prospectsTable.status, "new"));

  // Recent activity: last 10 emails sent or created
  const recentEmails = await db
    .select({
      id: emailsTable.id,
      status: emailsTable.status,
      sentAt: emailsTable.sentAt,
      createdAt: emailsTable.createdAt,
      prospectId: emailsTable.prospectId,
    })
    .from(emailsTable)
    .orderBy(sql`${emailsTable.updatedAt} desc`)
    .limit(10);

  // Fetch prospect names for recent activity
  const prospectIds = [...new Set(recentEmails.map((e) => e.prospectId))];
  const prospects = prospectIds.length > 0
    ? await db
        .select({ id: prospectsTable.id, firstName: prospectsTable.firstName, lastName: prospectsTable.lastName, company: prospectsTable.company })
        .from(prospectsTable)
        .where(sql`${prospectsTable.id} = ANY(${sql.raw(`ARRAY[${prospectIds.join(",")}]`)})`)
    : [];

  const prospectMap = new Map(prospects.map((p) => [p.id, p]));

  const recentActivity = recentEmails.map((email) => {
    const prospect = prospectMap.get(email.prospectId);
    const name = prospect ? `${prospect.firstName} ${prospect.lastName} at ${prospect.company}` : "Unknown prospect";
    return {
      type: email.status === "sent" ? "email_sent" : "email_drafted",
      description: email.status === "sent" ? `Email sent to ${name}` : `Draft created for ${name}`,
      timestamp: email.sentAt ?? email.createdAt,
    };
  });

  const stats = GetDashboardStatsResponse.parse({
    totalProspects: totalProspectsRow?.count ?? 0,
    totalCampaigns: totalCampaignsRow?.count ?? 0,
    emailsSent: emailsSentRow?.count ?? 0,
    emailsDraft: emailsDraftRow?.count ?? 0,
    prospectsContacted: prospectsContactedRow?.count ?? 0,
    prospectsNew: prospectsNewRow?.count ?? 0,
    recentActivity,
  });

  res.json(stats);
});

router.get("/dashboard/campaign-stats", async (req, res): Promise<void> => {
  const campaigns = await db.select({ id: campaignsTable.id, name: campaignsTable.name }).from(campaignsTable);

  const results = await Promise.all(
    campaigns.map(async (campaign) => {
      const [sentRow] = await db
        .select({ count: count() })
        .from(emailsTable)
        .where(sql`${emailsTable.campaignId} = ${campaign.id} AND ${emailsTable.status} = 'sent'`);
      const [draftRow] = await db
        .select({ count: count() })
        .from(emailsTable)
        .where(sql`${emailsTable.campaignId} = ${campaign.id} AND ${emailsTable.status} = 'draft'`);
      const sent = sentRow?.count ?? 0;
      const draft = draftRow?.count ?? 0;
      return { campaignId: campaign.id, campaignName: campaign.name, sent, draft, total: sent + draft };
    })
  );

  const parsed = GetDashboardCampaignStatsResponse.parse(results);
  res.json(parsed);
});

export default router;
