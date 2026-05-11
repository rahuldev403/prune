import { db } from "@/index";
import { audits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import type { AuditResult } from "@/lib/engine";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [audit] = await db.select().from(audits).where(eq(audits.id, id));

  if (!audit) return { title: "Audit Not Found" };

  const savings = audit.totalMonthlySavings;
  const title =
    savings > 0
      ? `We found $${savings}/mo in AI overspend.`
      : "My AI stack is fully optimized.";

  return {
    title: `${title} | Prune`,
    description:
      "Run a free audit to see if you are overpaying for Cursor, Claude, ChatGPT, and other AI tools.",
    openGraph: {
      title,
      description:
        "Run a free audit to see if you are overpaying for AI tools.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
    },
  };
}

export default async function AuditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [audit] = await db.select().from(audits).where(eq(audits.id, id));

  if (!audit) notFound();
  const results = coerceAuditResult(audit.engineResults);
  const savings = audit.totalMonthlySavings;
  const annualSavings = savings * 12;

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-background via-background to-muted/40 p-8 md:p-12 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Audit Complete
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                Your AI spend snapshot
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                We modeled tool overlap, retail pricing, and tier efficiency to
                surface actionable savings.
              </p>
              <a
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
              >
                Rerun the audit
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Potential Monthly Savings
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl md:text-6xl font-black tracking-tight text-primary">
                  ${savings}
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-4 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-500">
                ${annualSavings} annual impact
              </p>
            </div>
          </div>
        </section>

        {audit.aiSummery && (
          <section className="rounded-3xl border border-border bg-card/80 p-8 md:p-10 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Executive Summary
              </h3>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                Generated insights
              </span>
            </div>
            <div className="mt-6">{renderSummaryContent(audit.aiSummery)}</div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Tool breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                Line-item recommendations ranked by monthly savings.
              </p>
            </div>
            <div className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-muted-foreground">
              {results.recommendations.length} recommendations
            </div>
          </div>

          {results.recommendations.length > 0 ? (
            <div className="grid gap-5">
              {results.recommendations.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-semibold text-foreground">
                          {rec.toolName}
                        </h4>
                        <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500">
                          ${rec.currentSpend}/mo current
                        </span>
                      </div>
                      <p className="text-base font-medium text-foreground">
                        {rec.recommendedAction}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rec.reason}
                      </p>
                    </div>

                    {rec.savingsMonthly > 0 && (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-center text-emerald-500 min-w-[140px]">
                        <span className="block text-xs font-semibold uppercase tracking-wider">
                          Save monthly
                        </span>
                        <span className="mt-1 block text-3xl font-black">
                          ${rec.savingsMonthly}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
              <p className="text-lg font-semibold">Your stack is optimized.</p>
              <p className="text-sm text-muted-foreground mt-2">
                We did not find obvious redundancies with the current inputs.
              </p>
            </div>
          )}
        </section>

        <section>
          {savings >= 500 ? (
            <div className="rounded-3xl bg-primary text-primary-foreground p-10 shadow-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/70">
                    Credex - Prune opportunity
                  </p>
                  <h3 className="text-2xl md:text-3xl font-semibold">
                    Stop paying retail for AI infrastructure.
                  </h3>
                  <p className="max-w-2xl text-primary-foreground/80">
                    You are losing over ${annualSavings} a year. Credex - Prune
                    provides discounted credits for the exact tools you are
                    already using.
                  </p>
                </div>
                <button className="h-12 rounded-full bg-background px-8 text-sm font-semibold text-foreground shadow-lg shadow-black/10 cursor-pointer">
                  Book Credex - Prune Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card/80 p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    Stay in the loop
                  </p>
                  <h3 className="text-2xl font-semibold">
                    You're spending well.
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Your stack is relatively lean. Drop your email below, and we
                    will notify you if Credex - Prune secures infrastructure
                    discounts for teams your size.
                  </p>
                </div>
                <div className="flex w-full max-w-sm items-center gap-2">
                  <input
                    type="email"
                    placeholder="founder@startup.com"
                    className="flex h-11 w-full rounded-full border border-input bg-background px-4 text-sm"
                  />
                  <button className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground cursor-pointer">
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function renderSummaryContent(summary: string) {
  const parsed = parseSummary(summary);

  return (
    <div className="space-y-4">
      {parsed.subject && (
        <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Subject
          </p>
          <p className="text-base font-semibold text-foreground">
            {parsed.subject}
          </p>
        </div>
      )}
      {parsed.intro &&
        splitParagraphs(parsed.intro).map((paragraph, index) => (
          <p
            key={`intro-${index}`}
            className="text-lg leading-relaxed text-foreground/90"
          >
            {renderEmphasis(paragraph)}
          </p>
        ))}
      {parsed.items.length > 0 && (
        <ol className="space-y-3 rounded-lg border border-border bg-background/70 px-5 py-4 text-foreground/90">
          {parsed.items.map((item, index) => (
            <li key={index} className="leading-relaxed">
              <span className="mr-2 font-semibold text-primary">
                {index + 1}.
              </span>
              {renderEmphasis(item)}
            </li>
          ))}
        </ol>
      )}
      {parsed.outro &&
        splitParagraphs(parsed.outro).map((paragraph, index) => (
          <p
            key={`outro-${index}`}
            className="text-base leading-relaxed text-foreground/80"
          >
            {renderEmphasis(paragraph)}
          </p>
        ))}
    </div>
  );
}

function splitParagraphs(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return [] as string[];

  if (trimmed.includes("\n")) {
    return trimmed
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 2) return [trimmed];

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }

  return paragraphs;
}

function parseSummary(summary: string) {
  const trimmed = summary.trim();
  let subject: string | undefined;
  let body = trimmed;
  const subjectMatch = body.match(/^Subject:\s*(.+?)(?:\n|$)/i);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
    body = body.slice(subjectMatch[0].length).trim();
  }

  const listMatches = [
    ...body.matchAll(/(?:^|\s)(\d+)\.\s+([\s\S]+?)(?=(?:\s\d+\.\s+)|$)/g),
  ];
  let intro = body;
  let outro = "";
  const items: string[] = [];

  if (listMatches.length > 0) {
    const firstMatch = listMatches[0];
    const firstIndex = firstMatch.index ?? 0;
    intro = body.slice(0, firstIndex).trim();
    const lastMatch = listMatches[listMatches.length - 1];
    const lastIndex = (lastMatch.index ?? 0) + lastMatch[0].length;
    outro = body.slice(lastIndex).trim();
    listMatches.forEach((match) => {
      items.push(match[2].trim());
    });
  }

  return { subject, intro, items, outro };
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

const EMPTY_AUDIT_RESULT: AuditResult = {
  totalMonthlySavings: 0,
  totalAnnualSavings: 0,
  recommendations: [],
};

function coerceAuditResult(value: unknown): AuditResult {
  if (!value || typeof value !== "object") return EMPTY_AUDIT_RESULT;

  const maybe = value as Partial<AuditResult>;
  if (!Array.isArray(maybe.recommendations)) return EMPTY_AUDIT_RESULT;

  return {
    totalMonthlySavings:
      typeof maybe.totalMonthlySavings === "number"
        ? maybe.totalMonthlySavings
        : 0,
    totalAnnualSavings:
      typeof maybe.totalAnnualSavings === "number"
        ? maybe.totalAnnualSavings
        : 0,
    recommendations: maybe.recommendations as AuditResult["recommendations"],
  };
}
