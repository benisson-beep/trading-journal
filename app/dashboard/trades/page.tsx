import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function TradesPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const trades = await prisma.trade.findMany({
    where: { userId: user!.id },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trades</h2>
        <Link href="/dashboard/trades/new">
          <Button>Add Trade</Button>
        </Link>
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-400">No trades yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="py-2">Date</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Direction</th>
              <th className="py-2">Entry</th>
              <th className="py-2">Exit</th>
              <th className="py-2">Qty</th>
              <th className="py-2">P&L</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const entry = Number(trade.entryPrice);
              const exit = Number(trade.exitPrice);
              const fees = Number(trade.fees);
             const quantity = Number(trade.quantity);
             const contractSize = Number(trade.contractSize);
             const pnl =
             trade.direction === "LONG"
             ? (exit - entry) * quantity * contractSize - fees
             :(entry - exit) * quantity * contractSize - fees;

              return (
                <tr key={trade.id} className="border-b border-gray-900">
                  <td className="py-2">{trade.date.toLocaleDateString()}</td>
                  <td className="py-2">{trade.symbol}</td>
                  <td className="py-2">{trade.direction}</td>
                  <td className="py-2">{entry.toFixed(2)}</td>
                  <td className="py-2">{exit.toFixed(2)}</td>
                  <td className="py-2">{trade.quantity}</td>
                  <td
                    className={`py-2 ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}