# Product Metrics

**North Star Metric: Total Overspend Identified ($)**
Why: This is the leading indicator of value. If this number is high, founders are getting shock-value from the tool, and Credex has a massive pool of potential savings to monetize.

**3 Input Metrics:**
1. **Audit Completion Rate:** (Audits Completed / Landing Page Visitors). Measures form friction.
2. **Lead Capture Rate:** (Emails Given / Audits Completed). Measures if the results page actually proved value.
3. **Viral Coefficient (K-factor):** How many new unique visitors arrive via a shared `/audit/[id]` URL per completed audit. 

**What I'd Instrument First:**
PostHog. I'd specifically track the drop-off rate between the "Stack Input" step and the "Run Audit" button click to see if users are abandoning the form because they don't know their exact spend numbers.

**Pivot Trigger:**
If the **Lead Capture Rate drops below 2%**, we pivot. It means the audit is a fun novelty, but the savings aren't painful enough to warrant a sales conversation with Credex.