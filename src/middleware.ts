import { NextResponse, type NextRequest } from 'next/server';

/**
 * Mobile → app.maisvanta.com
 *
 * Quando alguém abre maisvanta.com (ou www.maisvanta.com) num celular,
 * redirecionamos pra app.maisvanta.com — o app é mobile-first e dá
 * melhor experiência. Em desktop, mostramos o site institucional.
 *
 * Coordenado com index.html do app (repo VANTAV2): aquele lado faz o
 * caminho inverso (desktop visitante → maisvanta.com). Juntos cobrem:
 *   maisvanta.com mobile      → app
 *   maisvanta.com desktop     → site (não mexemos)
 *   app.maisvanta.com mobile  → app (já estava)
 *   app.maisvanta.com desktop sem sessão → maisvanta.com → site
 *   app.maisvanta.com desktop logado     → fica no app pra usar /admin
 *
 * Anti-loop:
 * - Cookie `vanta_stay_on_site=1` desliga o redirect (escape hatch debug)
 * - Querystring `?stay=1` também desliga (debug rápido)
 * - Skipa /api, /_next, /_static, /favicon, /robots.txt, /sitemap.xml
 * - Skipa /admin/* (já tem redirect próprio em next.config.ts)
 */

const MOBILE_UA_REGEX = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

const SKIP_PATH_PREFIXES = [
  '/api',
  '/_next',
  '/_static',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
  '/admin', // tem redirect próprio em next.config.ts
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Escape hatch — útil pra debug e pra crawler que quer ver versão desktop
  if (searchParams.get('stay') === '1') return NextResponse.next();
  if (request.cookies.get('vanta_stay_on_site')?.value === '1') return NextResponse.next();

  // Skipa paths técnicos
  if (SKIP_PATH_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  // Detecta mobile via user-agent (Sec-CH-UA-Mobile não disponível em todos browsers ainda)
  const ua = request.headers.get('user-agent') || '';
  const isMobile = MOBILE_UA_REGEX.test(ua);

  if (!isMobile) return NextResponse.next();

  // Mobile detectado — redirect pro app preservando path + query
  const target = new URL(`https://app.maisvanta.com${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(target, 302);
}

export const config = {
  // Roda em todas as rotas EXCETO arquivos estáticos óbvios
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
