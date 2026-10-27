import type { Dict } from "./ro";
import ro from "./ro";
import en from "./en";
import de from "./de";
import fr from "./fr";
import es from "./es";
import it from "./it";
import pl from "./pl";
import type { Locale } from "./locales";

export const DICTS: Record<Locale, Dict> = { ro, en, de, fr, es, it, pl };

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

type PluralForms = { one: string; few: string; other: string };

// Picks the right form for the locale (Romanian has "few" for 2..19, Polish for 2..4, and so on).
export function plural(locale: Locale, n: number, forms: PluralForms): string {
  const cat = new Intl.PluralRules(locale).select(n);
  const t = cat === "one" ? forms.one : cat === "few" ? forms.few : forms.other;
  return fill(t, { n });
}

// "7 decembrie" / "December 7" / "7. Dezember" for door n of the given year.
export function decemberDate(locale: Locale, year: number, day: number): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(year, 11, day));
}

export type { Dict };
