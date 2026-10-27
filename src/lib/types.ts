export type DayKind = "text" | "image" | "video" | "coupon";

export interface Day {
  n: number; // 1..24
  kind: DayKind;
  title?: string;
  body?: string;
  url?: string; // image or video link
  code?: string; // coupon code
}

export type ThemeId = "clasic" | "polar" | "aur" | "padure" | "zapada";

export interface Calendar {
  v: 1;
  title: string;
  to: string; // recipient
  from: string; // creator
  theme: ThemeId;
  year: number;
  days: Day[];
}

export const THEMES: Record<ThemeId, { name: string; vars: Record<string, string> }> = {
  clasic: {
    name: "Seară de iarnă",
    vars: {
      "--bg": "#5e1220",
      "--bg2": "#2a0a12",
      "--door": "#1d5236",
      "--door2": "#12381f",
      "--accent": "#f0c56a",
      "--ink": "#fff6e8",
      "--card": "#fff6e8",
      "--card-ink": "#2a1a12",
    },
  },
  zapada: {
    name: "Zăpadă",
    vars: {
      "--bg": "#f3f7fb",
      "--bg2": "#dfe9f3",
      "--door": "#cfeee0",
      "--door2": "#b9e2cf",
      "--accent": "#e4553f",
      "--ink": "#163a2c",
      "--card": "#ffffff",
      "--card-ink": "#163a2c",
    },
  },
  polar: {
    name: "Noapte polară",
    vars: {
      "--bg": "#0c2342",
      "--bg2": "#040d1c",
      "--door": "#1e4f7a",
      "--door2": "#133a5c",
      "--accent": "#bfe9ff",
      "--ink": "#eef7ff",
      "--card": "#f2f8ff",
      "--card-ink": "#0b1b2e",
    },
  },
  aur: {
    name: "Aur elegant",
    vars: {
      "--bg": "#1a1612",
      "--bg2": "#0a0806",
      "--door": "#2b241c",
      "--door2": "#1c1711",
      "--accent": "#e2b857",
      "--ink": "#f7efe0",
      "--card": "#f7efe0",
      "--card-ink": "#1a1612",
    },
  },
  padure: {
    name: "Pădure",
    vars: {
      "--bg": "#17392b",
      "--bg2": "#0a1f17",
      "--door": "#8b3a2a",
      "--door2": "#612619",
      "--accent": "#f0e0b8",
      "--ink": "#f5f1e6",
      "--card": "#f5f1e6",
      "--card-ink": "#1d2a22",
    },
  },
};

export const KIND_ICON: Record<DayKind, string> = {
  text: "💌",
  image: "📷",
  video: "🎬",
  coupon: "🎟️",
};

export function emptyCalendar(title: string): Calendar {
  return {
    v: 1,
    title,
    to: "",
    from: "",
    theme: "clasic",
    year: 2026,
    days: Array.from({ length: 24 }, (_, i) => ({ n: i + 1, kind: "text" as DayKind })),
  };
}

// The demo texts come from the active language's dictionary.
export interface DemoText {
  title: string;
  to: string;
  from: string;
  d1t: string;
  d1: string;
  d2t: string;
  d3t: string;
  d3: string;
  d4t: string;
  d5t: string;
  d5: string;
}

export function demoCalendar(t: DemoText): Calendar {
  const c = emptyCalendar(t.title);
  c.to = t.to;
  c.from = t.from;
  c.theme = "polar";
  const fill: Partial<Day>[] = [
    { kind: "text", title: t.d1t, body: t.d1 },
    { kind: "image", title: t.d2t, url: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200" },
    { kind: "coupon", title: t.d3t, code: "CIOCO-03", body: t.d3 },
    { kind: "video", title: t.d4t, url: "https://www.youtube.com/watch?v=aAkMkVFwAoo" },
    { kind: "text", title: t.d5t, body: t.d5 },
  ];
  c.days = c.days.map((d, i) => ({ ...d, ...fill[i % fill.length], n: d.n }));
  return c;
}
