"use client";

import { useState } from "react";
import type { Calendar } from "@/lib/types";
import { KIND_ICON } from "@/lib/types";
import { canOpen, type Ymd } from "@/lib/date";

// Classic advent calendars scramble the numbers; keep the order fixed so the
// grid looks the same on every visit.
const ORDER = [7, 19, 3, 24, 11, 16, 1, 22, 9, 14, 5, 20, 12, 2, 18, 8, 23, 15, 4, 10, 21, 6, 17, 13];

interface Props {
  calendar: Calendar;
  today: Ymd;
  opened: Set<number>;
  onOpen: (n: number) => void;
}

export default function DoorGrid({ calendar, today, opened, onOpen }: Props) {
  const [shaking, setShaking] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  function click(n: number) {
    if (canOpen(n, calendar.year, today)) {
      onOpen(n);
      return;
    }
    setShaking(n);
    setHint(`Ușița ${n} se deschide pe ${n} decembrie`);
    setTimeout(() => setShaking(null), 500);
    setTimeout(() => setHint(null), 2200);
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
        {ORDER.map((n) => {
          const day = calendar.days[n - 1];
          const isOpen = opened.has(n);
          const unlocked = canOpen(n, calendar.year, today);
          return (
            <button
              key={n}
              onClick={() => click(n)}
              aria-label={`Ușița ${n}${unlocked ? "" : ", încuiată"}`}
              className={`door ${isOpen ? "door-open" : ""} ${shaking === n ? "door-shake" : ""} ${
                n === 24 ? "door-big" : ""
              }`}
            >
              <span className="door-back">
                <span className="text-2xl sm:text-3xl">{KIND_ICON[day.kind]}</span>
                {day.title && <span className="door-back-title">{day.title}</span>}
              </span>
              <span className={`door-front ${unlocked ? "" : "door-locked"}`}>
                <span className="door-num">{n}</span>
                {!unlocked && <span className="door-lock">🔒</span>}
              </span>
            </button>
          );
        })}
      </div>
      {hint && (
        <div className="hint" role="status">
          {hint}
        </div>
      )}
    </div>
  );
}
