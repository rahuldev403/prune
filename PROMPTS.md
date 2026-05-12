# Prompts
verified 2026-05-12

## The Summary Generation Prompt
**Model:** `gemini-3.5-flash-preview`

**The Prompt:**
`You are an expert SaaS financial auditor. Write a punchy, professional 100-word summary for an engineering manager. Their total monthly AI overspend is ${savings}. Briefly mention these specific recommendations: ${actions}. Do not use pleasantries. Be direct.`

**Why I wrote it this way:**
I strictly separated the math from the language generation. LLMs are notoriously unreliable at calculating financial optimizations based on rapidly changing external pricing data. By hardcoding the calculation engine in TypeScript and passing the *results* into the prompt variables (`${savings}` and `${actions}`), I force the LLM to act strictly as a formatting and summarization engine, eliminating the risk of hallucinations. The "No pleasantries. Be direct." instruction prevents the typical robotic "Certainly! Here is your audit..." output.

**What I tried that didn't work:**
Initially, I passed the raw JSON payload of the user's stack directly to the LLM and asked it to "find the savings." It confidently hallucinated outdated pricing for ChatGPT Enterprise and hallucinated a tier for Cursor that doesn't exist. This failure led to the architectural decision to hardcode the math.