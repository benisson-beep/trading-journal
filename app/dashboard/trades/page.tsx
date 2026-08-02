import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TradesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trades</h2>
        <Link href="/dashboard/trades/new">
          <Button>Add Trade</Button>
        </Link>
      </div>
      <p className="text-gray-400">No trades yet.</p>
    </div>
  );
}