import { PRICING_DB, calculateRetailSpend, type ToolName } from "./pricing";
import type { SpendFormValues } from "./validations/spend";

export type AuditRecommendation = {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  savingsMonthly: number;
  reason: string;
};

export type AuditResult = {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
};

export function runAuditEngine(input: SpendFormValues): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySavings = 0;

  const activeTools = input.tools.map((t) => t.toolName);

  input.tools.forEach((tool) => {
    const { toolName, plan, seats, monthlySpend, dailyTokens } = tool;
    const typedToolName = toolName as ToolName;

    let toolSavings = 0;
    let action = "Keep current plan";
    let reason = "Your spend is optimal for your usage.";
    let retailOverpay = 0;

    const isApi =
      typedToolName === "Anthropic API" || typedToolName === "OpenAI API";

    const planOptions = PRICING_DB[typedToolName];
    if (planOptions && !isApi) {
      const matchedPlan = Object.keys(planOptions).find(
        (option) => option.toLowerCase() === plan.toLowerCase(),
      ) as keyof typeof planOptions | undefined;
      if (matchedPlan) {
        const retailSpend = calculateRetailSpend(
          typedToolName,
          matchedPlan,
          seats,
        );
        if (monthlySpend > retailSpend) {
          retailOverpay = monthlySpend - retailSpend;
        }
      }
    }

    // --- RULE 0: API Usage Optimization ---
    if (isApi) {
      if (dailyTokens && dailyTokens < 100000 && monthlySpend > 50) {
        toolSavings = monthlySpend - 20; // estimate replacing with a single $20 subscription for low volume
        action = "Switch to Flat-Rate Subscription";
        reason = `Your API volume (${dailyTokens.toLocaleString()} tokens/day) is too low to justify \$${monthlySpend}/mo. Switch to a flat-rate chat tool for better unit economics.`;
      } else if (dailyTokens && dailyTokens > 5000000 && monthlySpend > 1000) {
        toolSavings = monthlySpend * 0.15;
        action = "Negotiate Enterprise API Commits";
        reason = `Your volume is enterprise-scale. Continuing on pay-as-you-go is a premium. Committing to provisioned throughput will drop costs by an estimated 15%.`;
      }
    }

    // --- RULE 1: Capabilty Overlap (Redundancy) ---
    if (typedToolName === "GitHub Copilot" && activeTools.includes("Cursor")) {
      toolSavings = monthlySpend;
      action = "Cancel GitHub Copilot";
      reason =
        "Cursor includes advanced autocomplete and code generation natively. Maintaining a separate Copilot license is redundant.";
    }

    // --- RULE 2: Tier Inefficiency (Zombie Seats) ---
    else if (
      typedToolName === "Claude" &&
      plan.toLowerCase() === "team" &&
      seats < 5
    ) {
      // Claude Team requires 5 seats minimum ($150/mo). If they have 3 devs, Pro ($60/mo) is better.
      const optimalProSpend = seats * PRICING_DB["Claude"]["Pro"];
      if (monthlySpend > optimalProSpend) {
        toolSavings = monthlySpend - optimalProSpend;
        action = "Downgrade to Claude Pro";
        reason = `Team plans require minimum seat overhead. For ${seats} users, individual Pro licenses save capital without losing core capabilities.`;
      }
    }

    // --- RULE 3: Retail vs. API Direct / Usage Optimization ---
    else if (
      typedToolName === "ChatGPT" &&
      plan.toLowerCase() === "plus" &&
      input.primaryUseCase === "coding"
    ) {
      // If they only use it for coding, Cursor or Windsurf is usually a better spend than a raw ChatGPT sub.
      if (
        !activeTools.includes("Cursor") &&
        !activeTools.includes("Windsurf")
      ) {
        action = "Switch to Cursor or API-direct";
        reason =
          "For a pure coding use-case, an AI IDE or direct API access yields better ROI than a consumer chat interface.";
        // We won't strictly claim dollar savings here unless we know their API volume, so savings = 0, but it adds immense value.
      }
    }

    // --- RULE 4: Retail price mismatch ---
    if (retailOverpay > 0 && toolSavings === 0) {
      toolSavings = retailOverpay;
      action = "Normalize to retail pricing";
      reason = `Your entered spend exceeds published ${toolName} ${plan} pricing for ${seats} seat(s).`;
    }

    // --- RULE 5: The Credex Pivot (High Volume) ---
    // If they are spending > $200 on API or enterprise tools, we pitch the Credex discount.
    if (monthlySpend >= 200 && toolSavings === 0) {
      const estimatedCredexDiscount = monthlySpend * 0.2; // Assuming Credex saves them 20%
      toolSavings = estimatedCredexDiscount;
      action = "Shift billing to Credex Credits";
      reason = `At \$${monthlySpend}/mo, you are paying retail rates. Utilizing secondary-market infrastructure credits can immediately reduce this bill.`;
    }

    if (toolSavings > 0 || action !== "Keep current plan") {
      recommendations.push({
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: action,
        savingsMonthly: toolSavings,
        reason,
      });
      totalMonthlySavings += toolSavings;
    }
  });

  return {
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    recommendations,
  };
}
