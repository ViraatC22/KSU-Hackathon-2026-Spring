import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl">
            N
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Ndalama AI</h1>
        </div>

        <p className="text-xl text-muted-foreground">
          AI-Powered Financial Inclusion Platform for Zambia
        </p>

        <p className="text-muted-foreground">
          Unifying mobile money reconciliation, alternative credit scoring,
          SME lending, savings circles, and geospatial intelligence into a
          single ecosystem.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Enter Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 text-center">
          <div>
            <p className="text-2xl font-bold">7</p>
            <p className="text-sm text-muted-foreground">Integrated Modules</p>
          </div>
          <div>
            <p className="text-2xl font-bold">116</p>
            <p className="text-sm text-muted-foreground">Districts Covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Mobile Platforms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
