import { NextResponse, type NextRequest } from "next/server";

/**
 * Mobile detecta → app.maisvanta.com
 *
 * Quando alguém abre maisvanta.com num celular, redirecionamos pra
 * app.maisvanta.com. App é mobile-first, melhor UX. Desktop fica no
 * site institucional.
 *
 * Coordenado com index.html do app (repo VANTAV2): aquele lado faz o
 * caminho inverso (desktop visitante → maisvanta.com).
 *
 * Anti-loop:
 * - Cookie `vanta_stay_on_site=1` ou `?stay=1` na URL → desliga
 * - Skipa /api, /_next, /admin/* (redirect próprio em next.config.ts)
 */

const MOBILE_UA_REGEX = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

const SKIP_PATH_PREFIXES = [
  "/api",
  "/_next",
  "/_static",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (searchParams.get("stay") === "1") return NextResponse.next();
  if (request.cookies.get("vanta_stay_on_site")?.value === "1") return NextResponse.next();
  if (SKIP_PATH_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const ua = request.headers.get("user-agent") || "";
  if (!MOBILE_UA_REGEX.test(ua)) return NextResponse.next();

  const target = new URL(`https://app.maisvanta.com${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(target, 302);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
