import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTrade } from "../actions";

export default function NewTradePage() {
  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-6">Add Trade</h2>
      <form action={createTrade} className="space-y-4">
        <div>
          <Label htmlFor="symbol">Symbol</Label>
          <Input id="symbol" name="symbol" placeholder="AAPL" required />
        </div>

        <div>
          <Label htmlFor="direction">Direction</Label>
          <select
            id="direction"
            name="direction"
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-white"
            required
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>

        <div>
          <Label htmlFor="entryPrice">Entry price</Label>
          <Input id="entryPrice" name="entryPrice" type="number" step="0.01" required />
        </div>

        <div>
          <Label htmlFor="exitPrice">Exit price</Label>
          <Input id="exitPrice" name="exitPrice" type="number" step="0.01" required />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" required />
        </div>

        <div>
          <Label htmlFor="fees">Fees</Label>
          <Input id="fees" name="fees" type="number" step="0.01" defaultValue="0" />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>

        <Button type="submit">Save Trade</Button>
      </form>
    </div>
  );
}