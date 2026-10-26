"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Snow from "@/components/Snow";
import DoorGrid from "@/components/DoorGrid";
import DayModal from "@/components/DayModal";
import { readHashCalendar } from "@/lib/codec";
import { daysUntilDecember, formatYmd, parseYmd, todayInBucharest, type Ymd } from "@/lib/date";
import { demoCalendar, THEMES, type Calendar } from "@/lib/types";

function storageKey(c: Calendar) {
  // Opened doors are remembered per calendar, in this browser.
  return `advent:opened:${c.title}|${c.to}|${c.from}|${c.year}`;
}

export default function ViewPage() {
  const [cal, setCal] = useState<Calendar | null | undefined>(undefined);
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);
  const [simDate, setSimDate] = useState<Ymd | null>(null);

  useEffect(() => {
    const fromHash = readHashCalendar();
    const isDemo = new URLSearchParams(window.location.search).has("demo");
    const c = fromHash ?? (isDemo ? demoCalendar() : null);
    setCal(c);
    if (c) {
      try {
        const raw = localStorage.getItem(storageKey(c));
        if (raw) setOpened(new Set(JSON.parse(raw)));
      } catch {}
    }
    try {
      const s = sessionStorage.getItem("advent:simDate");
      if (s) setSimDate(parseYmd(s));
    } catch {}
  }, []);

  const today = useMemo(() => simDate ?? todayInBucharest(), [simDate]);

  const open = useCallback(
    (n: number) => {
      if (!cal) return;
      setOpened((prev) => {
        const next = new Set(prev).add(n);
        try {
          localStorage.setItem(storageKey(cal), JSON.stringify([...next]));
        } catch {}
        return next;
      });
      setTimeout(() => setActive(n), 450);
    },
    [cal],
  );

  function changeSim(v: string) {
    const d = v ? parseYmd(v) : null;
    setSimDate(d);
    try {
      if (d) sessionStorage.setItem("advent:simDate", v);
      else sessionStorage.removeItem("advent:simDate");
    } catch {}
  }

  if (cal === undefined) return null;
  if (cal === null) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">Link invalid</h1>
        <p className="mb-6 opacity-70">Nu am găsit niciun calendar în acest link.</p>
        <Link href="/create" className="btn">
          Creează unul
        </Link>
      </main>
    );
  }

  const left = daysUntilDecember(cal.year, today);

  return (
    <div className="themed" style={THEMES[cal.theme].vars as React.CSSProperties}>
      <Snow />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          {cal.to && <p className="text-sm uppercase tracking-[0.3em] opacity-70">Pentru {cal.to}</p>}
          <h1 className="my-2 text-3xl font-bold sm:text-5xl">{cal.title}</h1>
          {cal.from && <p className="opacity-70">de la {cal.from}</p>}
          {left > 0 && (
            <p className="mt-4 inline-block rounded-full bg-black/25 px-4 py-1 text-sm">
              Prima ușiță se deschide în {left} {left === 1 ? "zi" : "zile"}
            </p>
          )}
        </header>

        <DoorGrid calendar={cal} today={today} opened={opened} onOpen={open} />

        <footer className="mt-12 flex flex-col items-center gap-3 text-center text-sm opacity-70">
          <label className="flex flex-wrap items-center justify-center gap-2">
            <span>🧪 Mod test: simulează data</span>
            <input
              type="date"
              value={simDate ? formatYmd(simDate) : ""}
              onChange={(e) => changeSim(e.target.value)}
              className="rounded-md bg-black/25 px-2 py-1 text-[var(--ink)]"
            />
            {simDate && (
              <button onClick={() => changeSim("")} className="underline">
                înapoi la azi
              </button>
            )}
          </label>
          <Link href="/create" className="underline">
            Fă și tu un calendar
          </Link>
        </footer>
      </main>

      {active !== null && <DayModal day={cal.days[active - 1]} onClose={() => setActive(null)} />}
    </div>
  );
}
