import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { deleteTrade } from "./actions";
import { calculatePnl } from "@/lib/trade-utils";
import { getScreenshotUrl } from "@/lib/supabase-admin";
import { Pencil, Trash2 } from "lucide-react";

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
    include: { tags: true },
  });

  const screenshotUrls = Object.fromEntries(
    await Promise.all(
      trades
        .filter((t) => t.screenshotPath)
        .map(async (t) => [t.id, await getScreenshotUrl(t.screenshotPath!)])
    )
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Trades</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {trades.length} trade{trades.length === 1 ? "" : "s"} logged
          </p>
        </div>
        <Link href="/dashboard/trades/new">
          <Button>Add Trade</Button>
        </Link>
      </div>

      {trades.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No trades logged yet.
          </p>
          <Link href="/dashboard/trades/new" className="mt-4 inline-block">
            <Button size="sm">Add your first trade</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Direction</th>
                <th className="px-4 py-3 font-medium">Entry</th>
                <th className="px-4 py-3 font-medium">Exit</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">P&L</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Screenshot</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trades.map((trade) => {
                const entry = Number(trade.entryPrice);
                const exit = Number(trade.exitPrice);
                const quantity = Number(trade.quantity);
                const pnl = calculatePnl(trade);

                return (
                  <tr
                    key={trade.id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {trade.date.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium uppercase">
                      {trade.symbol}
                    </td>
                    <td className="px-4 py-3">
                      {trade.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="mr-1 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                          trade.direction === "LONG"
                            ? "bg-gain/15 text-gain"
                            : "bg-loss/15 text-loss"
                        }`}
                      >
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{entry.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono">{exit.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono">{quantity}</td>
                    <td
                      className={`px-4 py-3 font-mono font-semibold ${
                        pnl >= 0 ? "text-gain" : "text-loss"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {pnl.toFixed(2)}
                    </td>
                    <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">
                      {trade.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {screenshotUrls[trade.id] ? (
                        <a
                          href={screenshotUrls[trade.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={screenshotUrls[trade.id]}
                            alt="Trade screenshot"
                            className="h-10 w-10 rounded border border-border object-cover"
                          />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/trades/${trade.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/trades/${trade.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <form action={deleteTrade.bind(null, trade.id)}>
                          <Button type="submit" variant="destructive" size="sm">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}