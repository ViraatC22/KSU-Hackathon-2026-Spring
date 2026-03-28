"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  animate?: boolean;
}

function scoreToColor(score: number): string {
  if (score >= 800) return "#3aba72";       // emerald - Tier A
  if (score >= 650) return "#38b2a3";       // teal - Tier B
  if (score >= 500) return "#e4a832";       // yellow - Tier C
  if (score >= 350) return "#e47d3c";       // orange - Tier D
  return "#d94545";                          // red - Tier E
}

function scoreTier(score: number): string {
  if (score >= 800) return "A";
  if (score >= 650) return "B";
  if (score >= 500) return "C";
  if (score >= 350) return "D";
  return "E";
}

function tierLabel(tier: string): string {
  const labels: Record<string, string> = { A: "Excellent", B: "Good", C: "Fair", D: "Below Avg", E: "Limited" };
  return labels[tier] || tier;
}

export function ScoreGauge({ score, maxScore = 1000, size = 240, animate = true }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setProgress(score / maxScore);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    const animate_ = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(score * eased));
      setProgress(eased * (score / maxScore));
      if (t < 1) rafRef.current = requestAnimationFrame(animate_);
    };
    rafRef.current = requestAnimationFrame(animate_);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score, maxScore, animate]);

  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = (size / 2) - 20;
  const strokeWidth = 14;

  // Arc from 210° to 330° (210° sweep) — bottom-centered semicircle
  const startAngle = 210;
  const totalAngle = 240; // degrees
  const endAngle = startAngle + totalAngle;

  function polarToXY(angle: number, r: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(startDeg: number, endDeg: number, r: number) {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const trackPath = describeArc(startAngle, endAngle, radius);
  const fillEndAngle = startAngle + totalAngle * progress;
  const fillPath = progress > 0.001 ? describeArc(startAngle, Math.min(fillEndAngle, endAngle - 0.01), radius) : "";

  const color = scoreToColor(displayScore);
  const tier = scoreTier(score);
  const label = tierLabel(tier);

  // Tick marks at 0, 250, 500, 750, 1000
  const ticks = [0, 250, 500, 750, 1000];
  const tickMarks = ticks.map((v) => {
    const angle = startAngle + (v / maxScore) * totalAngle;
    const inner = polarToXY(angle, radius - strokeWidth / 2 - 2);
    const outer = polarToXY(angle, radius + strokeWidth / 2 + 2);
    return { inner, outer, label: v.toString(), labelPos: polarToXY(angle, radius + strokeWidth / 2 + 14) };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`} className="overflow-visible">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d94545" />
            <stop offset="35%" stopColor="#e47d3c" />
            <stop offset="50%" stopColor="#e4a832" />
            <stop offset="70%" stopColor="#38b2a3" />
            <stop offset="100%" stopColor="#3aba72" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track (background arc) */}
        <path
          d={trackPath}
          fill="none"
          stroke="hsl(20 8% 20%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ transition: "stroke 0.5s ease" }}
          />
        )}

        {/* Tick marks */}
        {tickMarks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.inner.x} y1={tick.inner.y}
              x2={tick.outer.x} y2={tick.outer.y}
              stroke="hsl(20 8% 30%)" strokeWidth={1.5}
            />
            {i > 0 && i < ticks.length - 1 && (
              <text
                x={tick.labelPos.x} y={tick.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="hsl(30 8% 45%)"
              >
                {tick.label}
              </text>
            )}
          </g>
        ))}

        {/* Center score display */}
        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle"
          fontSize="42" fontWeight="700" fill={color}
          fontFamily="var(--font-geist-mono), monospace"
          style={{ letterSpacing: "-2px", transition: "fill 0.5s ease" }}>
          {displayScore}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill="hsl(30 8% 55%)" fontFamily="system-ui">
          out of {maxScore}
        </text>

        {/* Bottom labels */}
        <text x={polarToXY(startAngle, radius + 22).x} y={polarToXY(startAngle, radius + 22).y}
          textAnchor="middle" fontSize="8" fill="hsl(30 8% 40%)">0</text>
        <text x={polarToXY(endAngle, radius + 22).x} y={polarToXY(endAngle, radius + 22).y}
          textAnchor="middle" fontSize="8" fill="hsl(30 8% 40%)">1000</text>
      </svg>

      {/* Tier badge */}
      <div className="flex items-center gap-2 -mt-2">
        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
        >
          Tier {tier}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
