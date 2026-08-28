"use client";

import { useState } from "react";
import type { DailyPerformance } from "@/lib/trade-utils";
import { Button } from "@/components/ui/button";

export function PerformanceCalendar({
  dailyData,
}: {
  dailyData: Map<string, DailyPerformance>;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDayData = selectedDate ? dailyData.get(selectedDate) : null;

  function handleMonthChange(offset: number) {
    setMonthOffset(offset);
    setSelectedDate(null);
  }

  function handleDayClick(dateKey: string, hasData: boolean) {
    if (!hasData) return;
    setSelectedDate((current) => (current === dateKey ? null : dateKey));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-black text-white border-gray-700 hover:bg-gray-800"
          onClick={() => handleMonthChange(monthOffset - 1)}
        >
          Previous
        </Button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <Button
          variant="outline"
          size="sm"
          className="bg-black text-white border-gray-700 hover:bg-gray-800"
          onClick={() => handleMonthChange(monthOffset + 1)}
        >
          Next
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 pb-1">
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayData = dailyData.get(dateKey);
          const isSelected = selectedDate === dateKey;

          let bgColor = "bg-gray-900";
          if (dayData) {
            bgColor = dayData.pnl >= 0 ? "bg-green-900" : "bg-red-900";
          }

          return (
            <div
              key={dateKey}
              onClick={() => handleDayClick(dateKey, !!dayData)}
              className={`${bgColor} rounded p-2 h-20 flex flex-col justify-between relative ${
                dayData ? "cursor-pointer" : ""
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs text-gray-400">{day}</span>
                {dayData && (
                  <span className="text-[13px] bg-gray-800 text-gray-300 rounded-full px-1.5 py-0.5">
                    {dayData.tradeCount}
                  </span>
                )}
              </div>
              {dayData && (
                <span
                  className={`text-xs font-semibold ${
                    dayData.pnl >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {dayData.pnl >= 0 ? "+" : ""}
                  {dayData.pnl.toFixed(0)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedDayData && (
        <div className="mt-4 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            {new Date(selectedDayData.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {" — "}
            {selectedDayData.tradeCount}{" "}
            {selectedDayData.tradeCount === 1 ? "trade" : "trades"}
          </h4>
          <div className="space-y-2">
            {selectedDayData.trades.map((trade) => {
              const isWin = trade.pnl >= 0;
              return (
                <div
                  key={trade.id}
                  className="flex items-center justify-between bg-gray-900 rounded px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isWin ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{trade.symbol}</span>
                    <span className="text-xs text-gray-500">
                      {trade.direction === "LONG" ? "Buy" : "Sell"}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isWin ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isWin ? "+" : ""}
                    {trade.pnl.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}