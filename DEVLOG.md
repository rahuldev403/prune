## Day 1 2026-05-07

**Hours worked:** 1

**What I did:**
- Initialized the Next.js 15 App Router environment with TypeScript and Tailwind.
- Scaffolded the base UI layer using shadcn/ui, configuring a strict monochromatic dark theme to mimic the developer-focused aesthetics of tools like GitHub and LeetCode. 
- Architected the database foundation. Set up a serverless Postgres instance on NeonDB and connected it via Drizzle ORM to avoid edge-runtime connection pooling limits.
- Drafted and pushed the initial `schema.ts`, defining the `audits` table (using `jsonb` for flexible input storage) and the `leads` table to tie back to the shareable audit IDs.
- Verified the database connection and executed the first schema push.

**What I learned:** I spent time digging into how Drizzle handles JSONB columns compared to standard ORMs. I learned that using Neon's HTTP driver (`@neondatabase/serverless`) is vastly superior for Next.js App Router deployments because it doesn't exhaust connection pools during serverless function spin-ups, which is crucial for a viral-loop tool that might see traffic spikes.

**Blockers / what I'm stuck on:**
Deciding exactly how strictly to type the `inputData` JSONB column in Drizzle. I want to keep it flexible enough to handle different plan tiers for Cursor vs. Claude, but rigid enough that the Audit Engine logic doesn't break due to a missing key. I'm currently solving this by deferring the strict validation to the Zod schema on the frontend.

**Plan for tomorrow:**
Build the multi-step "Spend Input" form using React Hook Form + Zod. I need to ensure the form state persists across page reloads (as required by the PRD) and successfully writes the payload to the Neon database so we have actual data to feed the Audit Engine.