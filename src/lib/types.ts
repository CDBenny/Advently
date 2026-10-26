export type DayKind = "text" | "image" | "video" | "coupon";

export interface Day {
  n: number; // 1..24
  kind: DayKind;
  title?: string;
  body?: string;
  url?: string; // image or video link
  code?: string; // coupon code
}

export type ThemeId = "clasic" | "polar" | "aur" | "padure";

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
    name: "Clasic",
    vars: {
      "--bg": "#7a1420",
      "--bg2": "#3f0b12",
      "--door": "#1f5a3a",
      "--door2": "#13412a",
      "--accent": "#f3c86b",
      "--ink": "#fff8ee",
      "--card": "#fff8ee",
      "--card-ink": "#2a1a12",
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

export const KIND_LABEL: Record<DayKind, string> = {
  text: "Mesaj",
  image: "Poză",
  video: "Video",
  coupon: "Cupon",
};

export const KIND_ICON: Record<DayKind, string> = {
  text: "💌",
  image: "📷",
  video: "🎬",
  coupon: "🎟️",
};

export function emptyCalendar(): Calendar {
  return {
    v: 1,
    title: "Calendarul meu de Advent",
    to: "",
    from: "",
    theme: "clasic",
    year: 2026,
    days: Array.from({ length: 24 }, (_, i) => ({ n: i + 1, kind: "text" as DayKind })),
  };
}

export function demoCalendar(): Calendar {
  const c = emptyCalendar();
  c.title = "Advent pentru Ana";
  c.to = "Ana";
  c.from = "Danny";
  c.theme = "polar";
  const fill: Partial<Day>[] = [
    { kind: "text", title: "Bun venit!", body: "A început decembrie. În fiecare zi te așteaptă ceva aici. ❄️" },
    { kind: "image", title: "O amintire", url: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200" },
    { kind: "coupon", title: "Cupon de ciocolată caldă", code: "CIOCO-03", body: "Valabil oricând în decembrie." },
    { kind: "video", title: "Melodia zilei", url: "https://www.youtube.com/watch?v=aAkMkVFwAoo" },
    { kind: "text", title: "Întrebare", body: "Care e cea mai frumoasă amintire a ta de iarnă?" },
  ];
  c.days = c.days.map((d, i) => ({ ...d, ...fill[i % fill.length], n: d.n }));
  return c;
}
