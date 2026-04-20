import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Mobile detecta → app.maisvanta.com
 *
 * Quando alguém abre maisvanta.com num celular, redirecionamos pra
 * app.maisvanta.com. App é mobile-first, melhor UX. Desktop fica no
 * site institucional.
 *
 * Coordenado com index.html do app (repo VANTAV2): aquele lado faz o
 * caminho inverso (desktop visitante → maisvanta.com). Cobertura:
 *   maisvanta.com mobile      → app (esse redirect)
 *   maisvanta.com desktop     → site (passa direto)
 *   app.maisvanta.com mobile  → app (já estava)
 *   app.maisvanta.com desktop sem sessão → site (redirect VANTAV2)
 *   app.maisvanta.com desktop logado     → app pra usar /admin
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
  "/admin", // redirect próprio em next.config.ts
];

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Tenta redirect mobile→app PRIMEIRO (antes de tocar em sessão)
  const noRedirectQuery = searchParams.get("stay") === "1";
  const noRedirectCookie = request.cookies.get("vanta_stay_on_site")?.value === "1";
  const isSkippedPath = SKIP_PATH_PREFIXES.some((p) => pathname.startsWith(p));

  if (!noRedirectQuery && !noRedirectCookie && !isSkippedPath) {
    const ua = request.headers.get("user-agent") || "";
    if (MOBILE_UA_REGEX.test(ua)) {
      const target = new URL(
        `https://app.maisvanta.com${pathname}${request.nextUrl.search}`,
      );
      return NextResponse.redirect(target, 302);
    }
  }

  // Desktop ou path skipado: refresh sessão Supabase normal
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
