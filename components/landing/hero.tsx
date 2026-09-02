import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";

const SAMPLE_EQUITY = [
  { date: "Jan", equity: 10000 },
  { date: "Feb", equity: 10420 },
  { date: "Mar", equity: 10180 },
  { date: "Apr", equity: 10890 },
  { date: "May", equity: 11340 },
  { date: "Jun", equity: 11120 },
  { date: "Jul", equity: 11780 },
  { date: "Aug", equity: 12284 },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Turn every trade into a better decision.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Track your trades, understand your performance, and build a more
            disciplined trading process.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        {/* Product preview mockup */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/30 sm:p-4">
            <div className="mb-3 flex items-center gap-1.5 px-1">
              <span className="h-2.5 w-2.5 rounded-full bg-loss/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-chart-5/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-gain/60" />
            </div>
            <div className="rounded-xl bg-background p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Net P&L" value="+$2,284.00" variant="gain" />
                <StatCard label="Win Rate" value="58.3%" />
                <StatCard label="Total Trades" value="142" />
                <StatCard label="Profit Factor" value="1.86" />
              </div>
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <EquityCurveChart data={SAMPLE_EQUITY} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}