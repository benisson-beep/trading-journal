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

export type TradeStats = {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  riskReward: number;
  expectancy: number;
};

export function calculateStats(trades: TradeForCalc[]): TradeStats {
  const pnls = trades.map(calculatePnl);

  const totalTrades = pnls.length;
  const netPnl = pnls.reduce((sum, pnl) => sum + pnl, 0);

  const wins = pnls.filter((pnl) => pnl > 0);
  const losses = pnls.filter((pnl) => pnl < 0);

  const grossProfit = wins.reduce((sum, pnl) => sum + pnl, 0);
  const grossLoss = losses.reduce((sum, pnl) => sum + pnl, 0);

  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const lossRate = totalTrades > 0 ? (losses.length / totalTrades) * 100 : 0;

  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;

  const profitFactor =
    grossLoss !== 0 ? grossProfit / Math.abs(grossLoss) : 0;

  const riskReward = avgLoss !== 0 ? avgWin / Math.abs(avgLoss) : 0;

  const expectancy =
    (winRate / 100) * avgWin - (lossRate / 100) * Math.abs(avgLoss);

  return {
    totalTrades,
     winCount: wins.length,
    lossCount: losses.length,
    netPnl,
    grossProfit,
    grossLoss,
    winRate,
    profitFactor,
    avgWin,
    avgLoss,
    riskReward,
    expectancy,
  };
}


type TradeWithDate = TradeForCalc & { date: Date };

export type EquityPoint = {
  date: string;
  equity: number;
};

export function calculateEquityCurve(trades: TradeWithDate[]): EquityPoint[] {
  let runningTotal = 0;

  return trades.map((trade) => {
    runningTotal += calculatePnl(trade);
    return {
      date: trade.date.toLocaleDateString(),
      equity: runningTotal,
    };
  });
}

type TradeWithDateAndId = TradeForCalc & { date: Date; id: string };

export type DailyPerformance = {
  date: string;
  pnl: number;
  tradeCount: number;
};

export function calculateDailyPerformance(
  trades: TradeWithDateAndId[]
): Map<string, DailyPerformance> {
  const dailyMap = new Map<string, DailyPerformance>();

  for (const trade of trades) {
    const date = new Date(trade.date);

if (isNaN(date.getTime())) {
  continue;
}

const dateKey = date.toISOString().split("T")[0];
    const pnl = calculatePnl(trade);

    const existing = dailyMap.get(dateKey);

    if (existing) {
      existing.pnl += pnl;
      existing.tradeCount += 1;
    } else {
      dailyMap.set(dateKey, {
        date: dateKey,
        pnl,
        tradeCount: 1,
      });
    }
  }

  return dailyMap;
}


export type MonthlyPerformance = {
  month: string;
  pnl: number;
  tradeCount: number;
};

export function calculateMonthlyPerformance(
  trades: TradeWithDateAndId[]
): MonthlyPerformance[] {
  const monthlyMap = new Map<string, MonthlyPerformance>();

  for (const trade of trades) {
    const monthKey = trade.date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const pnl = calculatePnl(trade);

    const existing = monthlyMap.get(monthKey);

    if (existing) {
      existing.pnl += pnl;
      existing.tradeCount += 1;
    } else {
      monthlyMap.set(monthKey, {
        month: monthKey,
        pnl,
        tradeCount: 1,
      });
    }
  }

  return Array.from(monthlyMap.values());
}