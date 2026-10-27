"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/context";
import { emptyCalendar, KIND_ICON, THEMES, type Calendar, type Day, type DayKind, type ThemeId } from "@/lib/types";
import { shareUrl } from "@/lib/codec";

const DRAFT_KEY = "advent:draft";
const KINDS: DayKind[] = ["text", "image", "video", "coupon"];

function isFilled(d: Day) {
  return Boolean(d.title || d.body || d.url || d.code);
}

export default function CreatePage() {
  const { locale, d, fill } = useI18n();
  const e = d.editor;
  const [cal, setCal] = useState<Calendar>(() => emptyCalendar(e.defaultTitle));
  const [selected, setSelected] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

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
    () => (typeof window === "undefined" ? "" : shareUrl(cal, window.location.origin, locale)),
    [cal, locale],
  );

  function patchDay(p: Partial<Day>) {
    setCal((c) => ({ ...c, days: c.days.map((x) => (x.n === selected ? { ...x, ...p } : x)) }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    setCal(emptyCalendar(e.defaultTitle));
    setConfirmReset(false);
  }

  return (
    <div className="themed" style={THEMES[cal.theme].vars as React.CSSProperties}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/${locale}`} className="text-sm opacity-70 hover:opacity-100">
            {d.nav.back}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <LanguageSwitcher />
            <span className="opacity-70">{fill(e.filled, { n: filled })}</span>
            <button onClick={reset} className="btn-ghost" aria-live="polite">
              {confirmReset ? e.resetConfirm : e.reset}
            </button>
          </div>
        </header>

        <h1 className="display mb-6 text-3xl">{e.title}</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: calendar settings + day tiles */}
          <section className="flex flex-col gap-4">
            <div className="panel grid gap-3 sm:grid-cols-2">
              <label className="field sm:col-span-2">
                {e.calTitle}
                <input id="cal-title" value={cal.title} onChange={(ev) => setCal({ ...cal, title: ev.target.value })} />
              </label>
              <label className="field">
                {e.forWhom}
                <input id="cal-to" placeholder={d.demo.to} value={cal.to} onChange={(ev) => setCal({ ...cal, to: ev.target.value })} />
              </label>
              <label className="field">
                {e.fromWhom}
                <input id="cal-from" placeholder={d.demo.from} value={cal.from} onChange={(ev) => setCal({ ...cal, from: ev.target.value })} />
              </label>
              <div className="field sm:col-span-2">
                {e.theme}
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
                      {d.theme[t]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <p className="mb-3 text-sm opacity-70">{e.pickDay}</p>
              <div className="grid grid-cols-6 gap-2">
                {cal.days.map((x) => (
                  <button
                    key={x.n}
                    onClick={() => setSelected(x.n)}
                    className={`tile ${isFilled(x) ? "tile-filled" : ""} ${selected === x.n ? "tile-active" : ""}`}
                    aria-label={fill(e.dayAria, { n: x.n })}
                  >
                    <span>{x.n}</span>
                    {isFilled(x) && <span className="text-xs">{KIND_ICON[x.kind]}</span>}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: day editor + share */}
          <section className="flex flex-col gap-4">
            <div className="panel flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="display text-xl">{fill(e.dayAria, { n: selected })}</h2>
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
                {e.kind}
                <div className="flex flex-wrap gap-2">
                  {KINDS.map((k) => (
                    <button
                      key={k}
                      onClick={() => patchDay({ kind: k })}
                      className={`btn-ghost ${day.kind === k ? "ring-2" : ""}`}
                      style={{ ["--tw-ring-color" as string]: "var(--accent)" }}
                    >
                      {KIND_ICON[k]} {d.kind[k]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field">
                {e.dayTitle}
                <input id="day-title" placeholder={e.dayTitlePh} value={day.title ?? ""} onChange={(ev) => patchDay({ title: ev.target.value })} />
              </label>

              {day.kind === "image" && (
                <label className="field">
                  {e.imageUrl}
                  <input id="day-url" placeholder="https://..." value={day.url ?? ""} onChange={(ev) => patchDay({ url: ev.target.value })} />
                  <span className="text-xs opacity-60">{e.imageNote}</span>
                </label>
              )}
              {day.kind === "video" && (
                <label className="field">
                  {e.videoUrl}
                  <input id="day-url" placeholder="https://youtube.com/watch?v=..." value={day.url ?? ""} onChange={(ev) => patchDay({ url: ev.target.value })} />
                </label>
              )}
              {day.kind === "coupon" && (
                <label className="field">
                  {e.code}
                  <input id="day-code" placeholder="CIOCO-03" value={day.code ?? ""} onChange={(ev) => patchDay({ code: ev.target.value })} />
                </label>
              )}

              <label className="field">
                {e.message}
                <textarea id="day-body" rows={4} placeholder={e.messagePh} value={day.body ?? ""} onChange={(ev) => patchDay({ body: ev.target.value })} />
              </label>
            </div>

            <div className="panel flex flex-col gap-3">
              <h2 className="display text-lg">{e.send}</h2>
              <p className="text-sm opacity-70">{e.sendNote}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={copy} className="btn">
                  {copied ? e.copied : e.copy}
                </button>
                <a href={link} target="_blank" rel="noreferrer" className="btn-ghost">
                  {e.preview}
                </a>
              </div>
              <input id="share-link" readOnly value={link} className="w-full rounded-lg bg-black/20 px-3 py-2 text-xs opacity-70" onFocus={(ev) => ev.target.select()} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
