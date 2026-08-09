import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTrade } from "../../actions";
import { notFound } from "next/navigation";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function EditTradePage({
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

  const updateTradeWithId = updateTrade.bind(null, trade.id);

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-6">Edit Trade</h2>
      <form action={updateTradeWithId} className="space-y-4">
        <div>
          <Label htmlFor="symbol">Symbol</Label>
          <Input id="symbol" name="symbol" defaultValue={trade.symbol} required />
        </div>

        <div>
          <Label htmlFor="direction">Direction</Label>
          <select
            id="direction"
            name="direction"
            defaultValue={trade.direction}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-white"
            required
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>

        <div>
          <Label htmlFor="entryPrice">Entry price</Label>
          <Input
            id="entryPrice"
            name="entryPrice"
            type="number"
            step="0.00001"
            defaultValue={trade.entryPrice.toString()}
            required
          />
        </div>

        <div>
          <Label htmlFor="exitPrice">Exit price</Label>
          <Input
            id="exitPrice"
            name="exitPrice"
            type="number"
            step="0.00001"
            defaultValue={trade.exitPrice.toString()}
            required
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.001"
            defaultValue={trade.quantity.toString()}
            required
          />
        </div>

        <div>
          <Label htmlFor="contractSize">Contract size (multiplier)</Label>
          <Input
            id="contractSize"
            name="contractSize"
            type="number"
            step="0.01"
            defaultValue={trade.contractSize.toString()}
          />
        </div>

        <div>
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            name="fees"
            type="number"
            step="0.01"
            defaultValue={trade.fees.toString()}
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={trade.date.toISOString().split("T")[0]}
            required
          />
        </div>
        <div>
         <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="breakout, high-conviction"
          defaultValue={trade.tags.map((t) => t.name).join(", ")}
         />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}

