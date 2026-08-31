"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function WinLossPieChart({
  winCount,
  lossCount,
}: {
  winCount: number;
  lossCount: number;
}) {
  const data = [
    { name: "Wins", value: winCount },
    { name: "Losses", value: lossCount },
  ];

  const COLORS = ["var(--gain)", "var(--loss)"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--popover-foreground)",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}