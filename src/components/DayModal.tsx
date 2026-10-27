"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/context";
import type { Day } from "@/lib/types";
import { KIND_ICON } from "@/lib/types";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function DayModal({ day, year, onClose }: { day: Day; year: number; onClose: () => void }) {
  const { d, decDate } = useI18n();
  const m = d.modal;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const yt = day.kind === "video" && day.url ? youtubeId(day.url) : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm uppercase tracking-widest opacity-60">{decDate(year, day.n)}</span>
          <button onClick={onClose} className="btn-ghost" aria-label={m.close}>
            ✕
          </button>
        </div>
        <h2 id="day-title" className="mb-3 text-2xl font-semibold">
          {KIND_ICON[day.kind]} {day.title || m.surprise}
        </h2>

        {day.kind === "image" && day.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={day.url} alt={day.title || ""} className="mb-3 w-full rounded-xl" />
        )}

        {day.kind === "video" &&
          (yt ? (
            <div className="mb-3 aspect-video overflow-hidden rounded-xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${yt}`}
                title={day.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : day.url ? (
            <a href={day.url} target="_blank" rel="noreferrer" className="btn mb-3 inline-block">
              {m.openVideo}
            </a>
          ) : null)}

        {day.kind === "coupon" && (
          <div className="coupon mb-3">
            <span className="text-xs uppercase tracking-widest opacity-70">{m.code}</span>
            <span className="font-mono text-2xl font-bold">{day.code || "—"}</span>
          </div>
        )}

        {day.body && <p className="whitespace-pre-wrap text-lg leading-relaxed">{day.body}</p>}
        {!day.body && !day.url && !day.code && <p className="opacity-60">{m.empty}</p>}
      </div>
    </div>
  );
}
