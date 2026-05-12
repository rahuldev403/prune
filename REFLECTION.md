# Reflection

**1. The hardest bug:** Debugging a serverless edge crash caused by Drizzle auto-importing `better-sqlite3`. I had to trace the import tree, remove the incorrect alphabetized VS Code auto-import, and force the `@neondatabase/serverless` HTTP driver in the Next.js API route.

**2. A reversed decision:** I initially planned to use the Resend API for transactional emails, but reversed course when I hit sandbox domain limitations. I pivoted to standard SMTP using Nodemailer to ensure immediate delivery.

**3. Week 2 build:** If given another week, I would build an automated chron-job that tracks changes in vendor pricing APIs and automatically emails past leads if a new optimal tier becomes available for their saved stack.

**4. AI Tool Usage:** I used AI to quickly scaffold the Tailwind utility classes for the black-and-silver visual chart, but strictly avoided using it for the core `engine.ts` math to ensure the financial logic remained deterministic.

**5. Self-Rating:** - Discipline (8/10): Maintained strict daily commits and documentation despite external academic deadlines.
- Code Quality (8/10): Strict Zod typing and modular React components.
- Design Sense (9/10): Executed a highly polished, trustworthy B2B aesthetic.
- Problem Solving (9/10): Successfully pivoted API providers and email protocols when blocked.
- Entrepreneurial Thinking (8/10): Built a tool focused entirely on lead capture and tangible financial ROI.