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

## Day 2 2026-05-08

**Hours worked:** 0.75

**What I did:**
- Engineered the `SpendInputForm` using `react-hook-form` and `zod` for rigorous type-safe data capture.
- Implemented the dynamic tool array, allowing users to add or remove AI tools from their stack effortlessly.
- Solved the MVP requirement for state persistence by syncing the form state to `localStorage`. I applied some rigorous functional testing to the sync logic, ensuring edge cases like empty arrays, rapid page reloads, and hydration mismatches didn't break the UI.

**What I learned:** I deepened my understanding of Next.js hydration cycles. When syncing React state with `localStorage` in a Server Component environment, you have to defer rendering the form until the component is mounted on the client (`useEffect` + `isMounted` state) to avoid severe React hydration errors.

**Blockers / what I'm stuck on:**
Managing the complex object shapes inside `useFieldArray` while maintaining strict Zod typing required a few workarounds. I also realized the Audit Engine is going to need a very clean interface to ingest this Zod payload.

**Plan for tomorrow:**
Build the core `Audit Engine` in pure TypeScript. This is the brain of "Prune." I need to map the user's input against the `PRICING_DB` and write the hardcoded business logic to calculate redundancy and optimal seat tiers.

## Day 3 2026-05-09

**Hours worked:** 0

**What I did:** Took a required day away from the codebase to focus entirely on studying for my B.S. in Data Science end-semester exams at IIT Madras tomorrow. 

**What I learned:** N/A (Academic review day)

**Blockers / what I'm stuck on:** N/A

**Plan for tomorrow:** Complete the university exams, then immediately return to build the core pure TypeScript `Audit Engine` and author the 5 required automated unit tests for the calculation logic.