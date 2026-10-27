"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/locales";

export default function LanguageSwitcher() {
  const { locale, d } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function change(next: Locale) {
    try {
      document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {}
    const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    router.push(`/${next}${rest}${window.location.hash}`);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{d.nav.language}</span>
      <span aria-hidden>🌐</span>
      <select
        id="language"
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        className="rounded-md border border-current/30 bg-transparent px-2 py-1 text-[inherit]"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="text-black">
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
