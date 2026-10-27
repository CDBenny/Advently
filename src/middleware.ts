import { NextResponse, type NextRequest } from "next/server";
import { isLocale, matchLocale } from "@/i18n/locales";

// Every page lives under /{locale}. A request without one is sent to the
// visitor's language: the cookie set by the language switcher wins, then
// the browser's Accept-Language header, then English.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookie) ? cookie : matchLocale(req.headers.get("accept-language"));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the favicon and any file with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
