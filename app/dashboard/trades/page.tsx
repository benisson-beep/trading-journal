import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { deleteTrade } from "./actions";
import { calculatePnl } from "@/lib/trade-utils";
import { getScreenshotUrl } from "@/lib/supabase-admin";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function TradesPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const trades = await prisma.trade.findMany({
    where: { userId: user!.id },
    orderBy: { date: "desc" },    include: { tags: true },
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
        <Link href="/dashboard/trades/new">
          <Button>Add Trade</Button>
        </Link>
      </div>

      {trades.length === 0 ? (
        <p className="text-muted-foreground">No trades yet.</p>
      ) : (
        <table className="w-full text-left text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-sans">
              <th className="py-2">Date</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Tags</th>
              <th className="py-2">Direction</th>
              <th className="py-2">Entry</th>
              <th className="py-2">Exit</th>
              <th className="py-2">Qty</th>
              <th className="py-2">P&L</th>
              <th className="py-2">Notes</th>
              <th className="py-2">Screenshot</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
               const entry = Number(trade.entryPrice);
               const exit = Number(trade.exitPrice);
               const quantity = Number(trade.quantity);
               const pnl = calculatePnl(trade);

              return (
                <tr key={trade.id} className="border-b border-border">
                  <td className="py-2">{trade.date.toLocaleDateString()}</td>
                  <td className="py-2 font-sans uppercase">{trade.symbol}</td>
                  <td className="py-2 font-sans">{trade.tags.map((tag) => (<span
                  key={tag.id}className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded mr-1">
                  {tag.name}</span>
                  ))}
                  </td>
                  <td className="py-2 font-sans">{trade.direction}</td>
                  <td className="py-2">{entry.toFixed(2)}</td>
                  <td className="py-2">{exit.toFixed(2)}</td>
                  <td className="py-2">{quantity}</td>
                  <td
                    className={`py-2 ${pnl >= 0 ? "text-gain" : "text-loss"}`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toFixed(2)}
                  </td>
                  <td className="py-2 text-muted-foreground max-w-[150px] truncate font-sans">
                  {trade.notes || "—"}
                  </td>
                  <td className="py-2">
                    {screenshotUrls[trade.id] ? (
                      <a href={screenshotUrls[trade.id]} target="_blank" rel="noopener noreferrer"> <img src={screenshotUrls[trade.id]} alt="Trade screenshot" className="h-10 w-10 object-cover rounded border border-border"/> </a> ) : (
                      "—"
                    )}
                  </td>

                  <td className="py-2 font-sans">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/trades/${trade.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/trades/${trade.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </Button>
                      </Link>
                      <form action={deleteTrade.bind(null, trade.id)}>
                        <Button type="submit" variant="destructive" size="sm" className="gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </Button>
                      </form>
                    </div>
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