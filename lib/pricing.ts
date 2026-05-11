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
    "Pro+": 60,
    Ultra: 200,
    Business: 40, // Business / Teams seat
  },
  "GitHub Copilot": {
    Free: 0,
    Pro: 10,
    "Pro+": 39,
    Business: 19,
    Enterprise: 39,
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Max5x: 100,
    Max20x: 200,
    TeamStandard: 25,
    TeamPremium: 125,
  },
  ChatGPT: {
    Free: 0,
    Go: 8,
    Plus: 20,
    Pro: 200,
    Business: 25,
  },
  Gemini: {
    Free: 0,          // web/app chat
    AIPlus: 7.99,     // "Google AI Plus"
    AIPro: 19.99,     // "Google AI Pro"
    AIUltra: 249.99,  // "Google AI Ultra"
  },
  Windsurf: {
    Free: 0,
    Pro: 20,
    Max: 200,
    Teams: 40,
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