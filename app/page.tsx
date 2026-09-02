"use client";

import { useMemo } from "react";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";
import { WinLossPieChart } from "@/components/charts/win-loss-pie-chart";
import { MonthlyPerformanceChart } from "@/components/charts/monthly-performance-chart";
import { PerformanceCalendar } from "@/components/charts/performance-calendar";
import type { DailyPerformance } from "@/lib/trade-utils";

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

const SAMPLE_MONTHLY = [
  { month: "Mar", pnl: -180, tradeCount: 14 },
  { month: "Apr", pnl: 710, tradeCount: 19 },
  { month: "May", pnl: 450, tradeCount: 16 },
  { month: "Jun", pnl: -220, tradeCount: 12 },
  { month: "Jul", pnl: 660, tradeCount: 21 },
  { month: "Aug", pnl: 504, tradeCount: 18 },
];

// Builds a handful of sample daily results within the real current month,
// so the calendar (which always renders "today"'s month) has something to
// display. This is illustrative preview data, not real user activity.
function buildSampleDailyPerformance(): Map<string, DailyPerformance> {
  const map = new Map<string, DailyPerformance>();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const sampleDays = [2, 3, 6, 9, 10, 13, 16, 17, 20, 23, 24];

  sampleDays.forEach((day, i) => {
    if (day > today.getDate()) return;
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const pnl = (i % 3 === 0 ? -1 : 1) * (80 + i * 15);
    map.set(dateKey, {
      date: dateKey,
      pnl,
      tradeCount: 1 + (i % 3),
      trades: [],
    });
  });

  return map;
}

export function AnalyticsPreview() {
  const sampleDaily = useMemo(() => buildSampleDailyPerformance(), []);

  return (
    <section id="analytics-preview" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight">
          See your trading, clearly
        </h2>
        <p className="mt-3 text-muted-foreground">
          The same analytics you&apos;ll have in your own dashboard, shown
          here with sample data.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Equity Curve
            </h3>
            <div className="mt-4">
              <EquityCurveChart data={SAMPLE_EQUITY} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Win / Loss
            </h3>
            <div className="mt-4">
              <WinLossPieChart winCount={83} lossCount={59} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Monthly Performance
            </h3>
            <div className="mt-4">
              <MonthlyPerformanceChart data={SAMPLE_MONTHLY} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Performance Calendar
            </h3>
            <div className="mt-4">
              <PerformanceCalendar dailyData={sampleDaily} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}