"use client";

import { createContext, useContext } from "react";
import type { Dict } from "./ro";
import type { Locale } from "./locales";
import { decemberDate, fill, plural } from "./index";

interface I18n {
  locale: Locale;
  d: Dict;
  fill: typeof fill;
  plural: (n: number, forms: { one: string; few: string; other: string }) => string;
  decDate: (year: number, day: number) => string;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  const value: I18n = {
    locale,
    d: dict,
    fill,
    plural: (n, forms) => plural(locale, n, forms),
    decDate: (year, day) => decemberDate(locale, year, day),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
