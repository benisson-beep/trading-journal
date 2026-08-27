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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-black text-white border-gray-700 hover:bg-gray-800"
          onClick={() => setMonthOffset(monthOffset - 1)}
        >
          Previous
        </Button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <Button
          variant="outline"
          size="sm"
          className="bg-black text-white border-gray-700 hover:bg-gray-800"
          onClick={() => setMonthOffset(monthOffset + 1)}
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

          let bgColor = "bg-gray-900";
          if (dayData) {
            bgColor = dayData.pnl >= 0 ? "bg-green-900" : "bg-red-900";
          }

          return (
            <div
              key={dateKey}
              className={`${bgColor} rounded p-2 h-16 flex flex-col justify-between`}
            >
              <span className="text-xs text-gray-400">{day}</span>
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
    </div>
  );
}

