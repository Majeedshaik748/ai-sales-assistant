# SalesAI — AI Sales Assistant

An AI-powered sales outreach tool for small SaaS companies. Drafts personalized cold emails using GPT, manages prospects and campaigns, and tracks email status from draft to sent.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/sales-assistant run dev` — run the frontend (port 23103)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI integration (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + shadcn/ui + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI via Replit AI Integrations (gpt-5-mini for email generation, gpt-5.4 for chat)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (prospects, campaigns, emails, conversations, messages)
- `artifacts/api-server/src/routes/` — Express route handlers (prospects, campaigns, emails, dashboard, openai)
- `artifacts/sales-assistant/src/` — React frontend (pages: Dashboard, Prospects, Campaigns, Emails)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)

## Architecture decisions

- Contract-first: OpenAPI spec gates all codegen; never hand-write types covered by codegen
- AI email generation is a standard JSON POST (not SSE) — gpt-5-mini with JSON mode for fast, structured output
- When an email is sent, the prospect's status is automatically updated to "contacted"
- Conversations (chat with AI assistant) are persisted via the conversations/messages schema from the OpenAI integration template
- All DB schemas are exported from `lib/db/src/schema/index.ts` — only exported tables get migrations

## Product

- **Dashboard**: Live stats (total prospects, active campaigns, emails sent/drafted, prospects contacted) + recent activity feed
- **Prospects**: Add/search/filter prospects by status or campaign; view individual prospect with full email history
- **AI Email Generation**: On any prospect detail page, click "Generate Email" — the AI uses the prospect's company, role, and campaign context to draft a personalized email. Edit and save as draft or send in one click.
- **Campaigns**: Group prospects by product/audience; set tone (professional, friendly, casual, urgent) and sender details
- **Emails**: Filter all emails by status (draft/sent); edit and send drafts

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml`
- Always run `pnpm --filter @workspace/db run push` after editing any schema file under `lib/db/src/schema/`
- Do not use operation-shaped names for OpenAPI body schemas (causes TS2308 collision) — use entity-shaped names like `ProspectInput`, not `CreateProspectBody`
- The `emails/generate` route must come before `emails/:id` in the Express router to avoid route conflicts

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/ai-integrations-openai/SKILL.md` for OpenAI integration details
