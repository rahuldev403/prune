import { runAuditEngine } from "./engine";
import { SpendFormValues } from "./validations/spend";

describe("Audit Engine Logic", () => {
  test("1. Flags redundancy when using Copilot and Cursor together", () => {
    const input: SpendFormValues = {
      teamSize: "10",
      primaryUseCase: "coding",
      tools: [
        { toolName: "Cursor", plan: "Pro", seats: 2, monthlySpend: 40 },
        {
          toolName: "GitHub Copilot",
          plan: "Business",
          seats: 2,
          monthlySpend: 38,
        },
      ],
    };
    const result = runAuditEngine(input);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(38);
    expect(
      result.recommendations.some((r) => r.toolName === "GitHub Copilot"),
    ).toBe(true);
  });

  test("2. Flags zombie seats on Claude Team plan with < 5 users", () => {
    const input: SpendFormValues = {
      teamSize: "3",
      primaryUseCase: "mixed",
      tools: [
        { toolName: "Claude", plan: "Team", seats: 3, monthlySpend: 150 },
      ],
    };
    const result = runAuditEngine(input);
    // 3 users on Pro ($20) = $60. 150 - 60 = 90 savings.
    expect(result.totalMonthlySavings).toBe(90);
    expect(result.recommendations[0].recommendedAction).toContain("Downgrade");
  });

  test("3. Recommends Credex for high API/Enterprise spend (> $200)", () => {
    const input: SpendFormValues = {
      teamSize: "20",
      primaryUseCase: "data",
      tools: [
        {
          toolName: "OpenAI API",
          plan: "Direct",
          seats: 1,
          monthlySpend: 1000,
        },
      ],
    };
    const result = runAuditEngine(input);
    expect(result.totalMonthlySavings).toBe(200); // 20% of 1000
    expect(result.recommendations[0].recommendedAction).toContain("Credex");
  });

  test("4. Suggests IDE over Chat for pure coding workflows", () => {
    const input: SpendFormValues = {
      teamSize: "1",
      primaryUseCase: "coding",
      tools: [
        { toolName: "ChatGPT", plan: "Plus", seats: 1, monthlySpend: 20 },
      ],
    };
    const result = runAuditEngine(input);
    // Savings might be 0, but action should suggest switching
    expect(result.recommendations[0].recommendedAction).toContain(
      "Switch to Cursor",
    );
  });

  test("5. Returns 0 savings for a perfectly optimized stack", () => {
    const input: SpendFormValues = {
      teamSize: "1",
      primaryUseCase: "writing",
      tools: [{ toolName: "Claude", plan: "Pro", seats: 1, monthlySpend: 20 }],
    };
    const result = runAuditEngine(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(0);
  });

  test("6. Flags retail price mismatch (overpaying)", () => {
    const input: SpendFormValues = {
      teamSize: "1",
      primaryUseCase: "coding",
      tools: [
        { toolName: "Cursor", plan: "Pro", seats: 1, monthlySpend: 40 }, // $20 retail
      ],
    };
    const result = runAuditEngine(input);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedAction).toContain(
      "Normalize to retail pricing",
    );
  });
});
