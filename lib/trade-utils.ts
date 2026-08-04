import { Decimal } from "@/lib/generated/prisma/client";

type TradeForCalc = {
  direction: "LONG" | "SHORT";
  entryPrice: Decimal;
  exitPrice: Decimal;
  quantity: Decimal;
  contractSize: Decimal;
  fees: Decimal;
};

export function calculatePnl(trade: TradeForCalc): number {
  const entry = Number(trade.entryPrice);
  const exit = Number(trade.exitPrice);
  const quantity = Number(trade.quantity);
  const contractSize = Number(trade.contractSize);
  const fees = Number(trade.fees);

  return trade.direction === "LONG"
    ? (exit - entry) * quantity * contractSize - fees
    : (entry - exit) * quantity * contractSize - fees;
}