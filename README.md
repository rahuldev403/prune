# Credex - Prune

![Credex - Prune Home Page](public/image.png)

## Your AI spend, rebuilt for clarity.

**Credex - Prune** is a financial-grade AI spend auditor tailored to uncover how your team actually uses AI tools. Identify redundant tools, overpriced tiers, and missed pricing efficiencies in minutes.

### Key Features

- **Precision Pricing:** Benchmarks against retail tiers to flag spend leakage quickly.
- **Overlap Detection:** Highlights redundant tools so you can consolidate your AI stack.
- **Actionable Savings:** Get clear next steps with monthly and annual impact totals.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Decisions & Trade-offs
1. **NeonDB over standard Postgres:** Chose serverless HTTP drivers to avoid connection pooling exhaustion during Next.js edge-runtime spin-ups.
2. **Gemini over Anthropic:** Pivoted to Google's Gemini `3.5-flash-preview` for the summary generation to bypass strict regional VoIP API billing filters while maintaining speed.
3. **SMTP over Resend:** Replaced the Resend API with direct `nodemailer` SMTP to ensure transactional emails deliver reliably without free-tier domain restrictions.
4. **Hardcoded Engine over AI Math:** Kept the core financial calculation strictly in pure TypeScript to ensure 100% deterministic, defensible results, using AI purely for qualitative summarization.
5. **Local Storage Sync:** Implemented a custom `useEffect` hydration bypass to sync the complex React Hook Form state with `localStorage` to survive page reloads without breaking server-side rendering.