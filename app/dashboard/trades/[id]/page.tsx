import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getScreenshotUrl } from "@/lib/supabase-admin";
import { calculatePnl } from "@/lib/trade-utils";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const trade = await prisma.trade.findFirst({
    where: { id, userId: user!.id },
    include: { tags: true },
  });

  if (!trade) {
    notFound();
  }

  const screenshotUrl = trade.screenshotPath
    ? await getScreenshotUrl(trade.screenshotPath)
    : null;

  const entry = Number(trade.entryPrice);
  const exit = Number(trade.exitPrice);
  const quantity = Number(trade.quantity);
  const contractSize = Number(trade.contractSize);
  const fees = Number(trade.fees);
  const pnl = calculatePnl(trade);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{trade.symbol}</h2>
          <p className="text-gray-400 text-sm">
            {trade.date.toLocaleDateString()} · {trade.direction}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/trades">
            <Button variant="outline" size="sm" className="bg-black text-white border-gray-700 hover:bg-gray-800">
              Back
            </Button>
          </Link>
          <Link href={`/dashboard/trades/${trade.id}/edit`}>
            <Button variant="outline" size="sm" className="bg-black text-white border-gray-700 hover:bg-gray-800">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={`text-3xl font-bold mb-6 ${
          pnl >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {pnl >= 0 ? "+" : ""}
        {pnl.toFixed(2)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-gray-400">Entry Price</p>
          <p>{entry.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Exit Price</p>
          <p>{exit.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Quantity</p>
          <p>{quantity}</p>
        </div>
        <div>
          <p className="text-gray-400">Contract Size</p>
          <p>{contractSize}</p>
        </div>
        <div>
          <p className="text-gray-400">Fees</p>
          <p>{fees.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Direction</p>
          <p>{trade.direction}</p>
        </div>
      </div>

      {trade.tags.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-1">Tags</p>
          <div>
            {trade.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded mr-1"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Notes</p>
        <p className="whitespace-pre-wrap">{trade.notes || "—"}</p>
      </div>

      {screenshotUrl && (
        <div>
          <p className="text-gray-400 text-sm mb-1">Screenshot</p>
          <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={screenshotUrl}
              alt="Trade screenshot"
              className="max-w-full rounded border border-gray-700"
            />
          </a>
        </div>
      )}
    </div>
  );
}