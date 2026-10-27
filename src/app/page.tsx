import Link from "next/link";
import Snow from "@/components/Snow";
import { KIND_ICON } from "@/lib/types";

// Scrambled numbers like a paper calendar; a few doors shown open as if it were 8 December.
const ORDER = [7, 19, 3, 24, 11, 16, 1, 22, 9, 14, 5, 20, 12, 2, 18, 8, 23, 15, 4, 10, 21, 6, 17, 13];
const OPENED: Record<number, keyof typeof KIND_ICON> = {
  1: "text",
  2: "image",
  3: "coupon",
  4: "video",
  5: "text",
  6: "image",
  7: "coupon",
};

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Snow count={40} />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Advently · 1 decembrie
          </p>
          <h1 className="display mb-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            24 de ușițe.
            <br />
            <em style={{ color: "var(--accent)" }}>24 de surprize</em>
            <br />
            pentru cineva drag.
          </h1>
          <p className="mb-7 max-w-xl text-lg opacity-90">
            Pui în fiecare zi un mesaj, o poză, un video sau un cupon. Trimiți un link. Ușițele se deschid doar în
            ziua lor.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/create" className="btn">
              Creează calendarul tău →
            </Link>
            <Link href="/c?demo=1" className="btn-ghost">
              Vezi un exemplu
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2" aria-hidden>
          {ORDER.map((n) => {
            const kind = OPENED[n];
            return (
              <div key={n} className={`door ${kind ? "door-open" : ""} ${n === 24 ? "door-big" : ""}`}>
                <span className="door-back">
                  <span className="text-xl sm:text-2xl">{kind ? KIND_ICON[kind] : ""}</span>
                </span>
                <span className={`door-front ${kind ? "" : "door-locked"}`}>
                  <span className="door-num">{n}</span>
                  {!kind && <span className="door-lock">🔒</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="relative z-10 mt-14 grid gap-4 sm:grid-cols-3">
        {[
          ["Al tău, de la prima ușiță", "Mesaje, poze, videouri sau cupoane. Fiecare zi e scrisă de tine, pentru o singură persoană."],
          ["Răbdarea face parte din cadou", "Ușițele se deblochează pe rând, după ora locală. Nu se poate trișa, oricât ai încerca."],
          ["Un singur link", "Cine primește nu își face cont. Deschide link-ul de pe telefon și începe să aștepte ziua următoare."],
        ].map(([title, text]) => (
          <li key={title} className="panel">
            <div className="display mb-1 text-lg">{title}</div>
            <div className="text-sm opacity-80">{text}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
