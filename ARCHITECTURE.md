# System Architecture

## Stack Choice
- **Next.js 16 (App Router):** Chosen for its ability to handle both the SEO-friendly React frontend and the secure serverless API routes in a single repository.
- **NeonDB + Drizzle ORM:** Provides type-safe database queries with a serverless HTTP connection model ideal for Vercel deployments.
- **Tailwind + shadcn/ui:** Allows for rapid iteration of a highly professional, dark-mode B2B aesthetic without the bloat of heavy component libraries.

## Data Flow
```mermaid
graph TD
    A[Visitor] -->|Inputs Stack| B(SpendInputForm)
    B -->|State Persisted| C{LocalStorage}
    B -->|POST /api/audit| D[Next.js API Route]
    D --> E[runAuditEngine]
    E -->|Calculates Savings| F[Results Object]
    D -->|Prompts| G[Gemini API]
    G -->|Returns Summary| H[AI Text]
    D -->|Saves Results + Summary| I[(Neon DB)]
    I -->|Returns ID| J[Redirect /audit/id]
    J --> K[Shareable Results Page]