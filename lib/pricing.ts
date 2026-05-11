export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Gemini"
  | "Windsurf";

export const PRICING_DB = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Ultra: 40,
  },
  "GitHub Copilot": {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Team: 30,
  },
  ChatGPT: {
    Plus: 20,
    Team: 30,
  },
  Gemini: {
    Pro: 20,
    Enterprise: 30,
  },
  Windsurf: {
    Starter: 0,
    Pro: 20,
  },
} as const;

export function calculateRetailSpend(
  tool: ToolName,
  plan: keyof (typeof PRICING_DB)[ToolName],
  seats: number,
): number {
  const toolPricing = PRICING_DB[tool];
  if (!toolPricing) return 0;

  const pricePerSeat =
    (toolPricing as Record<string, number>)[plan as string] || 0;
  return pricePerSeat * seats;
}
