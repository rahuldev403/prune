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
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Audit Complete
        </h1>
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-6xl md:text-8xl font-black tracking-tighter text-primary">
            ${savings}
          </span>
          <span className="text-xl text-muted-foreground font-medium">
            Potential Monthly Savings
          </span>
        </div>
        <p className="text-emerald-500 font-medium bg-emerald-500/10 inline-block px-4 py-1.5 rounded-full mt-4">
          ${annualSavings} Annual Impact
        </p>
      </div>
      {audit.aiSummery && (
        <div className="bg-muted/30 border border-border rounded-xl p-6 md:p-8">
          <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-3">
            Executive Summary
          </h3>
          <p className="text-lg leading-relaxed text-foreground/90">
            {audit.aiSummery}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight border-b border-border pb-4">
          Tool Breakdown
        </h3>

        {results.recommendations.length > 0 ? (
          <div className="grid gap-4">
            {results.recommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg">{rec.toolName}</h4>
                    <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded">
                      Currently ${rec.currentSpend}/mo
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {rec.recommendedAction}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {rec.reason}
                  </p>
                </div>

                {rec.savingsMonthly > 0 && (
                  <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-3 rounded-lg text-center shrink-0 min-w-30">
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Save
                    </span>
                    <span className="block text-2xl font-black">
                      ${rec.savingsMonthly}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/20 border border-border border-dashed rounded-lg">
            <p className="text-lg font-medium">
              Your stack is highly optimized.
            </p>
            <p className="text-muted-foreground">
              We couldn't find any obvious redundancies based on your current
              inputs.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        {savings >= 500 ? (
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold">
              Stop paying retail for AI infrastructure.
            </h3>
            <p className="max-w-2xl mx-auto text-primary-foreground/80">
              You are losing over ${annualSavings} a year. Credex provides
              discounted credits for the exact tools you are already using.
            </p>
            <button className="bg-background text-foreground font-bold px-8 py-3 rounded-lg mt-4 hover:scale-105 transition-transform">
              Book Credex Consultation
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-3">
            <h3 className="text-xl font-bold">You're spending well.</h3>
            <p className="text-muted-foreground">
              Your stack is relatively lean. Drop your email below, and we'll
              notify you if Credex secures infrastructure discounts for startups
              of your size.
            </p>
            <div className="flex max-w-sm mx-auto gap-2 mt-4">
              <input
                type="email"
                placeholder="founder@startup.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm">
                Notify Me
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
