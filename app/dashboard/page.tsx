import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculateStats } from "@/lib/trade-utils";
import { StatCard } from "@/components/dashboard/stat-card";

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

  const hasTrades = trades.length > 0;
  const stats = calculateStats(trades);

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s how your trading is going.
        </p>
      </div>

      {!hasTrades ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No trades logged yet. Add your first trade to see your
            performance here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Net P&L"
            value={`${stats.netPnl >= 0 ? "+" : ""}${stats.netPnl.toFixed(2)}`}
            variant={stats.netPnl >= 0 ? "gain" : "loss"}
          />
          <StatCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
          <StatCard label="Total Trades" value={stats.totalTrades.toString()} />
          <StatCard label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
        </div>
      )}
    </div>
  );
}