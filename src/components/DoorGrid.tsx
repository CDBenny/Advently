"use client";

import { useState } from "react";
import type { Calendar } from "@/lib/types";
import { KIND_ICON } from "@/lib/types";
import { canOpen, type Ymd } from "@/lib/date";

// Classic advent calendars scramble the numbers; keep the order fixed so the
// grid looks the same on every visit.
const ORDER = [7, 19, 3, 24, 11, 16, 1, 22, 9, 14, 5, 20, 12, 2, 18, 8, 23, 15, 4, 10, 21, 6, 17, 13];

// Fixed burst directions so the confetti looks the same every time.
const CONFETTI: [number, number][] = [
  [-60, -70], [50, -80], [-80, -10], [85, -20], [-55, 60], [60, 55], [-15, -95], [20, 80], [-95, 30], [95, 25], [-30, 90], [35, -60],
];

interface Props {
  calendar: Calendar;
  today: Ymd;
  opened: Set<number>;
  onOpen: (n: number) => void;
}

export default function DoorGrid({ calendar, today, opened, onOpen }: Props) {
  const [shaking, setShaking] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [justOpened, setJustOpened] = useState<number | null>(null);

  function click(n: number) {
    if (canOpen(n, calendar.year, today)) {
      if (!opened.has(n)) {
        setJustOpened(n);
        setTimeout(() => setJustOpened(null), 1600);
      }
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
              {isOpen && justOpened === n && (
                <span className="confetti" aria-hidden>
                  {CONFETTI.map(([dx, dy], i) => (
                    <i key={i} style={{ ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px` }} />
                  ))}
                </span>
              )}
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
