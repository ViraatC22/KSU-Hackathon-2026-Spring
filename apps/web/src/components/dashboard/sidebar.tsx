"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ArrowLeftRight, CreditCard, FileText,
  Landmark, Users, MessageSquare, Map, ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight, module: 2 },
  { href: "/dashboard/credit-score", label: "Credit Score", icon: CreditCard, module: 1 },
  { href: "/dashboard/documents", label: "Documents", icon: FileText, module: 7 },
  { href: "/dashboard/lending", label: "Lending", icon: Landmark, module: 4 },
  { href: "/dashboard/chilimba", label: "Chilimba", icon: Users, module: 6 },
  { href: "/dashboard/advisor", label: "AI Advisor", icon: MessageSquare, module: 3 },
  { href: "/dashboard/heatmap", label: "Heatmap", icon: Map, module: 5 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm logo-glow"
              style={{ background: "linear-gradient(135deg, var(--copper-500), var(--copper-700))", color: "#fff" }}>
              N
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight">Ndalama AI</span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Live</span>
              </div>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm logo-glow"
              style={{ background: "linear-gradient(135deg, var(--copper-500), var(--copper-700))", color: "#fff" }}>
              N
            </div>
          </Link>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, var(--copper-600), var(--copper-700))",
                boxShadow: "0 2px 8px rgba(212,97,30,0.3)"
              } : {}}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
              {!collapsed && item.module && <span className="text-[10px] opacity-50 font-mono">M{item.module}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3" style={{ color: "var(--copper-400)" }} />
            <span className="text-xs font-medium text-muted-foreground">Ndalama AI v2.0</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Financial Inclusion · Zambia<br />7M unbanked. No longer invisible.
          </p>
        </div>
      )}

      {collapsed && (
        <div className="p-2 border-t">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} className="h-8 w-8 mx-auto flex">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}
