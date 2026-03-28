"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

function useCountUp(target: number | string, duration = 1400): string {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof target === "string") {
      // If it's a string like "K2.4M" or "94.2%" animate the numeric portion
      const match = target.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
      if (!match) { setDisplay(target); return; }
      const [, prefix, numStr, suffix] = match;
      const num = parseFloat(numStr.replace(/,/g, ""));
      if (isNaN(num)) { setDisplay(target); return; }
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = num * eased;
        const formatted = numStr.includes(",")
          ? Math.round(current).toLocaleString()
          : numStr.includes(".")
          ? current.toFixed(numStr.split(".")[1].length)
          : Math.round(current).toString();
        setDisplay(`${prefix}${formatted}${suffix}`);
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    } else {
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(target * eased).toLocaleString());
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [target, duration]);

  return display;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  accentColor?: "copper" | "teal" | "green" | "red" | "default";
}

export function StatCard({ title, value, description, icon: Icon, trend, className, accentColor = "default" }: StatCardProps) {
  const animated = useCountUp(value);

  const accentStyles: Record<string, { border: string; iconBg: string; iconColor: string }> = {
    copper: { border: "border-l-[var(--copper-500)]", iconBg: "bg-orange-950/30", iconColor: "text-orange-400" },
    teal:   { border: "border-l-[var(--zambezi-500)]", iconBg: "bg-teal-950/30", iconColor: "text-teal-400" },
    green:  { border: "border-l-emerald-500", iconBg: "bg-emerald-950/30", iconColor: "text-emerald-400" },
    red:    { border: "border-l-red-500", iconBg: "bg-red-950/30", iconColor: "text-red-400" },
    default:{ border: "border-l-transparent", iconBg: "bg-secondary", iconColor: "text-muted-foreground" },
  };

  const accent = accentStyles[accentColor];

  return (
    <Card className={cn("border-l-2 card-hover", accent.border, className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
            <p className="text-2xl font-bold stat-number leading-tight">{animated}</p>
            {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2.5 shrink-0", accent.iconBg)}>
              <Icon className={cn("h-5 w-5", accent.iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
