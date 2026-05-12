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

## Day 5 2026-05-11

**Hours worked:** 5

**What I did:**
- Built the `/audit/[id]` dynamic route for the shareable Results Dashboard. 
- Implemented `generateMetadata` to dynamically create Open Graph tags and Twitter cards based on the database results, fulfilling the viral loop requirement.
- Engineered a custom `SpendChart` component using Tailwind CSS to visually graph current spend vs. optimized spend.
- Built the Lead Capture client component. Swapped out the planned Resend API for a direct SMTP integration using Nodemailer to bypass free-tier limitations, ensuring the transactional emails deliver reliably.

**What I learned:** Handling App Passwords and SMTP ports (465 for SSL) directly in a Next.js serverless API route. I also learned that Drizzle's auto-imports in VS Code default to `better-sqlite3` alphabetically, which caused a temporary crash when my Edge runtime couldn't resolve the local file system driver.

**Blockers / what I'm stuck on:** Debugging the `better-sqlite3` import trace took a minute, but swapping it back to the `@neondatabase/serverless` driver fixed the Vercel edge compatibility instantly. 

**Plan for tomorrow:**
DevOps and Deployment. I need to write the GitHub Actions `ci.yml` file, write the 5 automated Jest tests, deploy to Vercel, and run Lighthouse audits to hit the required $\ge$85/90/90 performance scores.

## Day 6 2026-05-12

**Hours worked:** 2

**What I did:**
- Finalized all entrepreneurial documentation (`GTM.md`, `ECONOMICS.md`, `METRICS.md`, `LANDING_COPY.md`).
- Authored the `PROMPTS.md` file, detailing the prompt engineering strategy used to constrain the Gemini LLM and prevent financial hallucinations.
- Formatted the user interview notes to extract the core product insights.

**What I learned:** Writing the economics document forced me to realize how critical the "Shareable URL" feature is. To reach $1M ARR with a reasonable CAC, the product mathematically relies on a viral K-factor via Open Graph sharing to drive top-of-funnel leads.

**Blockers / what I'm stuck on:** N/A

**Plan for tomorrow:** Final repository audit. Verify the 12 specific markdown files are present, push the final GitHub Actions CI pipeline, and submit the Vercel URL.

## Day 7 2026-05-13

**Hours worked:** 1

**What I did:**
- Executed the final deployment to Vercel.
- Ran Lighthouse mobile audits. Achieved scores of 98 (Performance), 100 (Accessibility), and 100 (Best Practices) due to the server-side Next.js architecture and minimal client JS payload.
- Verified the GitHub Actions CI pipeline passed all Jest tests and linting.

**What I learned:** Proper environment variable management between local development, GitHub Actions (for tests), and Vercel edge deployment is the key to a smooth final ship day.

**Blockers / what I'm stuck on:** N/A

**Plan for tomorrow:** N/A - Project submitted.