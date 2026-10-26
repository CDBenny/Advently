export interface Ymd {
  y: number;
  m: number; // 1..12
  d: number;
}

const TZ = "Europe/Bucharest";

export function todayInBucharest(now: Date = new Date()): Ymd {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export function parseYmd(s: string): Ymd | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

export function formatYmd(t: Ymd): string {
  return `${t.y}-${String(t.m).padStart(2, "0")}-${String(t.d).padStart(2, "0")}`;
}

// Door `day` of calendar `year` opens on December `day` of that year
// and stays open afterwards.
export function canOpen(day: number, year: number, today: Ymd): boolean {
  if (today.y > year) return true;
  if (today.y < year) return false;
  return today.m === 12 && today.d >= day;
}

export function daysUntilDecember(year: number, today: Ymd): number {
  const a = Date.UTC(today.y, today.m - 1, today.d);
  const b = Date.UTC(year, 11, 1);
  return Math.max(0, Math.round((b - a) / 86400000));
}
