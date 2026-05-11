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
  // We use a tiny bit of state to trigger the animation on load
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!recommendations || recommendations.length === 0) return null;

  // Find the highest spend so we can scale the bars proportionally
  const maxSpend = Math.max(...recommendations.map((r) => r.currentSpend));

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
          Spend Optimization
        </h3>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-zinc-700"></div> Current
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-zinc-300 shadow-[0_0_8px_rgba(212,212,216,0.4)]"></div>{" "}
            Optimized
          </span>
        </div>
      </div>

      {/* The Bars */}
      <div className="space-y-6">
        {recommendations.map((rec, idx) => {
          const optimalSpend = rec.currentSpend - rec.savingsMonthly;

          // Calculate percentages (minimum 2% so the bar is always visible)
          const currentWidth = Math.max((rec.currentSpend / maxSpend) * 100, 2);
          const optimalWidth = Math.max((optimalSpend / maxSpend) * 100, 2);

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-200">{rec.toolName}</span>
                <span className="text-zinc-400">
                  {rec.savingsMonthly > 0
                    ? `Save $${rec.savingsMonthly}/mo`
                    : "Optimized"}
                </span>
              </div>

              <div className="space-y-1.5 relative">
                {/* Current Spend Bar (Dark Silver/Gray) */}
                <div className="h-2.5 w-full bg-zinc-900/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-zinc-700 transition-all duration-1000 ease-out"
                    style={{ width: isLoaded ? `${currentWidth}%` : "0%" }}
                  />
                </div>

                {/* Optimized Spend Bar (Bright Silver) */}
                <div className="h-2.5 w-full bg-zinc-900/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-zinc-300 shadow-[0_0_10px_rgba(212,212,216,0.3)] transition-all duration-1000 ease-out delay-300"
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
