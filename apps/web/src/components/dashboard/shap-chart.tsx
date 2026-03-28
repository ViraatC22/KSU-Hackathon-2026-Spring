"use client";

import { cn } from "@/lib/utils";

interface ShapFactor {
  feature: string;
  impact: number;       // positive = boost, negative = drag (raw points)
  description: string;
}

interface ShapWaterfallChartProps {
  factors: ShapFactor[];
  baseScore: number;
  finalScore: number;
}

export function ShapWaterfallChart({ factors, baseScore, finalScore }: ShapWaterfallChartProps) {
  const sorted = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 7);
  const maxAbs = Math.max(...sorted.map((f) => Math.abs(f.impact)), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>Base score: <span className="font-mono font-medium text-foreground">{baseScore}</span></span>
        <span>Score factors (SHAP-style XAI)</span>
        <span>Final: <span className="font-mono font-medium text-foreground">{finalScore}</span></span>
      </div>

      {sorted.map((factor, i) => {
        const isPositive = factor.impact >= 0;
        const barWidth = (Math.abs(factor.impact) / maxAbs) * 100;
        const color = isPositive ? "var(--zambezi-400)" : "#d94545";

        return (
          <div key={i} className="group">
            <div className="flex items-center gap-3">
              {/* Feature name */}
              <div className="w-40 shrink-0 text-xs text-right text-muted-foreground group-hover:text-foreground transition-colors truncate">
                {factor.feature}
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 relative flex items-center">
                <div className="w-full h-3 rounded-sm" style={{ backgroundColor: "hsl(20 8% 17%)" }}>
                  <div
                    className="h-full rounded-sm transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}40`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
              </div>

              {/* Impact value */}
              <div className={cn("w-16 shrink-0 text-xs font-mono font-bold text-right")}
                style={{ color }}>
                {isPositive ? "+" : ""}{factor.impact}
              </div>
            </div>

            {/* Description tooltip on hover */}
            <p className="text-[10px] text-muted-foreground ml-[11.5rem] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {factor.description}
            </p>
          </div>
        );
      })}

      {/* Net change summary */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t">
        <div className="w-40 shrink-0 text-xs text-right font-medium">Net Impact</div>
        <div className="flex-1 h-6 flex items-center">
          <span className="text-xs text-muted-foreground">
            {baseScore} → {finalScore}
          </span>
        </div>
        <div className={cn("w-16 shrink-0 text-xs font-mono font-bold text-right",
          finalScore - baseScore >= 0 ? "text-emerald-400" : "text-red-400")}>
          {finalScore - baseScore >= 0 ? "+" : ""}{finalScore - baseScore}
        </div>
      </div>
    </div>
  );
}
