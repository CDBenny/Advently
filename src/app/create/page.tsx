"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { emptyCalendar, KIND_ICON, KIND_LABEL, THEMES, type Calendar, type Day, type DayKind, type ThemeId } from "@/lib/types";
import { shareUrl } from "@/lib/codec";

const DRAFT_KEY = "advent:draft";

function isFilled(d: Day) {
  return Boolean(d.title || d.body || d.url || d.code);
}

export default function CreatePage() {
  const [cal, setCal] = useState<Calendar>(emptyCalendar);
  const [selected, setSelected] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Draft lives in the browser until we have accounts.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setCal(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(cal));
    } catch {}
  }, [cal, loaded]);

  const day = cal.days[selected - 1];
  const filled = cal.days.filter(isFilled).length;
  const link = useMemo(
    () => (typeof window === "undefined" ? "" : shareUrl(cal, window.location.origin)),
    [cal],
  );

  function patchDay(p: Partial<Day>) {
    setCal((c) => ({ ...c, days: c.days.map((d) => (d.n === selected ? { ...d, ...p } : d)) }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    if (confirm("Ștergi tot conținutul calendarului?")) setCal(emptyCalendar());
  }

  return (
    <div className="themed" style={THEMES[cal.theme].vars as React.CSSProperties}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm opacity-70 hover:opacity-100">
            ← Înapoi
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-70">{filled}/24 zile completate</span>
            <button onClick={reset} className="btn-ghost">
              Reset
            </button>
          </div>
        </header>

        <h1 className="mb-6 text-3xl font-bold">Creează calendarul</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: calendar settings + day tiles */}
          <section className="flex flex-col gap-4">
            <div className="panel grid gap-3 sm:grid-cols-2">
              <label className="field sm:col-span-2">
                Titlu
                <input value={cal.title} onChange={(e) => setCal({ ...cal, title: e.target.value })} />
              </label>
              <label className="field">
                Pentru
                <input placeholder="Ana" value={cal.to} onChange={(e) => setCal({ ...cal, to: e.target.value })} />
              </label>
              <label className="field">
                De la
                <input placeholder="Danny" value={cal.from} onChange={(e) => setCal({ ...cal, from: e.target.value })} />
              </label>
              <div className="field sm:col-span-2">
                Temă
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCal({ ...cal, theme: t })}
                      className={`btn-ghost flex items-center gap-2 ${cal.theme === t ? "ring-2" : ""}`}
                      style={{ ["--tw-ring-color" as string]: "var(--accent)" }}
                    >
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-white/40"
                        style={{ background: `linear-gradient(135deg, ${THEMES[t].vars["--bg"]}, ${THEMES[t].vars["--door"]})` }}
                      />
                      {THEMES[t].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <p className="mb-3 text-sm opacity-70">Alege o zi și completează surpriza ei.</p>
              <div className="grid grid-cols-6 gap-2">
                {cal.days.map((d) => (
                  <button
                    key={d.n}
                    onClick={() => setSelected(d.n)}
                    className={`tile ${isFilled(d) ? "tile-filled" : ""} ${selected === d.n ? "tile-active" : ""}`}
                    aria-label={`Ziua ${d.n}`}
                  >
                    <span>{d.n}</span>
                    {isFilled(d) && <span className="text-xs">{KIND_ICON[d.kind]}</span>}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: day editor + share */}
          <section className="flex flex-col gap-4">
            <div className="panel flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selected} decembrie</h2>
                <div className="flex gap-1">
                  <button className="btn-ghost" onClick={() => setSelected(Math.max(1, selected - 1))} disabled={selected === 1}>
                    ‹
                  </button>
                  <button className="btn-ghost" onClick={() => setSelected(Math.min(24, selected + 1))} disabled={selected === 24}>
                    ›
                  </button>
                </div>
              </div>

              <div className="field">
                Tip de surpriză
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(KIND_LABEL) as DayKind[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => patchDay({ kind: k })}
                      className={`btn-ghost ${day.kind === k ? "ring-2" : ""}`}
                      style={{ ["--tw-ring-color" as string]: "var(--accent)" }}
                    >
                      {KIND_ICON[k]} {KIND_LABEL[k]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field">
                Titlu
                <input placeholder="Ex: O amintire de iarnă" value={day.title ?? ""} onChange={(e) => patchDay({ title: e.target.value })} />
              </label>

              {day.kind === "image" && (
                <label className="field">
                  Link către poză
                  <input placeholder="https://..." value={day.url ?? ""} onChange={(e) => patchDay({ url: e.target.value })} />
                  <span className="text-xs opacity-60">În versiunea finală vei putea încărca poza direct.</span>
                </label>
              )}
              {day.kind === "video" && (
                <label className="field">
                  Link YouTube
                  <input placeholder="https://youtube.com/watch?v=..." value={day.url ?? ""} onChange={(e) => patchDay({ url: e.target.value })} />
                </label>
              )}
              {day.kind === "coupon" && (
                <label className="field">
                  Cod cupon
                  <input placeholder="CIOCO-03" value={day.code ?? ""} onChange={(e) => patchDay({ code: e.target.value })} />
                </label>
              )}

              <label className="field">
                Mesaj
                <textarea rows={4} placeholder="Scrie ceva frumos…" value={day.body ?? ""} onChange={(e) => patchDay({ body: e.target.value })} />
              </label>
            </div>

            <div className="panel flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Trimite</h2>
              <p className="text-sm opacity-70">
                În prototip, tot calendarul e în link. Copiază-l și trimite-l; cine îl deschide vede ușițele.
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={copy} className="btn">
                  {copied ? "Copiat ✓" : "Copiază link-ul"}
                </button>
                <a href={link} target="_blank" rel="noreferrer" className="btn-ghost">
                  Previzualizează
                </a>
              </div>
              <input readOnly value={link} className="w-full rounded-lg bg-black/20 px-3 py-2 text-xs opacity-70" onFocus={(e) => e.target.select()} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
