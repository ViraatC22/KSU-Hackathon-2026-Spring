"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface TxNode {
  id: number;
  name: string;
  platform: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  txCount: number;
  fraudCount: number;
  color: string;
}

interface TxEdge {
  si: number;
  ti: number;
  fraudScore: number;
  amount: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  MTN_MONEY: "#EAB308",
  AIRTEL_MONEY: "#EF4444",
  ZOONA: "#22C55E",
};

const PLATFORM_LABELS: Record<string, string> = {
  MTN_MONEY: "MTN Money",
  AIRTEL_MONEY: "Airtel Money",
  ZOONA: "Zoona",
};

interface Props {
  users: Array<{ name: string; platforms: string[] }>;
  transactions: Array<{
    senderIndex: number;
    receiverIndex: number;
    fraudScore: number;
    amount: number;
  }>;
  highlightFraud?: boolean;
}

export function TransactionNetwork({ users, transactions, highlightFraud = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<TxNode[]>([]);
  const edgesRef = useRef<TxEdge[]>([]);
  const alphaRef = useRef(1.0);
  const highlightRef = useRef(highlightFraud);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: TxNode } | null>(null);
  const [stats, setStats] = useState({ nodes: 0, edges: 0, fraudEdges: 0 });
  const [ready, setReady] = useState(false);

  // Keep highlight ref in sync
  useEffect(() => { highlightRef.current = highlightFraud; }, [highlightFraud]);

  // Build graph from data
  useEffect(() => {
    const txCount = new Array(users.length).fill(0);
    const fraudCount = new Array(users.length).fill(0);
    for (const tx of transactions) {
      if (tx.senderIndex < users.length) txCount[tx.senderIndex]++;
      if (tx.receiverIndex < users.length) txCount[tx.receiverIndex]++;
      if (tx.fraudScore > 0.5) {
        if (tx.senderIndex < users.length) fraudCount[tx.senderIndex]++;
        if (tx.receiverIndex < users.length) fraudCount[tx.receiverIndex]++;
      }
    }

    // Top 65 users by tx count
    const topIndices = txCount
      .map((c, i) => ({ i, c }))
      .sort((a, b) => b.c - a.c)
      .slice(0, 65)
      .map((x) => x.i);

    const indexMap = new Map<number, number>();
    topIndices.forEach((orig, ni) => indexMap.set(orig, ni));

    // Place nodes in a jittered circle
    nodesRef.current = topIndices.map((orig, i) => {
      const user = users[orig];
      const platform = user.platforms[0] || "MTN_MONEY";
      const angle = (i / topIndices.length) * 2 * Math.PI;
      const spread = 160 + Math.random() * 60;
      const r = Math.max(5, Math.min(15, 4 + Math.sqrt(txCount[orig]) * 0.7));
      return {
        id: orig,
        name: user.name,
        platform,
        x: 420 + Math.cos(angle) * spread,
        y: 270 + Math.sin(angle) * spread,
        vx: 0,
        vy: 0,
        radius: r,
        txCount: txCount[orig],
        fraudCount: fraudCount[orig],
        color: PLATFORM_COLORS[platform] || "#888",
      };
    });

    // Take the 500 most recent transactions between top users
    const relevantEdges = transactions
      .filter((tx) => indexMap.has(tx.senderIndex) && indexMap.has(tx.receiverIndex))
      .slice(-500);

    edgesRef.current = relevantEdges.map((tx) => ({
      si: indexMap.get(tx.senderIndex)!,
      ti: indexMap.get(tx.receiverIndex)!,
      fraudScore: tx.fraudScore,
      amount: tx.amount,
    }));

    const fraudEdges = edgesRef.current.filter((e) => e.fraudScore > 0.5).length;
    setStats({ nodes: nodesRef.current.length, edges: edgesRef.current.length, fraudEdges });
    alphaRef.current = 1.0;
    setReady(true);
  }, [users, transactions]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width || 840;
    const H = canvas.height || 540;
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const alpha = alphaRef.current;

    // Physics
    if (alpha > 0.005) {
      // Repulsion (only nearby nodes for perf)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist2 = dx * dx + dy * dy || 0.01;
          const dist = Math.sqrt(dist2);
          const minD = (nodes[i].radius + nodes[j].radius + 18) * 3;
          if (dist < minD) {
            const force = (alpha * minD * minD * 0.45) / dist2;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].vx -= fx;
            nodes[i].vy -= fy;
            nodes[j].vx += fx;
            nodes[j].vy += fy;
          }
        }
      }

      // Spring forces on edges
      for (const edge of edges) {
        const s = nodes[edge.si];
        const t = nodes[edge.ti];
        if (!s || !t || s === t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = edge.fraudScore > 0.5 ? 80 : 120;
        const stretch = dist - targetDist;
        const force = alpha * 0.035 * stretch;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
        t.vx -= (dx / dist) * force;
        t.vy -= (dy / dist) * force;
      }

      // Center gravity + integrate
      for (const node of nodes) {
        node.vx += (W / 2 - node.x) * 0.007 * alpha;
        node.vy += (H / 2 - node.y) * 0.007 * alpha;
        node.vx *= 0.78;
        node.vy *= 0.78;
        node.x = Math.max(node.radius + 6, Math.min(W - node.radius - 6, node.x + node.vx));
        node.y = Math.max(node.radius + 6, Math.min(H - node.radius - 6, node.y + node.vy));
      }
      alphaRef.current *= 0.991;
    }

    // ---- Draw ----
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "hsl(20, 12%, 9%)";
    ctx.fillRect(0, 0, W, H);

    const highlight = highlightRef.current;

    // Draw edges
    for (const edge of edges) {
      const s = nodes[edge.si];
      const t = nodes[edge.ti];
      if (!s || !t) continue;

      if (highlight && edge.fraudScore <= 0.5) {
        ctx.strokeStyle = "rgba(255,255,255,0.025)";
        ctx.lineWidth = 0.5;
      } else if (edge.fraudScore > 0.7) {
        ctx.strokeStyle = highlight ? "rgba(239,68,68,0.85)" : "rgba(239,68,68,0.5)";
        ctx.lineWidth = highlight ? 2.5 : 1.5;
      } else if (edge.fraudScore > 0.5) {
        ctx.strokeStyle = highlight ? "rgba(249,115,22,0.7)" : "rgba(249,115,22,0.35)";
        ctx.lineWidth = highlight ? 1.5 : 1;
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.055)";
        ctx.lineWidth = 0.5;
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      // Fraud glow
      if (node.fraudCount > 2) {
        ctx.save();
        ctx.shadowColor = "#EF4444";
        ctx.shadowBlur = highlight ? 18 : 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,68,68,${highlight ? 0.35 : 0.15})`;
        ctx.fill();
        ctx.restore();
      }

      // Node body
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      const dimmed = highlight && node.fraudCount === 0;
      ctx.fillStyle = dimmed ? "rgba(120,120,120,0.4)" : node.color;
      ctx.fill();

      // Outline
      ctx.strokeStyle = dimmed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.25)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Legend
    const legend = [
      { color: "#EAB308", label: "MTN Money" },
      { color: "#EF4444", label: "Airtel Money" },
      { color: "#22C55E", label: "Zoona" },
    ];
    ctx.font = "11px system-ui, sans-serif";
    legend.forEach((item, i) => {
      const lx = 14;
      const ly = 18 + i * 18;
      ctx.beginPath();
      ctx.arc(lx + 5, ly - 3.5, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillText(item.label, lx + 14, ly);
    });

    // Edge legend
    const ely = 76;
    ctx.beginPath();
    ctx.moveTo(14, ely);
    ctx.lineTo(38, ely);
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("Fraud edge", 44, ely + 4);

    animRef.current = requestAnimationFrame(tick);
  }, []); // stable — only accesses refs

  // Start animation loop
  useEffect(() => {
    if (!ready) return;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick, ready]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const w = Math.floor(canvas.offsetWidth);
      const h = Math.floor(canvas.offsetHeight);
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        alphaRef.current = Math.max(alphaRef.current, 0.3);
      }
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Hover detection
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    const found = nodesRef.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    setTooltip(found ? { x: e.clientX, y: e.clientY, node: found } : null);
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        style={{ cursor: tooltip ? "pointer" : "default" }}
      />

      {/* Stats overlay */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] bg-black/60 text-white/60 px-2.5 py-1 rounded-full font-mono border border-white/10">
          {stats.nodes} nodes · {stats.edges} edges · {stats.fraudEdges} fraud
        </span>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-black/90 text-white text-xs px-3 py-2 rounded-lg pointer-events-none border border-white/10 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 36 }}
        >
          <div className="font-semibold">{tooltip.node.name}</div>
          <div className="text-white/50 mt-0.5">{PLATFORM_LABELS[tooltip.node.platform] || tooltip.node.platform}</div>
          <div className="text-white/50">{tooltip.node.txCount} transactions</div>
          {tooltip.node.fraudCount > 0 && (
            <div className="text-red-400">{tooltip.node.fraudCount} fraud alerts</div>
          )}
        </div>
      )}
    </div>
  );
}
