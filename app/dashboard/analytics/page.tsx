import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculateStats } from "@/lib/trade-utils";
import { calculateEquityCurve } from "@/lib/trade-utils";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";
import { calculateDailyPerformance } from "@/lib/trade-utils";
import { PerformanceCalendar } from "@/components/charts/performance-calendar";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function AnalyticsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const trades = await prisma.trade.findMany({
    where: { userId: user!.id },
    orderBy: { date: "asc" },
  });

  const stats = calculateStats(trades);
  const equityCurve = calculateEquityCurve(trades);
  const dailyPerformance = calculateDailyPerformance(trades);

  const cards = [
    { label: "Total Trades", value: stats.totalTrades.toString() },
    { label: "Net P&L", value: stats.netPnl.toFixed(2), signed: true },
    { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%` },
    { label: "Gross Profit", value: `+${stats.grossProfit.toFixed(2)}`, positive: true },
    { label: "Gross Loss", value: stats.grossLoss.toFixed(2), negative: true },
    { label: "Profit Factor", value: stats.profitFactor.toFixed(2) },
    { label: "Avg Win", value: `+${stats.avgWin.toFixed(2)}`, positive: true },
    { label: "Avg Loss", value: stats.avgLoss.toFixed(2), negative: true },
    { label: "Risk/Reward", value: stats.riskReward.toFixed(2) },
    { label: "Expectancy", value: stats.expectancy.toFixed(2), signed: true },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => {
          let color = "text-white";
          if (card.positive) color = "text-green-500";
          if (card.negative) color = "text-red-500";
          if (card.signed) {
            const numericValue = parseFloat(card.value);
            color = numericValue >= 0 ? "text-green-500" : "text-red-500";
          }

          return (
            <div key={card.label} className="border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className={`text-2xl font-bold ${color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
        <EquityCurveChart data={equityCurve} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
        <PerformanceCalendar dailyData={dailyPerformance} />
      </div>
    </div>
  );
}
