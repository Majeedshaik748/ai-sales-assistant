import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, prospectsTable } from "@workspace/db";
import {
  ListProspectsQueryParams,
  ListProspectsResponse,
  CreateProspectBody,
  GetProspectParams,
  GetProspectResponse,
  UpdateProspectParams,
  UpdateProspectBody,
  UpdateProspectResponse,
  DeleteProspectParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/prospects", async (req, res): Promise<void> => {
  const params = ListProspectsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(prospectsTable).$dynamic();

  if (params.data.campaignId != null) {
    query = query.where(eq(prospectsTable.campaignId, params.data.campaignId));
  }
  if (params.data.status != null) {
    query = query.where(eq(prospectsTable.status, params.data.status));
  }
  if (params.data.search != null) {
    const s = `%${params.data.search}%`;
    query = query.where(
      or(
        ilike(prospectsTable.firstName, s),
        ilike(prospectsTable.lastName, s),
        ilike(prospectsTable.email, s),
        ilike(prospectsTable.company, s),
      ),
    );
  }

  const prospects = await query.orderBy(prospectsTable.createdAt);
  res.json(ListProspectsResponse.parse(prospects));
});

router.post("/prospects", async (req, res): Promise<void> => {
  const parsed = CreateProspectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [prospect] = await db.insert(prospectsTable).values(parsed.data).returning();
  res.status(201).json(GetProspectResponse.parse(prospect));
});

router.get("/prospects/:id", async (req, res): Promise<void> => {
  const params = GetProspectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [prospect] = await db.select().from(prospectsTable).where(eq(prospectsTable.id, params.data.id));
  if (!prospect) {
    res.status(404).json({ error: "Prospect not found" });
    return;
  }
  res.json(GetProspectResponse.parse(prospect));
});

router.patch("/prospects/:id", async (req, res): Promise<void> => {
  const params = UpdateProspectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProspectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [prospect] = await db
    .update(prospectsTable)
    .set(parsed.data)
    .where(eq(prospectsTable.id, params.data.id))
    .returning();
  if (!prospect) {
    res.status(404).json({ error: "Prospect not found" });
    return;
  }
  res.json(UpdateProspectResponse.parse(prospect));
});

router.delete("/prospects/:id", async (req, res): Promise<void> => {
  const params = DeleteProspectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [prospect] = await db.delete(prospectsTable).where(eq(prospectsTable.id, params.data.id)).returning();
  if (!prospect) {
    res.status(404).json({ error: "Prospect not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
