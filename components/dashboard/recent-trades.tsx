import Link from "next/link";

export type RecentTradeItem = {
  id: string;
  symbol: string;
  direction: "LONG" | "SHORT";
  date: string;
  pnl: number;
};

export function RecentTrades({ trades }: { trades: RecentTradeItem[] }) {
  if (trades.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No trades yet.</p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {trades.map((trade) => {
        const isWin = trade.pnl >= 0;
        return (
          <Link
            key={trade.id}
            href={`/dashboard/trades/${trade.id}`}
            className="-mx-2 flex items-center justify-between rounded-md px-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-accent/60"
          >
            <div className="flex items-center gap-3">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                  trade.direction === "LONG"
                    ? "bg-gain/15 text-gain"
                    : "bg-loss/15 text-loss"
                }`}
              >
                {trade.direction}
              </span>
              <div>
                <p className="text-sm font-medium uppercase">{trade.symbol}</p>
                <p className="text-xs text-muted-foreground">{trade.date}</p>
              </div>
            </div>
            <span
              className={`font-mono text-sm font-semibold ${
                isWin ? "text-gain" : "text-loss"
              }`}
            >
              {isWin ? "+" : ""}
              {trade.pnl.toFixed(2)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}