import { Trade } from "@/lib/generated/prisma/client";
import { calculatePnl } from "@/lib/trade-utils";

export type TradeStats = {
  totalTrades: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
  expectancy: number;
};

export function calculateTradeStats(trades: Trade[]): TradeStats {
  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let grossProfit = 0;
  let grossLoss = 0;

  for (const trade of trades) {
    const pnl = calculatePnl(trade);

    if (pnl > 0) {
      wins++;
      grossProfit += pnl;
    } else if (pnl < 0) {
      losses++;
      grossLoss += pnl;
    } else {
      breakevens++;
    }
  }

  const netPnl = grossProfit + grossLoss;

  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  const averageWin = wins > 0 ? grossProfit / wins : 0;
  const averageLoss = losses > 0 ? grossLoss / losses : 0;
  const profitFactor = grossLoss !== 0 ? grossProfit / Math.abs(grossLoss) : 0;
  const riskRewardRatio =
    averageLoss !== 0 ? averageWin / Math.abs(averageLoss) : 0;

  const lossRate = 100 - winRate;
  const expectancy =
    (winRate / 100) * averageWin - (lossRate / 100) * Math.abs(averageLoss);

  return {
    totalTrades: trades.length,
    wins,
    losses,
    breakevens,
    winRate,
    netPnl,
    grossProfit,
    grossLoss,
    averageWin,
    averageLoss,
    profitFactor,
    riskRewardRatio,
    expectancy,
  };
}