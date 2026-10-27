import LZString from "lz-string";
import type { Calendar } from "./types";

// Prototype storage: the whole calendar travels inside the share link.
// Later this becomes an id pointing at a database row.
export function encodeCalendar(c: Calendar): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(c));
}

export function decodeCalendar(s: string): Calendar | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(s);
    if (!json) return null;
    const c = JSON.parse(json) as Calendar;
    if (c.v !== 1 || !Array.isArray(c.days) || c.days.length !== 24) return null;
    return c;
  } catch {
    return null;
  }
}

export function shareUrl(c: Calendar, origin: string, locale: string): string {
  return `${origin}/${locale}/c#d=${encodeCalendar(c)}`;
}

export function readHashCalendar(): Calendar | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/d=([^&]+)/);
  return m ? decodeCalendar(m[1]) : null;
}
