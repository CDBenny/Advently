import Link from "next/link";
import Snow from "@/components/Snow";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <Snow count={40} />
      <div className="relative z-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] opacity-70">Prototip · 1 decembrie 2026</p>
        <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-6xl">
          24 de ușițe.
          <br />
          <span style={{ color: "var(--accent)" }}>24 de surprize.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg opacity-85">
          Creează un calendar de Advent pentru cineva drag: mesaje, poze, videouri sau cupoane. Trimiți un link, iar
          ușițele se deschid doar în ziua lor.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/create" className="btn">
            Creează calendarul tău →
          </Link>
          <Link href="/c?demo=1" className="btn-ghost">
            Vezi un exemplu
          </Link>
        </div>

        <ul className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {[
            ["🎁", "Personal", "Fiecare zi are ce vrei tu: un mesaj, o poză, un video sau un cupon."],
            ["🔒", "Răbdare", "Ușițele se deblochează pe rând, după ora României. Nu se trișează."],
            ["🔗", "Un link", "Cine primește nu are nevoie de cont. Deschide link-ul și gata."],
          ].map(([icon, title, text]) => (
            <li key={title} className="panel">
              <div className="mb-2 text-2xl">{icon}</div>
              <div className="mb-1 font-semibold">{title}</div>
              <div className="text-sm opacity-80">{text}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
