import * as z from "zod";

export const TOOL_OPTIONS = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

export const USE_CASES = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
] as const;

export const toolEntrySchema = z.object({
  toolName: z.enum(TOOL_OPTIONS),
  plan: z.string().min(1, "Plan is required"),
  seats: z.coerce
    .number()
    .min(1, "Must have at least 1 seat")
    .optional()
    .default(1),
  monthlySpend: z.coerce.number().min(0, "Spend connot be negative"),
  dailyTokens: z.coerce.number().optional(),
});

export const spendFormSchema = z.object({
  teamSize: z.string().min(1, "Team size is required"),
  primaryUseCase: z.enum(USE_CASES),
  tools: z
    .array(toolEntrySchema)
    .min(1, "Please add at least one tool to audit"),
});

export type SpendFormValues = z.infer<typeof spendFormSchema>;
