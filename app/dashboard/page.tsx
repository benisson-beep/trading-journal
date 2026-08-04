import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const trades = await prisma.trade.findMany({
    where: { userId: user!.id },
  });

  const pnls = trades.map((trade) => {
    const entry = Number(trade.entryPrice);
    const exit = Number(trade.exitPrice);
    const quantity = Number(trade.quantity);
    const contractSize = Number(trade.contractSize);
    const fees = Number(trade.fees);
    return trade.direction === "LONG"
      ? (exit - entry) * quantity * contractSize - fees
      : (entry - exit) * quantity * contractSize - fees;
  });

  const totalTrades = trades.length;
  const totalPnl = pnls.reduce((sum, pnl) => sum + pnl, 0);
  const wins = pnls.filter((pnl) => pnl > 0);
  const losses = pnls.filter((pnl) => pnl < 0);
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const avgWin =
    wins.length > 0 ? wins.reduce((sum, pnl) => sum + pnl, 0) / wins.length : 0;
  const avgLoss =
    losses.length > 0
      ? losses.reduce((sum, pnl) => sum + pnl, 0) / losses.length
      : 0;

  const stats = [
    { label: "Total P&L", value: `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}`, positive: totalPnl >= 0 },
    { label: "Win Rate", value: `${winRate.toFixed(1)}%` },
    { label: "Total Trades", value: totalTrades.toString() },
    { label: "Avg Win", value: `+${avgWin.toFixed(2)}`, positive: true },
    { label: "Avg Loss", value: avgLoss.toFixed(2), positive: false },
  ];

  return (
    <div>
      <p className="text-gray-400 mb-6">Welcome, {session?.user?.name}</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-800 p-4"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p
              className={`text-2xl font-bold ${
                stat.positive === true
                  ? "text-green-500"
                  : stat.positive === false
                  ? "text-red-500"
                  : "text-white"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}