# AI Sales Assistant

An AI-powered sales outreach tool built for small SaaS companies. Drafts personalized cold emails using GPT, manages prospects and campaigns, and tracks email status from draft to sent.

Built by **[Shaik Majeed](https://www.linkedin.com/in/majeed-shaik)** · [GitHub](https://github.com/Majeedshaik748) · [skmajeed1123@gmail.com](mailto:skmajeed1123@gmail.com)

---

## Features

- **AI Email Generation** — One-click personalized cold emails using GPT-5-mini with JSON mode. Respects campaign tone (professional, friendly, casual, urgent) and prospect context.
- **Prospect Management** — Add, search, and filter prospects by status or campaign. View each prospect's full email history.
- **Campaign Management** — Group prospects by audience/product, set tone and sender details.
- **Email Tracking** — Filter all emails by status (draft / sent). Edit and send drafts in one click. Sending auto-updates prospect status to "contacted".
- **AI Assistant** — Real-time streaming chat powered by GPT-5.4. Ask questions about your pipeline, get outreach advice, brainstorm messaging.
- **Live Dashboard** — Stats (total prospects, active campaigns, emails sent/drafted, prospects contacted) + recent activity feed.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS + shadcn/ui + wouter |
| Backend | Express 5 + Node.js 24 |
| Database | PostgreSQL + Drizzle ORM |
| AI | OpenAI GPT-5-mini / GPT-5.4 via Replit AI Integrations |
| Validation | Zod v4 + drizzle-zod |
| API Contracts | OpenAPI 3.1 + Orval codegen (React Query hooks) |
| Build | esbuild (CJS bundle) + TypeScript 5.9 |
| Package Manager | pnpm workspaces (monorepo) |

---

## Project Structure

```
ai-sales-assistant/
├── artifacts/
│   ├── api-server/          # Express 5 API (routes, middleware, esbuild config)
│   └── sales-assistant/     # React + Vite frontend
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 spec (source of truth for all contracts)
│   ├── api-client-react/    # Generated React Query hooks (do not edit)
│   ├── api-zod/             # Generated Zod schemas (do not edit)
│   └── db/                  # Drizzle ORM schema + migrations
└── scripts/                 # Shared utility scripts
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 9+
- PostgreSQL database

### 1. Clone the repo

```bash
git clone https://github.com/Majeedshaik748/ai-sales-assistant.git
cd ai-sales-assistant
pnpm install
```

### 2. Set environment variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/salesai
AI_INTEGRATIONS_OPENAI_BASE_URL=<your-openai-compatible-base-url>
AI_INTEGRATIONS_OPENAI_API_KEY=<your-api-key>
SESSION_SECRET=<random-secret>
```

### 3. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 4. Run the app

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/sales-assistant run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm run typecheck` | Full typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks and Zod schemas from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev only) |

---

## Architecture Notes

- **Contract-first**: The OpenAPI spec (`lib/api-spec/openapi.yaml`) is the source of truth. All types are generated from it — never hand-write types covered by codegen.
- **AI email generation** is a standard JSON POST (not SSE) using GPT-5-mini with JSON mode for fast, structured output.
- **AI Assistant chat** uses SSE streaming with GPT-5.4, persisted via a conversations/messages schema.
- When an email is sent, the prospect's `status` is automatically updated to `"contacted"`.

---

## Screenshots

> Dashboard · Prospects · AI Email Generation · AI Assistant · Contact

*Futuristic dark glassmorphism UI with violet + cyan accents, built with Tailwind CSS and shadcn/ui.*

---

## License

MIT
