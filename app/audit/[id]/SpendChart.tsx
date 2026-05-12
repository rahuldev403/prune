"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  toolName: string;
  currentSpend: number;
  savingsMonthly: number;
};

export function SpendChart({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!recommendations || recommendations.length === 0) return null;
  const maxSpend = Math.max(...recommendations.map((r) => r.currentSpend));
  const totalCurrent = recommendations.reduce(
    (sum, rec) => sum + rec.currentSpend,
    0,
  );
  const totalOptimized = recommendations.reduce(
    (sum, rec) => sum + (rec.currentSpend - rec.savingsMonthly),
    0,
  );
  const totalSavings = Math.max(totalCurrent - totalOptimized, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/95 via-card/90 to-primary/10 p-5 sm:p-6 md:p-8 space-y-6 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)]">
      <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/70 pb-4 gap-4">
        <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Detailed breakdown
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
            Spend optimization outlook
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ${totalCurrent.toLocaleString()} current vs. $
            {totalOptimized.toLocaleString()} optimized
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            ${totalSavings.toLocaleString()} potential savings
          </span>
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-muted-foreground/50" />
              Current
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-primary shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
              Optimized
            </span>
          </div>
        </div>
      </div>

      <div className="relative space-y-6">
        {recommendations.map((rec, idx) => {
          const optimalSpend = rec.currentSpend - rec.savingsMonthly;
          const savingsPercent = rec.currentSpend
            ? Math.round((rec.savingsMonthly / rec.currentSpend) * 100)
            : 0;

          const currentWidth = Math.max((rec.currentSpend / maxSpend) * 100, 2);
          const optimalWidth = Math.max((optimalSpend / maxSpend) * 100, 2);

          return (
            <div
              key={idx}
              className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-3 sm:p-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {rec.toolName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    ${rec.currentSpend.toLocaleString()} current / $
                    {optimalSpend.toLocaleString()} optimized
                  </p>
                </div>
                <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] sm:text-xs font-semibold text-primary w-fit mx-auto sm:mx-0">
                  {rec.savingsMonthly > 0
                    ? `Save $${rec.savingsMonthly}/mo`
                    : "Optimized"}
                  {rec.savingsMonthly > 0 && (
                    <span className="text-[9px] sm:text-[10px] font-semibold text-primary/70">
                      {savingsPercent}%
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-muted-foreground/40 to-muted-foreground/80 transition-all duration-1000 ease-out"
                    style={{ width: isLoaded ? `${currentWidth}%` : "0%" }}
                  />
                </div>

                <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary/70 via-primary to-primary shadow-[0_0_14px_rgba(255,255,255,0.2)] transition-all duration-1000 ease-out delay-300"
                    style={{ width: isLoaded ? `${optimalWidth}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
