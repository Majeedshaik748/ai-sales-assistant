import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, emailsTable, prospectsTable, campaignsTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  ListEmailsQueryParams,
  ListEmailsResponse,
  CreateEmailBody,
  GetEmailParams,
  GetEmailResponse,
  UpdateEmailParams,
  UpdateEmailBody,
  UpdateEmailResponse,
  DeleteEmailParams,
  SendEmailParams,
  SendEmailResponse,
  GenerateEmailBody,
  GenerateEmailResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/emails", async (req, res): Promise<void> => {
  const params = ListEmailsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(emailsTable).$dynamic();
  if (params.data.prospectId != null) {
    query = query.where(eq(emailsTable.prospectId, params.data.prospectId));
  }
  if (params.data.campaignId != null) {
    query = query.where(eq(emailsTable.campaignId, params.data.campaignId));
  }
  if (params.data.status != null) {
    query = query.where(eq(emailsTable.status, params.data.status));
  }

  const emails = await query.orderBy(emailsTable.createdAt);
  res.json(ListEmailsResponse.parse(emails));
});

router.post("/emails/generate", async (req, res): Promise<void> => {
  const parsed = GenerateEmailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [prospect] = await db.select().from(prospectsTable).where(eq(prospectsTable.id, parsed.data.prospectId));
  if (!prospect) {
    res.status(404).json({ error: "Prospect not found" });
    return;
  }

  let campaignContext = "";
  if (parsed.data.campaignId != null) {
    const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, parsed.data.campaignId));
    if (campaign) {
      campaignContext = `
Campaign: ${campaign.name}
Product: ${campaign.productName}
Product Description: ${campaign.productDescription}
Target Industry: ${campaign.targetIndustry ?? "general"}
Tone: ${campaign.tone}
Sender Name: ${campaign.senderName}
Sender Email: ${campaign.senderEmail}`;
    }
  }

  const prospectContext = `
Prospect Name: ${prospect.firstName} ${prospect.lastName}
Email: ${prospect.email}
Company: ${prospect.company}
Job Title: ${prospect.jobTitle}
Industry: ${prospect.industry ?? "not specified"}
Company Size: ${prospect.companySize ?? "not specified"}
LinkedIn: ${prospect.linkedinUrl ?? "not provided"}
Notes: ${prospect.notes ?? "none"}`;

  const customInstructions = parsed.data.customInstructions ? `\nAdditional instructions: ${parsed.data.customInstructions}` : "";

  const systemPrompt = `You are an expert B2B sales copywriter. Write personalized, concise outreach emails that feel human and relevant — not spammy or generic. Always reference specific details about the prospect's role or company. Keep emails under 150 words in the body. Return ONLY valid JSON with "subject" and "body" fields.`;

  const userPrompt = `Write a personalized cold outreach email.${prospectContext}${campaignContext}${customInstructions}

Return JSON like:
{"subject": "...", "body": "..."}

The body should be plain text (no HTML), conversational, and end with a clear but low-pressure call to action.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  let parsed2: { subject?: string; body?: string } = {};
  try {
    parsed2 = JSON.parse(content);
  } catch {
    req.log.error({ content }, "Failed to parse AI response JSON");
    res.status(500).json({ error: "Failed to generate email" });
    return;
  }

  const result = GenerateEmailResponse.parse({
    subject: parsed2.subject ?? "Follow-up",
    body: parsed2.body ?? "",
  });

  res.json(result);
});

router.post("/emails", async (req, res): Promise<void> => {
  const parsed = CreateEmailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [email] = await db.insert(emailsTable).values(parsed.data).returning();
  res.status(201).json(GetEmailResponse.parse(email));
});

router.get("/emails/:id", async (req, res): Promise<void> => {
  const params = GetEmailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [email] = await db.select().from(emailsTable).where(eq(emailsTable.id, params.data.id));
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  res.json(GetEmailResponse.parse(email));
});

router.patch("/emails/:id", async (req, res): Promise<void> => {
  const params = UpdateEmailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEmailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [email] = await db
    .update(emailsTable)
    .set(parsed.data)
    .where(eq(emailsTable.id, params.data.id))
    .returning();
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  res.json(UpdateEmailResponse.parse(email));
});

router.delete("/emails/:id", async (req, res): Promise<void> => {
  const params = DeleteEmailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [email] = await db.delete(emailsTable).where(eq(emailsTable.id, params.data.id)).returning();
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/emails/:id/send", async (req, res): Promise<void> => {
  const params = SendEmailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [email] = await db
    .update(emailsTable)
    .set({ status: "sent", sentAt: new Date() })
    .where(eq(emailsTable.id, params.data.id))
    .returning();
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  // Update prospect status to "contacted" if currently "new"
  await db
    .update(prospectsTable)
    .set({ status: "contacted" })
    .where(eq(prospectsTable.id, email.prospectId));

  res.json(SendEmailResponse.parse(email));
});

export default router;
